pipeline {
    agent any

    environment {
        PROJECT_DIR = "/mnt/d/Projects/Travel-Bucket-System"
        FRONTEND_IMAGE = "travel-frontend"
        BACKEND_IMAGE = "travel-backend"
        DOCKER_HUB_USER = "rashmikaharshamal"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Pulling code from GitHub..."
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                dir("${PROJECT_DIR}/frontend") {
                    echo "Building frontend Docker image..."
                    sh "docker build -t ${FRONTEND_IMAGE}:latest ."
                }

                dir("${PROJECT_DIR}/backend") {
                    echo "Building backend Docker image..."
                    sh "docker build -t ${BACKEND_IMAGE}:latest ."
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-pass', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    echo "Logging into Docker Hub..."
                    sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        
                        echo "Tagging images..."
                        docker tag ${FRONTEND_IMAGE}:latest ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest
                        docker tag ${BACKEND_IMAGE}:latest ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest
                        
                        echo "Pushing images..."
                        docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest
                        docker push ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest
                    """
                }
            }
        }

        stage('Run Containers') {
            steps {
                dir("${PROJECT_DIR}") {
                    echo "Starting containers using docker-compose..."
                    sh 'docker compose up -d'
                }
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
            echo '✅ Deployment and push successful! Both frontend and backend images are on Docker Hub.'
        }
        failure {
            echo '❌ Deployment or push failed!'
        }
    }
}