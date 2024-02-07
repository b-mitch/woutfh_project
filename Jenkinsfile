pipeline {
    agent any

    stages {
        stage('Extract Version Number') {
            steps {
                script {
                    def gitCommitMessage = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                    // Regular expression to extract version numbers (assuming semantic versioning)
                    def versionMatch = gitCommitMessage =~ /\b\d+\.\d+\.\d+\b/
                    // Use the first version number found in the commit message
                    def versionNumber = versionMatch ? versionMatch[0] : '9.9.9'
                    echo "Extracted version number: ${versionNumber}"
                    // Set the version number as an environment variable for later use
                    env.IMAGE_VERSION = versionNumber
                }
            }
        }
        stage('Build and Deploy to Development') {
            steps {
                dir('configuration') {
                    sshagent(credentials: ['ssh_key']) {
                        script {
                            // sh 'ssh-keyscan -H 44.214.134.6 >> ~/.ssh/known_hosts'
                            sh 'ansible all -i 44.214.134.6, -m ping -e "ansible_user=ec2-user" -e "ANSIBLE_HOST_KEY_CHECKING=False"'
                            // Use Ansible to build image and deploy to development EC2 instance
                            sh 'ansible-playbook -i 44.214.134.6, -u ec2-user reset.yml -e "target=44.214.134.6"'
                            sh 'ansible-playbook -i 44.214.134.6, -u ec2-user build.yml -e "target=44.214.134.6" -e "version=${IMAGE_VERSION}" -e "app_root_directory=woutfh_project/app" -vvv'
                            withCredentials([
                                string(credentialsId: 'SECRET_KEY', variable: 'SECRET_KEY'),
                                string(credentialsId: 'DB_NAME', variable: 'DB_NAME'),
                                string(credentialsId: 'DB_USER', variable: 'DB_USER'),
                                string(credentialsId: 'DB_PASS', variable: 'DB_PASS'),
                                string(credentialsId: 'DB_HOST', variable: 'DB_HOST'),
                                string(credentialsId: 'EMAIL_PASSWORD', variable: 'EMAIL_PASSWORD')
                            ]) {
                                sh 'ansible-playbook -i 44.214.134.6, -u ec2-user deploy.yml -e "target=44.214.134.6" -e "version=${IMAGE_VERSION}" -e "app_root_directory=woutfh_project/app" -e "SECRET_KEY=$SECRET_KEY" -e "DB_NAME=$DB_NAME" -e "DB_USER=$DB_USER" -e "DB_PASS=$DB_PASS" -e "DB_HOST=$DB_HOST" -e "EMAIL_PASSWORD=$EMAIL_PASSWORD"'
                            }
                        }
                    }
                }
            }
        }
        stage('Run Django Tests') {
            steps {
                sshagent(credentials: ['ssh_key']) {
                    script {
                        // Delete the container ID file if it exists
                        sh "ssh -i ~/.ssh/id_rsa ec2-user@44.214.134.6 'rm -f container_id.txt'"
                        
                        // Save the container ID to a file
                        sh "ssh -i ~/.ssh/id_rsa ec2-user@44.214.134.6 'docker ps -q --filter ancestor=bmitchum/woutfh_api-prod:${IMAGE_VERSION}' > container_id.txt"
                        
                        // Retrieve the container ID from the file
                        def containerId = sh(script: "ssh -i ~/.ssh/id_rsa ec2-user@44.214.134.6 'cat container_id.txt'", returnStdout: true).trim()

                        // Run Docker command using the retrieved container ID
                        sh "ssh -i ~/.ssh/id_rsa ec2-user@44.214.134.6 'docker exec ${containerId} python3 manage.py test'"
                    }
                }
            }
        }
        stage('Manual Approval of Development') {
            steps {
                input 'Proceed with deployment to green production?'
            }
        }
        stage('Tear Down Development Docker Resources') {
            steps {
                dir('configuration') {
                    sshagent(credentials: ['ssh_key']) {
                        script {
                            // sh 'ssh-keyscan -H 44.214.134.6 >> ~/.ssh/known_hosts'
                            sh 'ansible all -i 44.214.134.6, -m ping -e "ansible_user=ec2-user" -e "ANSIBLE_HOST_KEY_CHECKING=False"'
                            // Use Ansible to build image and deploy to development EC2 instance
                            sh 'ansible-playbook -i 44.214.134.6, -u ec2-user reset.yml -e "target=44.214.134.6"'
                        }
                    }
                }
            }
        }
        stage('Deploy to Green Production') {
            steps {
                dir('configuration') {
                    sshagent(credentials: ['ssh_key']) {
                        script {
                            sh 'ssh-keyscan -H 3.83.41.226 >> ~/.ssh/known_hosts'
                            sh 'ansible all -i 3.83.41.226, -m ping -e "ansible_user=ec2-user" -e "ANSIBLE_HOST_KEY_CHECKING=False"'
                            // Use Ansible to deploy to green production instance
                            sh 'ansible-playbook -i 3.83.41.226, -u ec2-user reset.yml -e "target=3.83.41.226" -e "version=${IMAGE_VERSION}"'
                            withCredentials([
                                string(credentialsId: 'SECRET_KEY', variable: 'SECRET_KEY'),
                                string(credentialsId: 'DB_NAME-prod', variable: 'DB_NAME'),
                                string(credentialsId: 'DB_USER-prod', variable: 'DB_USER'),
                                string(credentialsId: 'DB_PASS-prod', variable: 'DB_PASS'),
                                string(credentialsId: 'DB_HOST-prod', variable: 'DB_HOST'),
                                string(credentialsId: 'EMAIL_PASSWORD', variable: 'EMAIL_PASSWORD')
                            ]) {
                                sh 'ansible-playbook -i 3.83.41.226, -u ec2-user deploy.yml -e "target=3.83.41.226" -e "version=${IMAGE_VERSION}" -e "app_root_directory=woutfh_project/app" -e "SECRET_KEY=$SECRET_KEY" -e "DB_NAME=$DB_NAME" -e "DB_USER=$DB_USER" -e "DB_PASS=$DB_PASS" -e "DB_HOST=$DB_HOST" -e "EMAIL_PASSWORD=$EMAIL_PASSWORD"'
                            }
                        }
                    }
                }
            }
        }
        stage('Manual Approval of Green Production') {
            steps {
                input 'Switch ALB to Green?'
            }
        }
        stage('Switch ALB to Green') {
            steps {
                dir('elb') {
                    withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    accessKeyVariable: 'AWS_ACCESS_KEY',
                    credentialsId: 'aws_credentials',
                    secretKeyVariable: 'AWS_SECRET_KEY'
                ]]) {
                        script {
                            // Initialize Terraform
                            // sh 'terraform init -var="aws_access_key=$AWS_ACCESS_KEY" -var="aws_secret_key=$AWS_SECRET_KEY"' 
                            // Use Terraform to switch ALB target group weights
                            sh 'terraform apply -var="blue_weight=0" -var="green_weight=100" -var="aws_access_key=$AWS_ACCESS_KEY" -var="aws_secret_key=$AWS_SECRET_KEY" -auto-approve'
                        }
                    }
                }
            }
        }
        stage('Deploy to Blue Production') {
            steps {
                dir('configuration') {
                    sshagent(credentials: ['ssh_key']) {
                        script {
                            sh 'ssh-keyscan -H 44.222.76.124 >> ~/.ssh/known_hosts'
                            sh 'ansible all -i 44.222.76.124, -m ping -e "ansible_user=ec2-user" -e "ANSIBLE_HOST_KEY_CHECKING=False"'
                            // Use Ansible to deploy to blue production instance
                            sh 'ansible-playbook -i 44.222.76.124, -u ec2-user reset.yml -e "target=44.222.76.124" -e "version=${IMAGE_VERSION}"'
                            withCredentials([
                                string(credentialsId: 'SECRET_KEY', variable: 'SECRET_KEY'),
                                string(credentialsId: 'DB_NAME-prod', variable: 'DB_NAME'),
                                string(credentialsId: 'DB_USER-prod', variable: 'DB_USER'),
                                string(credentialsId: 'DB_PASS-prod', variable: 'DB_PASS'),
                                string(credentialsId: 'DB_HOST-prod', variable: 'DB_HOST'),
                                string(credentialsId: 'EMAIL_PASSWORD', variable: 'EMAIL_PASSWORD')
                            ]) {
                                sh 'ansible-playbook -i 44.222.76.124, -u ec2-user deploy.yml -e "target=44.222.76.124" -e "version=${IMAGE_VERSION}" -e "app_root_directory=woutfh_project/app" -e "SECRET_KEY=$SECRET_KEY" -e "DB_NAME=$DB_NAME" -e "DB_USER=$DB_USER" -e "DB_PASS=$DB_PASS" -e "DB_HOST=$DB_HOST" -e "EMAIL_PASSWORD=$EMAIL_PASSWORD"'
                            }
                        }
                    }
                }
            }
        }
        stage('Manual Approval of Blue Production') {
            steps {
                input 'Switch ALB to Blue?'
            }
        }
        stage('Switch ALB to Blue') {
            steps {
                dir('elb') {
                    withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    accessKeyVariable: 'AWS_ACCESS_KEY',
                    credentialsId: 'aws_credentials',
                    secretKeyVariable: 'AWS_SECRET_KEY'
                ]]) {
                        script {
                            // Use Terraform to switch ALB target group weights
                            sh 'terraform apply -var="blue_weight=100" -var="green_weight=0" -var="aws_access_key=$AWS_ACCESS_KEY" -var="aws_secret_key=$AWS_SECRET_KEY" -auto-approve'
                        }
                    }
                }
            }
        }
    }
}