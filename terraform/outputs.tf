output "bucket_name" {
  description = "Name of the S3 bucket hosting the site"
  value       = aws_s3_bucket.app_bucket.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID"
  value       = aws_cloudfront_distribution.cdn.id
}

output "website_url" {
  description = "CloudFront URL for the website"
  value       = "https://${aws_cloudfront_distribution.cdn.domain_name}"
}
