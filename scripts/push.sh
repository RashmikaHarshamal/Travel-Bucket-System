#!/usr/bin/env bash
set -euo pipefail

if [[ "${DOCKER_USE_SUDO:-0}" == "1" ]]; then
	DOCKER=(sudo -n docker)
else
	DOCKER=(docker)
fi

DOCKER_USER="$1"
DOCKER_PASS="$2"
IMAGE_PREFIX="${DOCKER_REPO:-$DOCKER_USER}"

echo "Logging in to Docker Hub"
echo "$DOCKER_PASS" | "${DOCKER[@]}" login -u "$DOCKER_USER" --password-stdin

echo "Pushing backend image ${IMAGE_PREFIX}/backend:latest"
"${DOCKER[@]}" push "${IMAGE_PREFIX}/backend:latest"

echo "Pushing frontend image ${IMAGE_PREFIX}/frontend:latest"
"${DOCKER[@]}" push "${IMAGE_PREFIX}/frontend:latest"

echo "Images pushed"
