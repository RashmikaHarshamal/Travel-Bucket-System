#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

IMAGE_PREFIX="${DOCKER_REPO:-${DOCKER_USER:-travelbucket}}"
BACKEND_TAG="${IMAGE_PREFIX}/backend:latest"
FRONTEND_TAG="${IMAGE_PREFIX}/frontend:latest"

echo "Building backend image ${BACKEND_TAG}"
docker build -t "$BACKEND_TAG" ./backend

echo "Building frontend image ${FRONTEND_TAG}"
docker build -t "$FRONTEND_TAG" ./frontend

echo "Docker images built"
