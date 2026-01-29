#!/bin/bash
set -e

DOCKER_USER=$1

echo "🛑 Stopping old containers..."
docker stop travel-frontend travel-backend || true
docker rm travel-frontend travel-backend || true

echo "⬇ Pulling latest images from DockerHub..."
docker pull $DOCKER_USER/travel-frontend:latest
docker pull $DOCKER_USER/travel-backend:latest

echo "🚀 Starting backend..."
docker run -d --name travel-backend -p 8080:8080 $DOCKER_USER/travel-backend:latest

echo "🚀 Starting frontend..."
docker run -d --name travel-frontend -p 3000:80 $DOCKER_USER/travel-frontend:latest

echo "✅ Deployment completed"
