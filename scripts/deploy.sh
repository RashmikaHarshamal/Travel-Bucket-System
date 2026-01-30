#!/bin/bash
set -euo pipefail

# Pick docker compose command (v2 plugin or legacy binary)
if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
	COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
	COMPOSE_CMD="docker-compose"
else
	echo "Docker Compose is not installed on this host. Install the v2 plugin (preferred) or docker-compose." >&2
	exit 1
fi

# Accept credentials via env or positional args
DOCKER_USER="${DOCKER_USER:-${1:-}}"
DOCKER_PASS="${DOCKER_PASS:-${2:-}}"
IMAGE_PREFIX="${DOCKER_REPO:-${DOCKER_USER}}"

if [[ -z "${IMAGE_PREFIX}" ]]; then
	echo "Missing Docker repository. Set DOCKER_REPO or DOCKER_USER."
	exit 1
fi

WORKDIR="${DEPLOY_DIR:-$HOME/travel-bucket}"
mkdir -p "$WORKDIR"
cd "$WORKDIR"

if [[ -n "${DOCKER_PASS}" ]]; then
	echo "Logging in to Docker Hub"
	echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
fi

cat > docker-compose.yml <<EOF
version: "3.8"

services:
	mongo:
		image: mongo:6
		container_name: mongo
		restart: unless-stopped
		volumes:
			- mongo_data:/data/db
		ports:
			- "27018:27017"

	backend:
		image: ${IMAGE_PREFIX}/backend:latest
		container_name: backend
		restart: unless-stopped
		environment:
			- SPRING_DATA_MONGODB_URI=mongodb://mongo:27017/Travel_Bucket
			- SPRING_PROFILES_ACTIVE=prod
		depends_on:
			- mongo
		ports:
			- "8081:8080"

	frontend:
		image: ${IMAGE_PREFIX}/frontend:latest
		container_name: frontend
		restart: unless-stopped
		depends_on:
			- backend
		ports:
			- "3000:80"

volumes:
	mongo_data:
EOF

$COMPOSE_CMD pull backend frontend mongo
$COMPOSE_CMD down --remove-orphans
$COMPOSE_CMD up -d

echo "Deployment completed"
echo "Backend: http://localhost:8081"
echo "Frontend: http://localhost:3000"
