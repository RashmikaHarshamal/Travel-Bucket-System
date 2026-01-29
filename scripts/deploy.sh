#!/bin/bash
set -e

DOCKER_USER=$1

echo "🛑 Stopping old containers..."
docker stop travel-frontend travel-backend 2>/dev/null || true
docker rm travel-frontend travel-backend 2>/dev/null || true

echo "🧹 Cleaning up any containers using our ports..."
# Find and stop any container using port 8081 or 3000
docker ps -q --filter "publish=8081" | xargs -r docker stop 2>/dev/null || true
docker ps -q --filter "publish=3000" | xargs -r docker stop 2>/dev/null || true
docker ps -aq --filter "publish=8081" | xargs -r docker rm 2>/dev/null || true
docker ps -aq --filter "publish=3000" | xargs -r docker rm 2>/dev/null || true

echo "⬇ Pulling latest images from DockerHub..."
docker pull $DOCKER_USER/travel-frontend:latest
docker pull $DOCKER_USER/travel-backend:latest

echo "🚀 Starting backend..."
docker run -d --name travel-backend -p 8081:8080 $DOCKER_USER/travel-backend:latest

echo "🚀 Starting frontend..."
docker run -d --name travel-frontend -p 3000:80 $DOCKER_USER/travel-frontend:latest

echo "✅ Deployment completed"
echo "📍 Backend: http://localhost:8081"
echo "📍 Frontend: http://localhost:3000"
