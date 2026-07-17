pipeline {
  agent any

  triggers {
    pollSCM('* * * * *')
  }

  options {
    disableConcurrentBuilds()
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '10'))
    skipDefaultCheckout(true)
  }

  environment {
    IMAGE_REPO     = 'hkprogrammer/doe-ui'
    K8S_CONTAINER  = 'doe'
  }

  stages {
    stage('Resolve Branch / Environment') {
      steps {
        script {
          def scmBranch = scm.branches[0].name ?: 'origin/dev'
          String normalizedBranch = scmBranch.trim()

          if (normalizedBranch.startsWith('*/')) normalizedBranch = normalizedBranch.substring(2)
          if (normalizedBranch.startsWith('origin/')) normalizedBranch = normalizedBranch.substring('origin/'.length())
          if (normalizedBranch.startsWith('refs/heads/')) normalizedBranch = normalizedBranch.substring('refs/heads/'.length())

          normalizedBranch = normalizedBranch.trim()

          if (!(normalizedBranch in ['dev', 'uat', 'prod'])) {
            error("Branch '${normalizedBranch}' não permitida. Use apenas dev, uat ou prod.")
          }

          env.GIT_BRANCH = normalizedBranch
          env.APP_ENV = normalizedBranch

          env.K8S_NAMESPACE  = "front-end-react-${normalizedBranch}"
          env.K8S_DEPLOYMENT = "doe-${normalizedBranch}"
          env.K8S_SERVICE    = "doe-${normalizedBranch}-svc"

          if (normalizedBranch == 'dev') {
            env.INGRESS_HOST = 'doe-dev.house-software.com.br'
          } else if (normalizedBranch == 'uat') {
            env.INGRESS_HOST = 'doe-uat.house-software.com.br'
          } else {
            env.INGRESS_HOST = 'doe.house-software.com.br'
          }
        }
      }
    }

    stage('Checkout') {
      steps {
        checkout scm
        script {
          env.GIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        }
      }
    }

    stage('Prepare') {
      steps {
        script {
          env.APP_VERSION = sh(
            script: "grep '\"version\"' package.json | head -1 | sed -E 's/.*\"version\"[[:space:]]*:[[:space:]]*\"([^\"]+)\".*/\\1/'",
            returnStdout: true
          ).trim()

          env.FULL_IMAGE_VERSION = "${env.IMAGE_REPO}:${env.APP_ENV}-${env.APP_VERSION}"
          env.FULL_IMAGE_SHA     = "${env.IMAGE_REPO}:${env.APP_ENV}-${env.APP_VERSION}-${env.GIT_SHA}"
          env.FULL_IMAGE_LATEST  = "${env.IMAGE_REPO}:${env.APP_ENV}-latest"
        }
      }
    }

    stage('Validate Kubernetes Access') {
      steps {
        sh '''
          set -e
          kubectl auth can-i get pods -n ${K8S_NAMESPACE}
          kubectl get ns
        '''
      }
    }

    stage('Build Docker Image') {
      steps {
        sh '''
          set -e

          ENV_FILE="k8s/env/${APP_ENV}.env"

          if [ ! -f "$ENV_FILE" ]; then
            echo "Arquivo de ambiente não encontrado: $ENV_FILE"
            exit 1
          fi

          set -a
          . "$ENV_FILE"
          set +a

          echo "===== BUILD ENV ====="
          echo "APP_ENV=${APP_ENV}"
          echo "API_INTERNAL_BASE_URL=${API_INTERNAL_BASE_URL}"
          echo "NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}"
          echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}"

          docker build --no-cache --pull \
            --build-arg APP_ENV="${APP_ENV}" \
            --build-arg API_INTERNAL_BASE_URL="${API_INTERNAL_BASE_URL}" \
            --build-arg NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL}" \
            --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="${NEXT_PUBLIC_FIREBASE_API_KEY}" \
            --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}" \
            --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="${NEXT_PUBLIC_FIREBASE_PROJECT_ID}" \
            --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}" \
            --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}" \
            --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="${NEXT_PUBLIC_FIREBASE_APP_ID}" \
            --build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}" \
            --build-arg NEXT_PUBLIC_FIREBASE_VAPID_KEY="${NEXT_PUBLIC_FIREBASE_VAPID_KEY}" \
            -t ${FULL_IMAGE_VERSION} \
            -t ${FULL_IMAGE_SHA} \
            -t ${FULL_IMAGE_LATEST} .
        '''
      }
    }

    stage('Push Docker Hub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DH_USER',
          passwordVariable: 'DH_PASS'
        )]) {
          sh '''
            set -e
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin

            docker push ${FULL_IMAGE_VERSION}
            docker push ${FULL_IMAGE_SHA}
            docker push ${FULL_IMAGE_LATEST}
          '''
        }
      }
    }

    stage('Bootstrap Kubernetes Resources') {
      steps {
        sh '''
          set -e

          kubectl get namespace ${K8S_NAMESPACE} >/dev/null 2>&1 || kubectl create namespace ${K8S_NAMESPACE}

          ENV_FILE="k8s/env/${APP_ENV}.env"

          if [ ! -f "$ENV_FILE" ]; then
            echo "Arquivo de ambiente não encontrado: $ENV_FILE"
            exit 1
          fi

          test -f k8s/configmap.yaml
          test -f k8s/secret.yaml
          test -f k8s/deployment.yaml
          test -f k8s/service.yaml
          test -f k8s/hpa.yaml
          test -f k8s/ingress.yaml

          set -a
          . "$ENV_FILE"
          set +a

          export APP_ENV="${APP_ENV}"
          export K8S_NAMESPACE="${K8S_NAMESPACE}"
          export K8S_DEPLOYMENT="${K8S_DEPLOYMENT}"
          export K8S_SERVICE="${K8S_SERVICE}"
          export K8S_CONTAINER="${K8S_CONTAINER}"
          export INGRESS_HOST="${INGRESS_HOST}"
          export FULL_IMAGE_SHA="${FULL_IMAGE_SHA}"

          : "${REPLICAS:=1}"
          : "${MAX_SURGE:=0}"
          : "${MAX_UNAVAILABLE:=1}"
          : "${CPU_REQUEST:=50m}"
          : "${MEMORY_REQUEST:=128Mi}"
          : "${CPU_LIMIT:=300m}"
          : "${MEMORY_LIMIT:=384Mi}"
          : "${HPA_MIN_REPLICAS:=1}"
          : "${HPA_MAX_REPLICAS:=1}"
          : "${HPA_CPU_AVG_UTILIZATION:=80}"
          : "${HPA_MEMORY_AVG_UTILIZATION:=85}"

          export REPLICAS MAX_SURGE MAX_UNAVAILABLE
          export CPU_REQUEST MEMORY_REQUEST CPU_LIMIT MEMORY_LIMIT
          export HPA_MIN_REPLICAS HPA_MAX_REPLICAS
          export HPA_CPU_AVG_UTILIZATION HPA_MEMORY_AVG_UTILIZATION

          mkdir -p k8s-rendered

          render() {
            input="$1"
            output="$2"

            sed \
              -e "s|\\${APP_ENV}|${APP_ENV}|g" \
              -e "s|\\${K8S_NAMESPACE}|${K8S_NAMESPACE}|g" \
              -e "s|\\${K8S_DEPLOYMENT}|${K8S_DEPLOYMENT}|g" \
              -e "s|\\${K8S_SERVICE}|${K8S_SERVICE}|g" \
              -e "s|\\${K8S_CONTAINER}|${K8S_CONTAINER}|g" \
              -e "s|\\${INGRESS_HOST}|${INGRESS_HOST}|g" \
              -e "s|\\${FULL_IMAGE_SHA}|${FULL_IMAGE_SHA}|g" \
              -e "s|\\${REPLICAS}|${REPLICAS}|g" \
              -e "s|\\${MAX_SURGE}|${MAX_SURGE}|g" \
              -e "s|\\${MAX_UNAVAILABLE}|${MAX_UNAVAILABLE}|g" \
              -e "s|\\${CPU_REQUEST}|${CPU_REQUEST}|g" \
              -e "s|\\${MEMORY_REQUEST}|${MEMORY_REQUEST}|g" \
              -e "s|\\${CPU_LIMIT}|${CPU_LIMIT}|g" \
              -e "s|\\${MEMORY_LIMIT}|${MEMORY_LIMIT}|g" \
              -e "s|\\${HPA_MIN_REPLICAS}|${HPA_MIN_REPLICAS}|g" \
              -e "s|\\${HPA_MAX_REPLICAS}|${HPA_MAX_REPLICAS}|g" \
              -e "s|\\${HPA_CPU_AVG_UTILIZATION}|${HPA_CPU_AVG_UTILIZATION}|g" \
              -e "s|\\${HPA_MEMORY_AVG_UTILIZATION}|${HPA_MEMORY_AVG_UTILIZATION}|g" \
              "$input" > "$output"
          }

          render k8s/configmap.yaml k8s-rendered/configmap.yaml
          render k8s/secret.yaml k8s-rendered/secret.yaml
          render k8s/deployment.yaml k8s-rendered/deployment.yaml
          render k8s/service.yaml k8s-rendered/service.yaml
          render k8s/hpa.yaml k8s-rendered/hpa.yaml
          render k8s/ingress.yaml k8s-rendered/ingress.yaml

          echo "===== ENV CARREGADA ====="
          cat "$ENV_FILE"

          echo "===== SECRET RENDERIZADA ====="
          cat k8s-rendered/secret.yaml

          echo "===== DEPLOYMENT RENDERIZADO ====="
          cat k8s-rendered/deployment.yaml

          kubectl apply -n ${K8S_NAMESPACE} -f k8s-rendered/configmap.yaml
          kubectl apply -n ${K8S_NAMESPACE} -f k8s-rendered/secret.yaml
          kubectl apply -n ${K8S_NAMESPACE} -f k8s-rendered/deployment.yaml
          kubectl apply -n ${K8S_NAMESPACE} -f k8s-rendered/service.yaml
          kubectl apply -n ${K8S_NAMESPACE} -f k8s-rendered/hpa.yaml
          kubectl apply -n ${K8S_NAMESPACE} -f k8s-rendered/ingress.yaml
        '''
      }
    }

    stage('Deploy no Rancher/K8s') {
      steps {
        sh '''
          set -e

          kubectl -n ${K8S_NAMESPACE} get deployment ${K8S_DEPLOYMENT}

          kubectl -n ${K8S_NAMESPACE} set image deployment/${K8S_DEPLOYMENT} \
            ${K8S_CONTAINER}=${FULL_IMAGE_SHA}

          kubectl -n ${K8S_NAMESPACE} rollout status deployment/${K8S_DEPLOYMENT} --timeout=300s
        '''
      }
    }

    stage('Validate Running Image') {
      steps {
        sh '''
          set -e

          POD_NAME=$(kubectl -n ${K8S_NAMESPACE} get pods \
            -l app=${K8S_DEPLOYMENT} \
            --field-selector=status.phase=Running \
            -o jsonpath="{.items[0].metadata.name}")

          if [ -z "$POD_NAME" ]; then
            echo "Nenhum pod Running encontrado."
            kubectl -n ${K8S_NAMESPACE} get pods -l app=${K8S_DEPLOYMENT}
            kubectl -n ${K8S_NAMESPACE} describe deployment ${K8S_DEPLOYMENT}
            kubectl -n ${K8S_NAMESPACE} logs deployment/${K8S_DEPLOYMENT} --tail=100 || true
            exit 1
          fi

          echo "===== POD RUNNING ====="
          echo "$POD_NAME"

          echo "===== IMAGE EM EXECUÇÃO ====="
          kubectl -n ${K8S_NAMESPACE} get pod "$POD_NAME" -o jsonpath="{.spec.containers[0].image}"
          echo ""

          echo "===== ENV DA POD ====="
          kubectl -n ${K8S_NAMESPACE} exec "$POD_NAME" -- printenv | sort | grep -E 'NODE_ENV|NEXT_|APP_ENV|API_INTERNAL_BASE_URL|FIREBASE' || true

          echo "===== VALIDANDO FIREBASE PROJECT ID ====="
          kubectl -n ${K8S_NAMESPACE} exec "$POD_NAME" -- sh -c 'printenv NEXT_PUBLIC_FIREBASE_PROJECT_ID || true'

          echo "===== LOGS DA APLICAÇÃO ====="
          kubectl -n ${K8S_NAMESPACE} logs "$POD_NAME" --tail=100 || true
        '''
      }
    }
  }

  post {
    success {
      echo "Deploy realizado com sucesso: ${FULL_IMAGE_SHA} no deployment ${K8S_DEPLOYMENT}"
    }
    failure {
      echo "Pipeline falhou para a branch ${GIT_BRANCH ?: 'desconhecida'}."
    }
    always {
      sh '''
        rm -rf k8s-rendered || true
        command -v docker >/dev/null 2>&1 && docker logout || true
        command -v docker >/dev/null 2>&1 && docker image prune -f || true
      '''
      cleanWs()
    }
  }
}