pipeline {
    agent any

    environment {
        FRONTEND_IMAGE  = "travel-frontend"
        BACKEND_IMAGE   = "travel-backend"
        DOCKER_HUB_USER = "rashmikaharshamal"
        DOCKER_BUILDKIT = "1"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                dir('frontend') {
                    sh 'docker build -t ${FRONTEND_IMAGE}:latest .'
                }
                dir('backend') {
                    sh 'docker build -t ${BACKEND_IMAGE}:latest .'
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKER_HUB_PASS')]) {
                    sh """
                      echo \$DOCKER_HUB_PASS | docker login -u ${DOCKER_HUB_USER} --password-stdin

                      docker tag ${FRONTEND_IMAGE}:latest ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest
                      docker tag ${BACKEND_IMAGE}:latest  ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest

                      docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest
                      docker push ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest
                    """
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}
