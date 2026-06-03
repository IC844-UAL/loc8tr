pipeline {
    agent any

    environment {
        MONGO_ROOT_USER     = 'root'
        MONGO_ROOT_PASSWORD = 'ci_secret'
        MONGO_DATABASE      = 'meanapp'
        MONGO_HOST          = '127.0.0.1'
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

        stage('Start MongoDB') {
            steps {
                sh '''
                    docker rm -f jenkins-mongo || true
                    docker run -d --name jenkins-mongo \
                      -p 27017:27017 \
                      -e MONGO_INITDB_ROOT_USERNAME=$MONGO_ROOT_USER \
                      -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_ROOT_PASSWORD \
                      -e MONGO_INITDB_DATABASE=$MONGO_DATABASE \
                      mongo:7
                    sleep 10
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

    post {
        always {
            sh 'docker rm -f jenkins-mongo || true'
        }
    }
}
