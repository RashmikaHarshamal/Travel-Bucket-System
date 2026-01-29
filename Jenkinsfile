pipeline {
    agent any

    environment {
        DOCKER_USER = credentials('dockerhub-creds')
        AWS_KEY     = credentials('aws-access-key')
        AWS_SECRET  = credentials('aws-secret-key')
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

        stage('Terraform Apply') {
            steps {
                dir("${WORKSPACE}/infra") {
                    script {
                        if (env.TF_VARS_CREDENTIAL_ID) {
                            withCredentials([string(credentialsId: env.TF_VARS_CREDENTIAL_ID, variable: 'TF_VARS_CONTENT')]) {
                                writeFile file: 'terraform.tfvars', text: env.TF_VARS_CONTENT
                            }
                        } else if (env.TF_VARS_CONTENT) {
                            writeFile file: 'terraform.tfvars', text: env.TF_VARS_CONTENT
                        }

                        if (!fileExists('terraform.tfvars')) {
                            error 'terraform.tfvars not found. Provide via TF_VARS_CREDENTIAL_ID (Jenkins string credential) or TF_VARS_CONTENT env/parameter, or commit terraform.tfvars.'
                        }
                    }

                    withCredentials([
                        usernamePassword(
                            credentialsId: 'aws-access-key',
                            usernameVariable: 'AWS_ACCESS_KEY_ID',
                            passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                        )
                    ]) {
                        sh '''
                            terraform init -input=false
                            terraform fmt -check
                            terraform validate
                            terraform plan -out=tfplan
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
                        echo "🚀 Deploying Docker containers on EC2..."
                        scp -i $EC2_KEY scripts/deploy.sh $EC2_USER@13.53.103.213:/home/$EC2_USER/deploy.sh
                        ssh -i $EC2_KEY $EC2_USER@13.53.103.213 "chmod +x ~/deploy.sh && ~/deploy.sh $DOCKER_USER"
                    """
                }
            }
        }
    }

    post {
        success { echo "✅ CI/CD pipeline completed successfully!" }
        failure { echo "❌ Pipeline failed. Check Jenkins console for details." }
    }
}