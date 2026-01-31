pipeline {
    agent any

    parameters {
        string(name: 'AWS_REGION', defaultValue: 'us-east-1', description: 'AWS region for Terraform (infra/)')
        string(name: 'KEY_PAIR_NAME', defaultValue: 'travel-bucket-deployer', description: 'AWS EC2 key pair name to create/use')
        text(name: 'SSH_PUBLIC_KEY', defaultValue: '', description: 'Optional: SSH public key material for EC2 access (e.g., contents of id_rsa.pub). If empty, Jenkins will derive it from the ec2-ssh-key private key.')
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
                                withCredentials([
                                        sshUserPrivateKey(
                                                credentialsId: 'ec2-ssh-key',
                                                keyFileVariable: 'EC2_KEY',
                                                usernameVariable: 'EC2_USER'
                                        )
                                ]) {
                                        sh '''
                                                set -euo pipefail

                                                if [ ! -d "infra" ]; then
                                                    echo "ERROR: infra/ directory not found in workspace."
                                                    exit 1
                                                fi

                                                # If the public key parameter isn't provided, derive it from the same private key used for SSH deploy.
                                                # Do it in a container so the Jenkins agent doesn't need ssh-keygen installed.
                                                if [ -z "${SSH_PUBLIC_KEY:-}" ]; then
                                                    SSH_PUBLIC_KEY="$(docker run --rm -v "$EC2_KEY:/key:ro" alpine:3.19 sh -c 'apk add --no-cache openssh-client >/dev/null 2>&1 && ssh-keygen -y -f /key' 2>/dev/null || true)"
                                                fi

                                                if [ -z "${SSH_PUBLIC_KEY:-}" ]; then
                                                    echo "ERROR: SSH_PUBLIC_KEY is empty and could not be derived from credential 'ec2-ssh-key'."
                                                    echo "- Provide SSH_PUBLIC_KEY in Jenkins parameters (public key only), OR"
                                                    echo "- Ensure the private key is not passphrase-protected."
                                                    exit 1
                                                fi

                                                cat > infra/terraform.tfvars <<EOF
aws_region        = "${AWS_REGION}"
key_pair_name     = "${KEY_PAIR_NAME}"
ssh_public_key    = <<EOT
${SSH_PUBLIC_KEY}
EOT
docker_user       = "${DOCKER_REPO}"
allowed_ssh_cidr  = "${ALLOWED_SSH_CIDR}"
allowed_http_cidr = "${ALLOWED_HTTP_CIDR}"
EOF
                                        '''
                                }

                                sh '''
                                    set -euo pipefail

                                    if [ -z "${AWS_ACCESS_KEY_ID:-}" ] || [ -z "${AWS_SECRET_ACCESS_KEY:-}" ]; then
                                        echo "ERROR: AWS credentials are not available to the pipeline."
                                        echo "Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY as Jenkins credentials/environment variables for this job."
                                        exit 1
                                    fi

                                    docker run --rm \
                                        -e AWS_ACCESS_KEY_ID \
                                        -e AWS_SECRET_ACCESS_KEY \
                                        -e AWS_SESSION_TOKEN \
                                        -e AWS_DEFAULT_REGION=${AWS_REGION} \
                                        -e AWS_REGION=${AWS_REGION} \
                                        -v "$WORKSPACE/infra:/workspace" \
                                        -w /workspace \
                                        hashicorp/terraform:${TF_VERSION} \
                                        init -input=false -no-color

                                    docker run --rm \
                                        -e AWS_ACCESS_KEY_ID \
                                        -e AWS_SECRET_ACCESS_KEY \
                                        -e AWS_SESSION_TOKEN \
                                        -e AWS_DEFAULT_REGION=${AWS_REGION} \
                                        -e AWS_REGION=${AWS_REGION} \
                                        -v "$WORKSPACE/infra:/workspace" \
                                        -w /workspace \
                                        hashicorp/terraform:${TF_VERSION} \
                                        apply -auto-approve -input=false -no-color
                                '''

                script {
                    def ec2Ip = sh(
                        script: '''
                                                    set -euo pipefail
                          docker run --rm \
                                                        -e AWS_ACCESS_KEY_ID \
                                                        -e AWS_SECRET_ACCESS_KEY \
                                                        -e AWS_SESSION_TOKEN \
                                                        -e AWS_DEFAULT_REGION=${AWS_REGION} \
                                                        -e AWS_REGION=${AWS_REGION} \
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
                        when {
                                expression {
                                        return (env.EC2_IP != null && env.EC2_IP.trim()) || !params.TERRAFORM_APPLY
                                }
                        }
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-ssh-key',
                        keyFileVariable: 'EC2_KEY',
                        usernameVariable: 'EC2_USER'
                    )
                ]) {
                    sh '''
                                            set -euo pipefail
                                            if [ -z "${EC2_IP:-}" ]; then
                                                echo "ERROR: EC2_IP is empty. Run Terraform stage (or export EC2_IP as a job env var/parameter)."
                                                exit 1
                                            fi

                                            if [ ! -f "scripts/deploy.sh" ]; then
                                                echo "ERROR: scripts/deploy.sh not found."
                                                exit 1
                                            fi

                                            # Use a container for ssh/scp so the Jenkins agent doesn't need openssh-client.
                                            docker run --rm \
                                                -e EC2_IP="${EC2_IP}" \
                                                -e EC2_USER="${EC2_USER}" \
                                                -e DOCKER_REPO="${DOCKER_REPO}" \
                                                -v "$EC2_KEY:/key:ro" \
                                                -v "$WORKSPACE/scripts:/scripts:ro" \
                                                alpine:3.19 sh -c '
                                                    set -e
                                                    apk add --no-cache openssh-client >/dev/null 2>&1
                                                    scp -o StrictHostKeyChecking=no -i /key /scripts/deploy.sh "$EC2_USER@$EC2_IP:/home/$EC2_USER/deploy.sh"
                                                    ssh -o StrictHostKeyChecking=no -i /key "$EC2_USER@$EC2_IP" "chmod +x ~/deploy.sh && DOCKER_REPO=$DOCKER_REPO ~/deploy.sh"
                                                '
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
