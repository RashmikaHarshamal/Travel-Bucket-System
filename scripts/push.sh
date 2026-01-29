#!/bin/bash
set -e

DOCKER_USER=$1
DOCKER_PASS=$2

echo "🔐 Logging in to Docker Hub..."
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

echo "🏷️ Tagging frontend and backend images..."
docker tag travel-frontend:latest $DOCKER_USER/travel-frontend:latest
docker tag travel-backend:latest  $DOCKER_USER/travel-backend:latest

echo "📤 Pushing images to Docker Hub..."
docker push $DOCKER_USER/travel-frontend:latest
docker push $DOCKER_USER/travel-backend:latest

echo "✅ Images pushed successfully"
