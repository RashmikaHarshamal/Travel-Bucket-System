pipeline {
    agent any

    environment {
        FRONTEND_IMAGE  = "travel-frontend"
        BACKEND_IMAGE   = "travel-backend"
        DOCKER_HUB_USER = "rashmikaharshamal"
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
                    sh '''
                      DOCKER_BUILDKIT=1 docker build -t travel-frontend:latest .
                    '''
                }
                dir('backend') {
                    sh '''
                      DOCKER_BUILDKIT=1 docker build -t travel-backend:latest .
                    '''
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKER_HUB_PASS')]) {
                    sh """
                      echo \$DOCKER_HUB_PASS | docker login -u ${DOCKER_HUB_USER} --password-stdin

                      docker tag travel-frontend:latest ${DOCKER_HUB_USER}/travel-frontend:latest
                      docker tag travel-backend:latest  ${DOCKER_HUB_USER}/travel-backend:latest

                      docker push ${DOCKER_HUB_USER}/travel-frontend:latest
                      docker push ${DOCKER_HUB_USER}/travel-backend:latest
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
}
