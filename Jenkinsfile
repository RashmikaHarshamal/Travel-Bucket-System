pipeline {
    agent any

    environment {
        DOCKER_USER = credentials('dockerhub-creds')  // DockerHub username + password stored in Jenkins
        AWS_KEY     = credentials('aws-access-key')   // AWS access key
        AWS_SECRET  = credentials('aws-secret-key')   // AWS secret key
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/RashmikaHarshamal/Travel-Bucket-System.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                dir("${WORKSPACE}") {
                    sh 'chmod +x ./scripts/build.sh'
                    sh './scripts/build.sh'
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                dir("${WORKSPACE}") {
                    sh 'chmod +x ./scripts/push.sh'
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh './scripts/push.sh $DOCKER_USER $DOCKER_PASS'
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-ssh-key',
                        keyFileVariable: 'EC2_KEY',
                        usernameVariable: 'EC2_USER'
                    ),
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh """
                        echo "🚀 Deploying Docker containers on EC2..."

                        # Ensure SSH known_hosts contains the EC2 server to avoid verification error
                        mkdir -p ~/.ssh
                        chmod 700 ~/.ssh
                        ssh-keyscan -H 13.53.103.213 >> ~/.ssh/known_hosts

                        # Copy deploy script to EC2
                        scp -i \$EC2_KEY scripts/deploy.sh \$EC2_USER@13.53.103.213:/home/\$EC2_USER/deploy.sh

                        # Run deploy script on EC2 with Docker credentials
                        ssh -i \$EC2_KEY \$EC2_USER@13.53.103.213 "chmod +x ~/deploy.sh && ~/deploy.sh \$DOCKER_USER \$DOCKER_PASS"
                    """
                }
            }
        }

    }

    post {
        success {
            echo "✅ CI/CD pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check Jenkins console for details."
        }
    }
}
