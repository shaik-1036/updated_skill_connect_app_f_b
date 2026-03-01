pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        COMPOSE_FILE = "docker-compose.yml"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Pulling code from GitHub"
                checkout scm
            }
        }

        stage('Validate Docker') {
            steps {
                echo "🐳 Checking Docker access"
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Stop Existing Containers') {
            steps {
                echo "🛑 Stopping old containers (if any)"
                sh 'docker compose down || true'
            }
        }

        stage('Build Images') {
            steps {
                echo "🏗️ Building Docker images"
                sh 'docker compose build --no-cache'
            }
        }

        stage('Deploy Application') {
            steps {
                echo "🚀 Deploying application"
                sh 'docker compose up -d'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "🔍 Verifying running containers"
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD Pipeline completed successfully"
        }
        failure {
            echo "❌ CI/CD Pipeline failed"
        }
        always {
            echo "📄 Pipeline finished"
        }
    }
}
