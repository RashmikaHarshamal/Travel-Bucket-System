#!/bin/bash
set -e

DOCKER_USER=$1
DOCKER_PASS=$2

echo "🔐 Logging into DockerHub..."
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

echo "🏷 Tagging images..."
docker tag travel-frontend:latest $DOCKER_USER/travel-frontend:latest
docker tag travel-backend:latest  $DOCKER_USER/travel-backend:latest

echo "🚀 Pushing images..."
docker push $DOCKER_USER/travel-frontend:latest
docker push $DOCKER_USER/travel-backend:latest
echo "✅ Docker images pushed successfully"
