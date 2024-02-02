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
                            sh 'ssh-keyscan -H 44.214.134.6 >> ~/.ssh/known_hosts'
                            sh 'ansible all -i 44.214.134.6, -m ping -e "ansible_user=ec2-user" -e "ANSIBLE_HOST_KEY_CHECKING=False"'
                            // Use Ansible to build image and deploy to development EC2 instance
                            sh 'ansible-playbook -i 44.214.134.6, -u ec2-user reset.yml -e "target=44.214.134.6"'
                            sh 'ansible-playbook -i 44.214.134.6, -u ec2-user build.yml -e "target=44.214.134.6" -e "version=${IMAGE_VERSION}" -e "app_root_directory=woutfh_prod"'
                            withCredentials([
                                password(credentialsId: 'SECRET_KEY', variable: 'SECRET_KEY'),
                                password(credentialsId: 'DB_NAME', variable: 'DB_NAME'),
                                password(credentialsId: 'DB_USER', variable: 'DB_USER'),
                                password(credentialsId: 'DB_PASS', variable: 'DB_PASS'),
                                password(credentialsId: 'DB_HOST', variable: 'DB_HOST'),
                                password(credentialsId: 'EMAIL_PASSWORD', variable: 'EMAIL_PASSWORD')
                            ]) {
                                sh 'ansible-playbook -i 44.214.134.6, -u ec2-user deploy.yml -e "target=44.214.134.6" -e "version=${IMAGE_VERSION}" -e "app_root_directory=woutfh_prod" -e "SECRET_KEY=${SECRET_KEY}" -e "DB_NAME=${DB_NAME}" -e "DB_USER=${DB_USER}" -e "DB_PASS=${DB_PASS}" -e "DB_HOST=${DB_HOST}" -e "EMAIL_PASSWORD=${EMAIL_PASSWORD}"'
                            }
                        }
                    }
                }
            }
        }
        stage('Manual Approval for Development') {
            steps {
                input 'Proceed with deployment to green production?'
            }
        }
        stage('Deploy to Green Production') {
            steps {
                dir('configuration') {
                    script {
                        // Use Ansible to deploy to green production instance
                        sh 'ansible-playbook -i hosts reset.yml -e "target=3.83.41.226" -e "version=${IMAGE_VERSION}"'
                        withCredentials([
                            password(credentialsId: 'SECRET_KEY', variable: 'SECRET_KEY'),
                            password(credentialsId: 'DB_NAME-prod', variable: 'DB_NAME'),
                            password(credentialsId: 'DB_USER-prod', variable: 'DB_USER'),
                            password(credentialsId: 'DB_PASS-prod', variable: 'DB_PASS'),
                            password(credentialsId: 'DB_HOST-prod', variable: 'DB_HOST'),
                            password(credentialsId: 'EMAIL_PASSWORD', variable: 'EMAIL_PASSWORD')
                        ]) {
                            sh 'ansible-playbook -i hosts deploy.yml -e "target=3.83.41.226" -e "version=${IMAGE_VERSION}" -e "app_root_directory=woutfh_prod" -e "SECRET_KEY=${SECRET_KEY}" -e "DB_NAME=${DB_NAME}" -e "DB_USER=${DB_USER}" -e "DB_PASS=${DB_PASS}" -e "DB_HOST=${DB_HOST}" -e "EMAIL_PASSWORD=${EMAIL_PASSWORD}"'
                        }
                    }
                }
            }
        }
        stage('Manual Approval for Green Production') {
            steps {
                input 'Switch ALB to Green?'
            }
        }
        stage('Switch ALB to Green') {
            steps {
                dir('alb_config') {
                    script {
                        // Use Terraform to switch ALB target group weights
                        sh 'terraform apply -var="blue_weight=0" -var="green_weight=100" -auto-approve'
                    }
                }
            }
        }
        stage('Deploy to Blue Production') {
            steps {
                dir('woutfh_configuration') {
                    script {
                        // Use Ansible to deploy to blue production instance
                        sh 'ansible-playbook -i hosts reset.yml -e "target=44.222.76.124" -e "version=${IMAGE_VERSION}"'
                        withCredentials([
                            password(credentialsId: 'SECRET_KEY', variable: 'SECRET_KEY'),
                            password(credentialsId: 'DB_NAME-prod', variable: 'DB_NAME'),
                            password(credentialsId: 'DB_USER-prod', variable: 'DB_USER'),
                            password(credentialsId: 'DB_PASS-prod', variable: 'DB_PASS'),
                            password(credentialsId: 'DB_HOST-prod', variable: 'DB_HOST'),
                            password(credentialsId: 'EMAIL_PASSWORD', variable: 'EMAIL_PASSWORD')
                        ]) {
                            sh 'ansible-playbook -i hosts deploy.yml -e "target=44.222.76.124" -e "version=${IMAGE_VERSION}" -e "app_root_directory=woutfh_prod" -e "SECRET_KEY=${SECRET_KEY}" -e "DB_NAME=${DB_NAME}" -e "DB_USER=${DB_USER}" -e "DB_PASS=${DB_PASS}" -e "DB_HOST=${DB_HOST}" -e "EMAIL_PASSWORD=${EMAIL_PASSWORD}"'
                        }
                    }
                }
            }
        }
        stage('Manual Approval for Blue Production') {
            steps {
                input 'Proceed with deployment to blue production?'
            }
        }
        stage('Switch ALB to Blue') {
            steps {
                dir('alb_config') {
                    script {
                        // Use Terraform to switch ALB target group weights back to blue
                        sh 'terraform apply -var="blue_weight=100" -var="green_weight=0" -auto-approve'
                    }
                }
            }
        }
    }
}