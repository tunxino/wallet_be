pipeline {
  agent any

  environment {
    NODE_ENV = "production"
    NVM_DIR = "/root/.nvm"
  }

  stages {

        stage('Checkout Code') {
          steps {
            echo "📦 Cloning repository..."
            git branch: 'main', url: 'https://github.com/tunxino/wallet_be.git'
          }
        }

        stage('Install Dependencies') {
          steps {
            echo "📦 Installing dependencies..."
            sh 'npm ci'
          }
        }

      stage('Build Project') {
            steps {
              echo '🏗️ Building NestJS project...'
              sh '''
                npm run build
              '''
            }
          }


       stage('Deploy') {
             steps {
               echo "🚀 Deploying"
               sh '''
                 if pm2 describe wallet_be > /dev/null; then
                   echo "♻️ Reloading existing PM2 process..."
                   pm2 reload wallet_be
                 else
                   echo "🚀 Starting new PM2 process..."
                   pm2 start dist/main.js --name wallet_be
                 fi
                 pm2 save
               '''
             }
           }
         }

  post {
    success {
      echo "✅ Deployment successful!"
    }
    failure {
      echo "❌ Deployment failed!"
    }
  }
}
