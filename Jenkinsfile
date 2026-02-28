pipeline {
    agent any

    options {
        timestamps()                      // show timestamps in logs
        disableConcurrentBuilds()         // prevent parallel deployments
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
                bat 'docker version'
                bat 'docker-compose version'
            }
        }

        stage('Stop Existing Containers') {
            steps {
                echo "🛑 Stopping old containers (if any)"
                bat 'docker-compose down || exit 0'
            }
        }

        stage('Build Images') {
            steps {
                echo "🏗️ Building Docker images"
                bat 'docker-compose build --no-cache'
            }
        }

        stage('Deploy Application') {
            steps {
                echo "🚀 Deploying application"
                bat 'docker-compose up -d'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "🔍 Verifying running containers"
                bat 'docker ps'
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
