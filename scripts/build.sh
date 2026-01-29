#!/bin/bash
set -e

echo "🔨 Building Docker images..."
docker build -t travel-frontend:latest ./frontend
docker build -t travel-backend:latest ./backend
echo "✅ Docker images built successfully"
