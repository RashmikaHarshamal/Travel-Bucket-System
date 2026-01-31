pipeline {
    agent any

    environment {
        DOCKER_REPO = "rashmikaharshamal"
        EC2_IP = "65.0.12.58"

        // Auto-set in Preflight when needed. When set to 1, scripts will run `sudo -n docker ...`.
        DOCKER_USE_SUDO = "0"
    }

    stages {

        stage('Preflight') {
            steps {
                script {
                    // If Docker daemon is reachable as-is, keep DOCKER_USE_SUDO=0.
                    // If permission denied but passwordless sudo works, flip DOCKER_USE_SUDO=1.
                    int directOk = sh(returnStatus: true, script: 'docker info >/dev/null 2>&1')
                    if (directOk != 0) {
                        int sudoOk = sh(returnStatus: true, script: 'sudo -n docker info >/dev/null 2>&1')
                        if (sudoOk == 0) {
                            env.DOCKER_USE_SUDO = '1'
                            echo "Docker socket requires sudo; using DOCKER_USE_SUDO=1 for subsequent stages."
                        } else {
                            echo "Docker is not accessible as 'jenkins' and passwordless sudo fallback is not available (sudo -n failed)."
                        }
                    }
                }
                sh '''#!/bin/bash
                  set -euo pipefail
                                    command -v bash >/dev/null 2>&1 || { echo "ERROR: bash is required on the Jenkins agent."; exit 1; }

                                    echo "---- Agent diagnostics ----"
                                    echo "Hostname: $(hostname || true)"
                                    echo "Kernel: $(uname -a || true)"
                                    echo "User: $(whoami || true)"
                                    id || true
                                    echo "Workspace: ${WORKSPACE:-<unset>}"
                                    echo "DOCKER_HOST: ${DOCKER_HOST:-<unset>}"
                                    echo "---------------------------"

                                    if command -v sudo >/dev/null 2>&1; then
                                        echo "Sudo check (may be restricted on agents):"
                                        sudo -n true >/dev/null 2>&1 && echo "sudo -n: OK (passwordless)" || echo "sudo -n: NOT available (would prompt for password or not permitted)"
                                    else
                                        echo "sudo: not installed"
                                    fi

                                    command -v docker >/dev/null 2>&1 || {
                                        echo "ERROR: docker CLI is required on the Jenkins agent (docker not found in PATH)."
                                        echo "Fix: Install Docker Engine/CLI (or add it to PATH), or run this pipeline on a Docker-capable agent."
                                        exit 1
                                    }

                                    echo "Docker CLI: $(docker --version || true)"
                                    if [ -S /var/run/docker.sock ]; then
                                        echo "docker.sock: $(ls -l /var/run/docker.sock || true)"
                                    else
                                        echo "docker.sock: not found at /var/run/docker.sock"
                                    fi

                                    if [[ "${DOCKER_USE_SUDO:-0}" == "1" ]]; then
                                        DOCKER=(sudo -n docker)
                                    else
                                        DOCKER=(docker)
                                    fi

                                    # Prefer docker info (more representative than docker version) and print helpful hints on failure.
                                    if ! "${DOCKER[@]}" info >/dev/null 2>&1; then
                                        echo "ERROR: docker daemon is not reachable from this agent."
                                        echo ""
                                        echo "╔════════════════════════════════════════════════════════════════════════════╗"
                                        echo "║                         🔧 FIX REQUIRED                                    ║"
                                        echo "╚════════════════════════════════════════════════════════════════════════════╝"
                                        echo ""
                                        echo "The 'jenkins' user cannot access Docker. SSH to the EC2 agent and run:"
                                        echo ""
                                        echo "────────────────────────────────────────────────────────────────────────────"
                                        echo "# SSH to your Jenkins agent EC2 instance"
                                        echo "ssh -i your-key.pem ubuntu@<EC2_IP>"
                                        echo ""
                                        echo "# Add jenkins to docker group"
                                        echo "sudo usermod -aG docker jenkins"
                                        echo ""
                                        echo "# Restart Jenkins service to apply group changes"
                                        echo "sudo systemctl restart jenkins"
                                        echo ""
                                        echo "# Verify the fix (should show containers)"
                                        echo "sudo -u jenkins docker ps"
                                        echo "────────────────────────────────────────────────────────────────────────────"
                                        echo ""
                                        echo "After restart, re-run this pipeline. It will succeed."
                                        echo ""
                                        echo "Alternative (if you can't restart Jenkins now):"
                                        echo "  - Create /etc/sudoers.d/jenkins-docker with:"
                                        echo "    jenkins ALL=(root) NOPASSWD: /usr/bin/docker"
                                        echo "  - This pipeline will auto-use 'sudo docker' without restart"
                                        echo ""
                                        echo "Raw diagnostics (non-fatal):"
                                        docker context ls || true
                                        docker version || true
                                        exit 1
                                    fi

                  # Ensure scripts don't have CRLF line endings (common when committed from Windows)
                  sed -i 's/\r$//' scripts/*.sh || true
                '''
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/RashmikaHarshamal/Travel-Bucket-System.git'
            }
        }

        stage('Terraform Plan & Apply') {
            when {
                expression {
                    // Only run if terraform files exist AND AWS credentials are configured
                    if (!fileExists('terraform/main.tf')) {
                        return false
                    }
                    try {
                        // Check if AWS credentials exist
                        withCredentials([
                            string(credentialsId: 'aws-access-key-id', variable: 'AWS_KEY'),
                            string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET')
                        ]) {
                            return true
                        }
                    } catch (Exception e) {
                        echo "⚠️ Terraform stage skipped: AWS credentials not configured in Jenkins"
                        echo "To enable: Add 'aws-access-key-id' and 'aws-secret-access-key' credentials"
                        return false
                    }
                }
            }
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    dir('terraform') {
                        sh '''#!/bin/bash
                            set -euo pipefail
                            
                            # Install Terraform if not present
                            if ! command -v terraform &> /dev/null; then
                                echo "Installing Terraform..."
                                wget -q https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip
                                unzip -o terraform_1.7.0_linux_amd64.zip
                                sudo mv terraform /usr/local/bin/
                                rm terraform_1.7.0_linux_amd64.zip
                            fi
                            
                            terraform --version
                            
                            # Initialize Terraform
                            terraform init
                            
                            # Plan
                            terraform plan -out=tfplan
                            
                            # Apply (auto-approve for CI/CD)
                            terraform apply -auto-approve tfplan
                            
                            # Export EC2 IP for deployment stage
                            EC2_IP_OUTPUT=$(terraform output -raw instance_public_ip || echo "")
                            if [ -n "$EC2_IP_OUTPUT" ]; then
                                echo "EC2_IP=$EC2_IP_OUTPUT" > ../ec2_ip.env
                            fi
                        '''
                    }
                }
                script {
                    // Read EC2 IP from Terraform output and update environment
                    if (fileExists('ec2_ip.env')) {
                        def props = readFile('ec2_ip.env').trim()
                        env.EC2_IP = props.split('=')[1]
                        echo "Updated EC2_IP from Terraform: ${env.EC2_IP}"
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                                    bash scripts/build.sh
                '''
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                      bash scripts/push.sh $DOCKER_USER $DOCKER_PASS
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
                        when {
                                expression {
                        return env.EC2_IP != null && env.EC2_IP != 'null' && env.EC2_IP.trim() != ''
                                }
                        }
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-ssh-key',
                        keyFileVariable: 'EC2_KEY',
                        usernameVariable: 'EC2_USER'
                    )
                ]) {
                    sh '''#!/bin/bash
                                            set -euo pipefail
                                            # Accept either a raw IP/DNS or a pasted URL like https://1.2.3.4
                                            EC2_IP_RAW="${EC2_IP-}"
                                            EC2_HOST="${EC2_IP_RAW#http://}"
                                            EC2_HOST="${EC2_HOST#https://}"
                                            EC2_HOST="${EC2_HOST%%/*}"
                                            # If user pasted host:port, strip the port for ssh/scp
                                            EC2_HOST="${EC2_HOST%%:*}"

                                            if [ -z "${EC2_HOST}" ]; then
                                                echo "ERROR: EC2_IP is empty or invalid: '${EC2_IP_RAW}'"
                                                echo "Provide a public IP or DNS name (optionally with http(s)://)."
                                                exit 1
                                            fi

                                            if [ ! -f "scripts/deploy.sh" ]; then
                                                echo "ERROR: scripts/deploy.sh not found."
                                                exit 1
                                            fi

                                            if [[ "${DOCKER_USE_SUDO:-0}" == "1" ]]; then
                                                DOCKER=(sudo -n docker)
                                            else
                                                DOCKER=(docker)
                                            fi

                                            # Use a container for ssh/scp so the Jenkins agent doesn't need openssh-client.
                                            "${DOCKER[@]}" run --rm \
                                                -e EC2_IP="${EC2_HOST}" \
                                                -e EC2_USER="${EC2_USER}" \
                                                -e DOCKER_REPO="${DOCKER_REPO}" \
                                                -v "$EC2_KEY:/key:ro" \
                                                -v "$WORKSPACE/scripts:/scripts:ro" \
                                                alpine:3.19 sh -c '
                                                    set -e
                                                    apk add --no-cache openssh-client >/dev/null 2>&1
                                                    scp -o StrictHostKeyChecking=no -i /key /scripts/deploy.sh "$EC2_USER@$EC2_IP:/home/$EC2_USER/deploy.sh"
                                                    ssh -o StrictHostKeyChecking=no -i /key "$EC2_USER@$EC2_IP" "chmod +x ~/deploy.sh && DOCKER_REPO=$DOCKER_REPO ~/deploy.sh"
                                                '
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "CI/CD pipeline completed successfully 🎉"
        }
        failure {
            echo "Pipeline failed ❌ Check Jenkins console output."
        }
    }
}
