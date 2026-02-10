#!/bin/bash
set -e

IMAGE=${1:-ncrs-shell-source:latest}

echo "Extracting host source from $IMAGE..."
CONTAINER=$(docker create "$IMAGE")
rm -rf host-source/src
mkdir -p host-source/src
docker cp "$CONTAINER:/app/src/js" host-source/src/js
docker rm "$CONTAINER" > /dev/null
echo "Done — host source extracted to host-source/src/js"
