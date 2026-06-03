pipeline {
    agent any

    environment {
        MONGO_ROOT_USER     = 'root'
        MONGO_ROOT_PASSWORD = 'mean_dev_secret_change_me'
        MONGO_DATABASE      = 'meanapp'
        MONGO_HOST          = 'host.docker.internal'
        MONGO_PORT          = '27017'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Syntax Check') {
            steps {
                sh "git ls-files '*.js' | xargs -n1 node --check"
            }
        }

        stage('Wait for MongoDB') {
            steps {
                sh '''
                    for i in $(seq 1 20); do
                      if node -e "const n=require('net');const s=n.createConnection({host:process.env.MONGO_HOST,port:Number(process.env.MONGO_PORT)},()=>{s.end();process.exit(0)});s.on('error',()=>process.exit(1));"; then
                        echo "MongoDB is reachable"
                        exit 0
                      fi
                      sleep 2
                    done
                    echo "MongoDB is not reachable at $MONGO_HOST:$MONGO_PORT"
                    exit 1
                '''
            }
        }

        stage('Seed Database') {
            steps {
                sh 'npm run seed:reset'
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                    npm start &
                    APP_PID=$!

                    for i in $(seq 1 20); do
                      if curl -sSf http://127.0.0.1:3000/api/locations > /tmp/locations.json; then
                        break
                      fi
                      sleep 2
                    done

                    test -s /tmp/locations.json
                    grep -q '\\[' /tmp/locations.json

                    kill $APP_PID || true
                '''
            }
        }
    }
}
