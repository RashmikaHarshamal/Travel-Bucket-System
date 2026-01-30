pipeline {
    agent any

    parameters {
        string(name: 'AWS_REGION', defaultValue: 'us-east-1', description: 'AWS region for Terraform (infra/)')
        string(name: 'KEY_PAIR_NAME', defaultValue: 'travel-bucket-deployer', description: 'AWS EC2 key pair name to create/use')
        text(name: 'SSH_PUBLIC_KEY', defaultValue: '', description: 'SSH public key material for EC2 access (e.g., contents of id_rsa.pub). Public key only.')
        string(name: 'ALLOWED_SSH_CIDR', defaultValue: '0.0.0.0/0', description: 'CIDR allowed for SSH (22)')
        string(name: 'ALLOWED_HTTP_CIDR', defaultValue: '0.0.0.0/0', description: 'CIDR allowed for app ports (8081, 3000)')
        booleanParam(name: 'TERRAFORM_APPLY', defaultValue: true, description: 'If false, skip Terraform apply (deploy only)')
    }

    environment {
        DOCKER_REPO = "rashmikaharshamal"
        TF_VERSION  = "1.7.5"
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

        stage('Provision Infrastructure (Terraform)') {
            when {
                expression { return params.TERRAFORM_APPLY }
            }

            steps {
                sh '''
                  set -e
                  if [ -z "${SSH_PUBLIC_KEY}" ]; then
                    echo "ERROR: SSH_PUBLIC_KEY parameter is empty. Provide the public key (e.g. from ~/.ssh/id_rsa.pub)."
                    exit 1
                  fi

                  cat > infra/terraform.tfvars <<EOF
aws_region       = "${AWS_REGION}"
key_pair_name    = "${KEY_PAIR_NAME}"
ssh_public_key   = <<EOT
${SSH_PUBLIC_KEY}
EOT
docker_user      = "${DOCKER_REPO}"
allowed_ssh_cidr = "${ALLOWED_SSH_CIDR}"
allowed_http_cidr = "${ALLOWED_HTTP_CIDR}"
EOF
                '''

                sh '''
                  set -e
                  docker run --rm \
                    -v "$WORKSPACE/infra:/workspace" \
                    -w /workspace \
                    hashicorp/terraform:${TF_VERSION} \
                    init

                  docker run --rm \
                    -v "$WORKSPACE/infra:/workspace" \
                    -w /workspace \
                    hashicorp/terraform:${TF_VERSION} \
                    apply -auto-approve
                '''

                script {
                    def ec2Ip = sh(
                        script: '''
                          set -e
                          docker run --rm \
                            -v "$WORKSPACE/infra:/workspace" \
                            -w /workspace \
                            hashicorp/terraform:${TF_VERSION} \
                            output -raw instance_public_ip
                        ''',
                        returnStdout: true
                    ).trim()

                    if (!ec2Ip) {
                        error('Terraform output instance_public_ip was empty')
                    }

                    env.EC2_IP = ec2Ip
                    echo "Terraform provisioned EC2_IP=${env.EC2_IP}"
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
                      set -e
                      if [ -z "${EC2_IP}" ]; then
                        echo "ERROR: EC2_IP is empty. Run Terraform stage (or set EC2_IP via environment)."
                        exit 1
                      fi

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
