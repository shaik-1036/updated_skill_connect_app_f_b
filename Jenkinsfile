pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = "/usr/bin/docker-compose"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/shaik-1036/updated_skill_connect_app_f_b.git'
            }
        }

        stage('Stop Existing Containers') {
            steps {
                sh '''
                docker-compose down || true
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker-compose build
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                docker-compose up -d
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful"
        }
        failure {
            echo "❌ Deployment Failed"
        }
    }
}
