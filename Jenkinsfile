pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        COMPOSE_FILE = "docker-compose.yml"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Checking out source code"
                checkout scm
            }
        }

        stage('Workspace Debug') {
            steps {
                echo "🔎 Debugging Jenkins workspace"
                sh '''
                whoami
                pwd
                ls -la
                '''
            }
        }

        stage('Validate Docker') {
            steps {
                echo "🐳 Validating Docker access"
                sh '''
                docker --version
                docker compose version
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🏗️ Building Docker images"
                sh '''
                docker compose build
                '''
            }
        }

        stage('Deploy Containers') {
            steps {
                echo "🚀 Starting containers"
                sh '''
                docker compose up -d
                '''
            }
        }

        stage('Verify Containers') {
            steps {
                echo "✅ Verifying running containers"
                sh '''
                docker ps
                '''
            }
        }
    }

    post {
        success {
            echo "🎉 Pipeline completed successfully"
        }
        failure {
            echo "❌ Pipeline failed — check logs above"
        }
        always {
            echo "📄 Pipeline finished"
        }
    }
}
