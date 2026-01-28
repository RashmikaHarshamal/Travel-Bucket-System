pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "travel-frontend"
        BACKEND_IMAGE  = "travel-backend"
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
                    sh 'DOCKER_BUILDKIT=1 docker build -t travel-frontend:latest .'
                }
                dir('backend') {
                    sh 'DOCKER_BUILDKIT=1 docker build -t travel-backend:latest .'
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKER_HUB_PASS')]) {
                    sh '''
                      echo $DOCKER_HUB_PASS | docker login -u your-dockerhub-username --password-stdin
                      docker tag travel-frontend:latest your-dockerhub-username/travel-frontend:latest
                      docker tag travel-backend:latest your-dockerhub-username/travel-backend:latest
                      docker push your-dockerhub-username/travel-frontend:latest
                      docker push your-dockerhub-username/travel-backend:latest
                    '''
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
