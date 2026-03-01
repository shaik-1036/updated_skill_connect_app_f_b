pipeline {
    agent {
        label 'built-in'
    }

    options {
        timestamps()
    }

    stages {

        stage('Sanity Check') {
            steps {
                sh '''
                echo "===== SYSTEM INFO ====="
                whoami
                uname -a
                pwd
                ls -la
                '''
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
                sh '''
                docker compose build
                '''
            }
        }

        stage('Run Containers') {
            steps {
                sh '''
                docker compose up -d
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                docker ps
                '''
            }
        }
    }

    post {
        success {
            echo "✅ SUCCESS – Containers are running"
        }
        failure {
            echo "❌ FAILED – Read the FIRST error above"
        }
    }
}
