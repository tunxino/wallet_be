pipeline {
  agent any

  environment {
    NODE_ENV = "production"
    NVM_DIR = "/root/.nvm"
  }

  stages {
        stage('Checkout Code') {
          steps {
            echo "📍Updating code..."
            sh '''
              if [ -d .git ]; then
                echo "🔄 Pulling latest changes..."
                git fetch origin main
                git reset --hard origin/main
              else
                echo "📥 Cloning repository for the first time..."
                git clone -b main https://github.com/tunxino/wallet_be.git .
              fi
            '''
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
              echo '⚙️️ Building NestJS project...'
              sh '''
                npm run build
              '''
            }
          }


       stage('Deploy') {
         steps {
           echo "🚀 Deploying"
           sh '''
             export PATH=$PATH:/root/.nvm/versions/node/v22.20.0/bin
             export PM2_HOME=/root/.pm2
             echo "Using PM2 from: $(which pm2)"
             pm2 list
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

  post {
    success {
      echo "✅ Deployment successful!"
    }
    failure {
      echo "❌ Deployment failed!"
    }
  }
}
