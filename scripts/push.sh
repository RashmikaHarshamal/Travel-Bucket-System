#!/bin/bash
set -euo pipefail

DOCKER_USER="$1"
DOCKER_PASS="$2"
IMAGE_PREFIX="${DOCKER_REPO:-$DOCKER_USER}"

echo "Logging in to Docker Hub"
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

echo "Pushing backend image ${IMAGE_PREFIX}/backend:latest"
docker push "${IMAGE_PREFIX}/backend:latest"

echo "Pushing frontend image ${IMAGE_PREFIX}/frontend:latest"
docker push "${IMAGE_PREFIX}/frontend:latest"

echo "Images pushed"
