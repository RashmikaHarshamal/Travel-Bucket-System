#!/bin/bash
set -e

echo "[user-data] Updating system packages..."
dnf -y update

echo "[user-data] Installing docker and tools..."
dnf -y install docker docker-compose-plugin git

systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user || true

echo "[user-data] Docker installed. You can now deploy containers via your CI/CD."
