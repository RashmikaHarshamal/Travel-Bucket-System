#!/bin/bash
set -e

echo "🔨 Building Docker images..."

# Go to repo root
cd "$(dirname "$0")/.."

# Build images for Travel Bucket project
docker build -t travel-frontend:latest ./frontend
docker build -t travel-backend:latest ./backend

echo "✅ Docker images built successfully"
