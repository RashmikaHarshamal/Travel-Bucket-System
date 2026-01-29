pipeline {
    agent any

    environment {
        DOCKER_USER = credentials('dockerhub-creds')   // DockerHub credential
        AWS_KEY     = credentials('aws-access-key')    // AWS Access Key
        AWS_SECRET  = credentials('aws-secret-key')   // AWS Secret Key
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/RashmikaHarshamal/Travel-Bucket-System.git'
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
                    // Use the environment variable DOCKER_USER (from credentials)
                    sh '''
                      chmod +x ./scripts/push.sh
                      ./scripts/push.sh $DOCKER_USER_USR $DOCKER_USER_PSW
                    '''
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
                    )
                ]) {
                    sh '''
                      echo "🚀 Deploying Docker containers on EC2..."
                      scp -i $EC2_KEY scripts/deploy.sh $EC2_USER@13.53.103.213:/home/$EC2_USER/deploy.sh
                      ssh -i $EC2_KEY $EC2_USER@13.53.103.213 "chmod +x ~/deploy.sh && ~/deploy.sh $DOCKER_USER_USR"
                    '''
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
//jenkinsfiles