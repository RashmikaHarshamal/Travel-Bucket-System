pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "my-frontend-image"
        BACKEND_IMAGE = "my-backend-image"
        DOCKER_HUB_USER = "rashmikaharshamal" // must be all lowercase (Docker Hub usernames are)
        DOCKER_BUILDKIT = '1'
        COMPOSE_DOCKER_CLI_BUILD = '1'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "🔄 Pulling code from GitHub..."
                // Ensure no stale files remain from previous builds
                deleteDir()
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "🏗️ Building frontend Docker image..."
                    dir('frontend') {
                        sh "DOCKER_BUILDKIT=1 docker build -t ${FRONTEND_IMAGE}:latest ."
                    }

                    echo "🏗️ Building backend Docker image..."
                    dir('backend') {
                        sh "DOCKER_BUILDKIT=1 docker build -t ${BACKEND_IMAGE}:latest ."
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub-password-new', variable: 'DOCKER_HUB_PASS')]) {
                    script {
                        echo "🔐 Logging into Docker Hub..."
                        sh """
                            echo \$DOCKER_HUB_PASS | docker login -u ${DOCKER_HUB_USER} --password-stdin

                            echo "🏷️ Tagging frontend image..."
                            docker tag ${FRONTEND_IMAGE}:latest ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest

                            echo "🏷️ Tagging backend image..."
                            docker tag ${BACKEND_IMAGE}:latest ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest

                            echo "📤 Pushing frontend image..."
                            docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest

                            echo "📤 Pushing backend image..."
                            docker push ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest
                        """
                    }
                }
            }
        }

        stage('Run Containers') {
            steps {
                echo "🚀 Starting containers using docker-compose..."
                sh 'docker compose up -d'
            }
        }

        stage('Check Running Containers') {
            steps {
                echo "🧩 Checking running containers..."
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment and push successful! Both frontend and backend images are on Docker Hub.'
        }
        failure {
            echo '❌ Deployment or push failed!'
        }
    }
}
