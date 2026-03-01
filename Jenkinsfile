pipeline {
    agent any

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Check') {
            steps {
                sh '''
                docker --version
                docker compose version
                '''
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy Containers') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD SUCCESS – Containers running"
        }
        failure {
            echo "❌ CI/CD FAILED"
        }
    }
}
