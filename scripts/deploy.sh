#!/usr/bin/env bash
set -euo pipefail

# Pick docker compose command (v2 plugin or legacy binary), auto-install if missing
detect_compose() {
	if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
		COMPOSE_CMD="docker compose"
		return 0
	fi

	if command -v docker-compose >/dev/null 2>&1; then
		COMPOSE_CMD="docker-compose"
		return 0
	fi

	echo "Docker Compose not found; attempting install via apt (requires sudo)."
	if command -v sudo >/dev/null 2>&1; then
		# Some hosts have extra apt repos with missing keys; don't fail the deploy on apt update warnings.
		sudo apt-get update -y || true
		# Prefer Compose v2 plugin packages when available; fall back to legacy docker-compose.
		sudo apt-get install -y docker-compose-plugin \
			|| sudo apt-get install -y docker-compose-v2 \
			|| sudo apt-get install -y docker-compose
	else
		echo "sudo not available; please install docker compose manually." >&2
		return 1
	fi

	# Re-check after install
	if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
		COMPOSE_CMD="docker compose"
		return 0
	fi
	if command -v docker-compose >/dev/null 2>&1; then
		COMPOSE_CMD="docker-compose"
		return 0
	fi

	echo "Docker Compose installation failed; please install manually." >&2
	return 1
}

detect_compose

# Free a port if a Docker container is already binding it
free_docker_port() {
	local port="$1"
	local ids
	ids=$(docker ps --format '{{.ID}} {{.Ports}}' | awk -v p=":${port}->" '$0 ~ p {print $1}')
	if [[ -n "$ids" ]]; then
		echo "Port ${port} is in use by existing container(s); removing them: ${ids}"
		# shellcheck disable=SC2086
		docker rm -f $ids || true
	fi

	# If still in use, it's likely a non-docker process (or a container we couldn't remove)
	if command -v ss >/dev/null 2>&1; then
		if ss -ltn 2>/dev/null | grep -q ":${port} "; then
			echo "Port ${port} is still in use on the host (not freed by removing containers)." >&2
			ss -ltnp 2>/dev/null | grep ":${port} " || true
			return 1
		fi
	fi

	return 0
}

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

# Avoid port binding conflicts from containers outside this compose project
free_docker_port 8081
free_docker_port 3000
free_docker_port 27018

$COMPOSE_CMD up -d

echo "Deployment completed"
echo "Backend: http://localhost:8081"
echo "Frontend: http://localhost:3000"
