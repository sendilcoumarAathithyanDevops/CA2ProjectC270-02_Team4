pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'ghcr.io/24007421/ca2projectc270-02_team4/angry-birds'
        GITHUB_TOKEN = credentials('github-token')  // Set up in Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                // Assuming Node.js is installed on Jenkins agent
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Security Audit') {
            steps {
                sh 'npm run security:audit'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .'
            }
        }

        stage('Push Docker Image') {
            when {
                branch 'main'
            }
            steps {
                sh 'echo $GITHUB_TOKEN | docker login ghcr.io -u 24007421 --password-stdin'
                sh 'docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}'
                sh 'docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest'
                sh 'docker push ${DOCKER_IMAGE}:latest'
            }
        }

        stage('Security Scan') {
            steps {
                // Assuming Trivy is installed
                sh 'trivy fs --format sarif --output trivy-results.sarif .'
                // Upload SARIF if possible, or archive artifacts
            }
        }

        stage('Code Quality') {
            steps {
                // Assuming SonarQube scanner is configured
                sh 'sonar-scanner'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'coverage/**, trivy-results.sarif', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}