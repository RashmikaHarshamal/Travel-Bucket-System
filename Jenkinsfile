pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "my-frontend-image"
        BACKEND_IMAGE = "my-backend-image"
        DOCKER_HUB_USER = "rashmikaharshamal"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📥 Pulling code from GitHub..."
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {

                dir('frontend') {
                    echo "🐳 Building frontend Docker image..."
                    sh "docker build -t ${FRONTEND_IMAGE}:latest ."
                }

                dir('backend') {
                    echo "🐳 Building backend Docker image..."
                    sh "docker build -t ${BACKEND_IMAGE}:latest ."
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-token', variable: 'DOCKER_HUB_PASS')]) {

                    sh """
                        echo "🔐 Logging into Docker Hub..."
                        echo \$DOCKER_HUB_PASS | docker login -u ${DOCKER_HUB_USER} --password-stdin

                        echo "🏷️ Tagging images..."
                        docker tag ${FRONTEND_IMAGE}:latest ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest
                        docker tag ${BACKEND_IMAGE}:latest ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest

                        echo "🚀 Pushing images..."
                        docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest
                        docker push ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest
                    """
                }
            }
        }

        // OPTIONAL – use only if Jenkins is your deploy server
        stage('Run Containers') {
            when {
                expression { fileExists('docker-compose.yml') }
            }
            steps {
                echo "▶ Starting containers using docker-compose..."
                sh 'docker compose up -d'
            }
        }

        stage('Check Running Containers') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo '✅ CI pipeline completed successfully!'
        }
        failure {
            echo '❌ CI pipeline failed!'
        }
    }
}
