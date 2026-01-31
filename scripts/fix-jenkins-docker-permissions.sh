#!/usr/bin/env bash
# Fix Jenkins Docker permissions on Ubuntu/Debian agents
# Run this script with sudo on the Jenkins agent EC2 instance:
#   sudo bash fix-jenkins-docker-permissions.sh

set -euo pipefail

echo "=== Jenkins Docker Permissions Fix ==="
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "ERROR: This script must be run as root (use sudo)" 
   exit 1
fi

# Verify docker group exists
if ! getent group docker >/dev/null; then
    echo "Creating docker group..."
    groupadd docker
fi

# Verify jenkins user exists
if ! id jenkins >/dev/null 2>&1; then
    echo "ERROR: jenkins user not found. Is Jenkins installed?"
    exit 1
fi

# Check current jenkins groups
echo "Current jenkins user groups:"
id jenkins

# Add jenkins to docker group
echo ""
echo "Adding jenkins user to docker group..."
usermod -aG docker jenkins

echo ""
echo "New jenkins user groups:"
id jenkins

# Verify Docker service is running
echo ""
echo "Checking Docker service status..."
if systemctl is-active --quiet docker; then
    echo "✓ Docker service is running"
else
    echo "⚠ Docker service is not running. Starting it..."
    systemctl start docker
    systemctl enable docker
fi

# Set correct permissions on docker socket
echo ""
echo "Setting docker socket permissions..."
chown root:docker /var/run/docker.sock
chmod 660 /var/run/docker.sock
ls -l /var/run/docker.sock

echo ""
echo "=== Fix Applied Successfully ==="
echo ""
echo "IMPORTANT: You must now restart Jenkins for the group change to take effect:"
echo ""
echo "  Option 1 - Restart Jenkins service:"
echo "    sudo systemctl restart jenkins"
echo ""
echo "  Option 2 - Reboot the instance:"
echo "    sudo reboot"
echo ""
echo "After restart, verify with: sudo -u jenkins docker ps"
echo ""
