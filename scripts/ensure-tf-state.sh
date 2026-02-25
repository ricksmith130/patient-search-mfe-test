#!/bin/bash
set -e

BUCKET_NAME=$1
REGION=$2
DYNAMODB_TABLE=$3

if [ -z "$BUCKET_NAME" ] || [ -z "$REGION" ]; then
  echo "Usage: $0 <bucket-name> <region> [dynamodb-table]"
  exit 1
fi

echo "Checking Terraform state bucket: $BUCKET_NAME in $REGION..."

# Check if bucket exists
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  echo "✅ Bucket $BUCKET_NAME already exists."
else
  echo "Bucket $BUCKET_NAME does not exist. Creating..."
  
  if [ "$REGION" == "us-east-1" ]; then
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION"
  else
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION" --create-bucket-configuration LocationConstraint="$REGION"
  fi
  
  # Enable Versioning (Recommended for Terraform state)
  aws s3api put-bucket-versioning --bucket "$BUCKET_NAME" --versioning-configuration Status=Enabled
  
  # Enable Encryption
  aws s3api put-bucket-encryption --bucket "$BUCKET_NAME" --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'

  echo "✅ Bucket properties configured."
fi

# Optional: Create DynamoDB table for locking
if [ -n "$DYNAMODB_TABLE" ]; then
  echo "Checking DynamoDB lock table: $DYNAMODB_TABLE..."
  
  if aws dynamodb describe-table --table-name "$DYNAMODB_TABLE" --region "$REGION" >/dev/null 2>&1; then
    echo "✅ Table $DYNAMODB_TABLE already exists."
  else
    echo "Table $DYNAMODB_TABLE does not exist. Creating..."
    aws dynamodb create-table \
      --table-name "$DYNAMODB_TABLE" \
      --attribute-definitions AttributeName=LockID,AttributeType=S \
      --key-schema AttributeName=LockID,KeyType=HASH \
      --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
      --region "$REGION"
      
    echo "✅ Table created."
  fi
fi
