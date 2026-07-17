#!/bin/bash
set -e

export KUBECONFIG=/home/deploy/.kube/config

echo "===== INICIANDO DEPLOY FRONTEND ====="

cd /opt/front-end-react/doe-ui

if [ ! -f k8s/env/prod.env ]; then
  echo "Arquivo k8s/env/prod.env não encontrado"
  exit 1
fi

set -a
. k8s/env/prod.env
set +a

if [ -z "$IMAGE_TAG" ]; then
  echo "IMAGE_TAG não informado"
  exit 1
fi

export IMAGE_REPO="${IMAGE_REPO:-hkprogrammer/doe}"
export FULL_IMAGE="${IMAGE_REPO}:${IMAGE_TAG}"

echo "Namespace: $K8S_NAMESPACE"
echo "Deployment: $K8S_DEPLOYMENT"
echo "Service: $K8S_SERVICE"
echo "Ingress: $INGRESS_HOST"
echo "Imagem: $FULL_IMAGE"

kubectl get namespace "$K8S_NAMESPACE" >/dev/null 2>&1 || kubectl create namespace "$K8S_NAMESPACE"

mkdir -p k8s/rendered

echo "===== RENDERIZANDO MANIFESTS ====="

envsubst < k8s/configmap.yaml > k8s/rendered/configmap.yaml
envsubst < k8s/deployment.yaml > k8s/rendered/deployment.yaml
envsubst < k8s/service.yaml > k8s/rendered/service.yaml
envsubst < k8s/ingress.yaml > k8s/rendered/ingress.yaml

if [ -f k8s/hpa.yaml ]; then
  envsubst < k8s/hpa.yaml > k8s/rendered/hpa.yaml
fi

echo "===== APLICANDO MANIFESTS ====="

kubectl apply -n "$K8S_NAMESPACE" -f k8s/rendered/configmap.yaml
kubectl apply -n "$K8S_NAMESPACE" -f k8s/rendered/deployment.yaml
kubectl apply -n "$K8S_NAMESPACE" -f k8s/rendered/service.yaml
kubectl apply -n "$K8S_NAMESPACE" -f k8s/rendered/ingress.yaml

if [ -f k8s/rendered/hpa.yaml ]; then
  kubectl apply -n "$K8S_NAMESPACE" -f k8s/rendered/hpa.yaml
fi

echo "===== ATUALIZANDO IMAGEM ====="

kubectl -n "$K8S_NAMESPACE" set image deployment/"$K8S_DEPLOYMENT" \
  "$K8S_CONTAINER=$FULL_IMAGE"

echo "===== AGUARDANDO ROLLOUT ====="

if ! kubectl -n "$K8S_NAMESPACE" rollout status deployment/"$K8S_DEPLOYMENT" --timeout=300s; then
  echo "Deploy falhou. Executando rollback..."
  kubectl -n "$K8S_NAMESPACE" rollout undo deployment/"$K8S_DEPLOYMENT"
  kubectl -n "$K8S_NAMESPACE" rollout status deployment/"$K8S_DEPLOYMENT" --timeout=300s || true

  echo "===== EVENTOS ====="
  kubectl -n "$K8S_NAMESPACE" get events --sort-by=.lastTimestamp | tail -50 || true

  echo "===== PODS ====="
  kubectl -n "$K8S_NAMESPACE" get pods -o wide || true

  exit 1
fi

echo "===== DEPLOY FINALIZADO ====="

kubectl -n "$K8S_NAMESPACE" get pods -l app="$K8S_DEPLOYMENT" -o wide
kubectl -n "$K8S_NAMESPACE" get svc
kubectl -n "$K8S_NAMESPACE" get ingress || true