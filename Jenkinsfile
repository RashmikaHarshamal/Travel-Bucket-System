pipeline {
    agent any

    environment {
        TF_IN_AUTOMATION   = 'true'
        AWS_DEFAULT_REGION = 'us-east-1'
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

        stage('Terraform Plan & Apply') {
            steps {
                dir("${WORKSPACE}/infra") {
                    withCredentials([
                        string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY'),
                        file(credentialsId: 'terraform-tfvars', variable: 'TF_VARS_FILE')
                    ]) {
                        sh '''
                            set -euo pipefail

                            if [ -n "${TF_VARS_CONTENT:-}" ]; then
                                printf "%s" "${TF_VARS_CONTENT}" > terraform.tfvars
                            elif [ -n "${TF_VARS_FILE:-}" ]; then
                                cp "${TF_VARS_FILE}" terraform.tfvars
                            fi

                            if [ ! -f terraform.tfvars ]; then
                                echo "terraform.tfvars not found. Provide TF_VARS_CONTENT or configure the terraform-tfvars credential."
                                exit 1
                            fi

                            terraform init -input=false
                            terraform fmt -check
                            terraform validate
                            terraform plan -input=false -out=tfplan
                            terraform apply -input=false -auto-approve tfplan
                        '''
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
                        echo "Deploying Docker containers on EC2..."
                        scp -i $EC2_KEY scripts/deploy.sh $EC2_USER@13.53.103.213:/home/$EC2_USER/deploy.sh
                        ssh -i $EC2_KEY $EC2_USER@13.53.103.213 "chmod +x ~/deploy.sh && ~/deploy.sh $DOCKER_USER"
                    """
                }
            }
        }

    }

    post {
        success {
            echo "Pipeline completed successfully."
        }
        failure {
            echo "Pipeline failed. Check Jenkins console for details."
        }
    }
}pipeline {
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

        stage('Terraform Apply') {
            steps {
                dir('infra') {
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'aws-access-key',
                            usernameVariable: 'AWS_ACCESS_KEY_ID',
                            passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                        ),
                        file(credentialsId: 'terraform-tfvars', variable: 'TF_VARS_FILE')
                    ]) {
                        sh '''
                          cp $TF_VARS_FILE terraform.tfvars
                          terraform init -input=false
                          terraform validate
                          terraform plan -out=tfplan
                          terraform apply -auto-approve tfplan
                        '''
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
                    sh '''
                      chmod 600 $EC2_KEY
                      scp -o StrictHostKeyChecking=no -i $EC2_KEY scripts/deploy.sh $EC2_USER@$EC2_IP:/home/$EC2_USER/deploy.sh
                      ssh -o StrictHostKeyChecking=no -i $EC2_KEY $EC2_USER@$EC2_IP "chmod +x ~/deploy.sh && DOCKER_USER=$DOCKER_USER DOCKER_PASS=$DOCKER_PASS DOCKER_REPO=$DOCKER_REPO ~/deploy.sh"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "CI/CD pipeline completed successfully."
        }
        failure {
            echo "Pipeline failed. Check logs."
        }
    }
}