#!/bin/bash

set -e

echo "🚀 Setting up Argo CD for AquaPump GitOps"

NAMESPACE="argocd"
ARGOCD_VERSION="v2.12.0"

echo "📦 Installing Argo CD ${ARGOCD_VERSION}..."
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n ${NAMESPACE} -f https://raw.githubusercontent.com/argoproj/argo-cd/${ARGOCD_VERSION}/manifests/install.yaml

echo "⏳ Waiting for Argo CD to be ready..."
kubectl wait --for=condition=available --timeout=300s \
  deployment/argocd-server \
  deployment/argocd-repo-server \
  deployment/argocd-redis \
  -n ${NAMESPACE}

echo "🔑 Getting Argo CD admin password..."
ARGOCD_PASSWORD=$(kubectl -n ${NAMESPACE} get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
echo "Admin password: ${ARGOCD_PASSWORD}"

echo "🌐 Setting up port forward to access Argo CD UI..."
echo "Run: kubectl port-forward svc/argocd-server -n ${NAMESPACE} 8080:443"
echo "Then access: https://localhost:8080"
echo "Username: admin"
echo "Password: ${ARGOCD_PASSWORD}"

echo "📝 Creating AppProject and Applications..."
kubectl apply -f ../infra/argocd/appproject.yaml
kubectl apply -f ../infra/argocd/application-dev.yaml
kubectl apply -f ../infra/argocd/application-staging.yaml
kubectl apply -f ../infra/argocd/application.yaml

echo "✅ Argo CD setup complete!"
echo ""
echo "Next steps:"
echo "1. Access Argo CD UI: https://localhost:8080"
echo "2. Configure repository connection"
echo "3. Sync applications"
echo "4. Set up image updater (optional)"
