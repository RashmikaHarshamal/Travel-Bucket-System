pipeline {
    agent any

    environment {
        DOCKER_REPO = "rashmikaharshamal"
        EC2_IP      = "13.53.103.213"
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
                sh '''
                  chmod +x scripts/build.sh
                  ./scripts/build.sh
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
                      chmod +x scripts/push.sh
                      ./scripts/push.sh $DOCKER_USER $DOCKER_PASS
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
                      chmod 600 $EC2_KEY

                      scp -o StrictHostKeyChecking=no -i $EC2_KEY \
                        scripts/deploy.sh \
                        $EC2_USER@$EC2_IP:/home/$EC2_USER/deploy.sh

                      ssh -o StrictHostKeyChecking=no -i $EC2_KEY \
                        $EC2_USER@$EC2_IP \
                        "chmod +x ~/deploy.sh && DOCKER_REPO=$DOCKER_REPO ~/deploy.sh"
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
