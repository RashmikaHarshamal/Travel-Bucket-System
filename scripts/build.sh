#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ "${DOCKER_USE_SUDO:-0}" == "1" ]]; then
	DOCKER=(sudo -n docker)
else
	DOCKER=(docker)
fi

IMAGE_PREFIX="${DOCKER_REPO:-${DOCKER_USER:-travelbucket}}"
BACKEND_TAG="${IMAGE_PREFIX}/backend:latest"
FRONTEND_TAG="${IMAGE_PREFIX}/frontend:latest"

echo "Building backend image ${BACKEND_TAG}"
"${DOCKER[@]}" build -t "$BACKEND_TAG" ./backend

echo "Building frontend image ${FRONTEND_TAG}"
"${DOCKER[@]}" build -t "$FRONTEND_TAG" ./frontend

echo "Docker images built"
