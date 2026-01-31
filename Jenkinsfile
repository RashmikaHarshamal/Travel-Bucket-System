pipeline {
    agent any

    environment {
        DOCKER_REPO = "rashmikaharshamal"
        // Set this in Jenkins global env (Manage Jenkins -> System -> Global properties)
        EC2_IP = "${env.EC2_IP}"
    }

    stages {

        stage('Preflight') {
            steps {
                sh '''#!/bin/bash
                  set -euo pipefail
                  command -v bash >/dev/null 2>&1 || { echo "ERROR: bash is required on the Jenkins agent."; exit 1; }
                  command -v docker >/dev/null 2>&1 || { echo "ERROR: docker CLI is required on the Jenkins agent."; exit 1; }
                  docker version >/dev/null 2>&1 || { echo "ERROR: docker daemon is not reachable from this agent."; exit 1; }

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
                        return env.EC2_IP != null && env.EC2_IP.trim()
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

                                            # Use a container for ssh/scp so the Jenkins agent doesn't need openssh-client.
                                            docker run --rm \
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
