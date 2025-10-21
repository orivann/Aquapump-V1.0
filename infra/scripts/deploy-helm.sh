#!/bin/bash

set -e

ENVIRONMENT=${1:-dev}
NAMESPACE="aquapump-${ENVIRONMENT}"
RELEASE_NAME="aquapump"
CHART_PATH="../infra/helm/aquapump"

if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
  echo "❌ Invalid environment. Use: dev, staging, or production"
  exit 1
fi

echo "🚀 Deploying AquaPump to ${ENVIRONMENT}..."

kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

if [ "$ENVIRONMENT" = "production" ]; then
  VALUES_FILE="${CHART_PATH}/values.yaml"
elif [ "$ENVIRONMENT" = "staging" ]; then
  VALUES_FILE="${CHART_PATH}/values-staging.yaml"
else
  VALUES_FILE="${CHART_PATH}/values-dev.yaml"
fi

echo "📦 Installing/Upgrading Helm chart..."
helm upgrade --install ${RELEASE_NAME} ${CHART_PATH} \
  --namespace ${NAMESPACE} \
  --values ${VALUES_FILE} \
  --create-namespace \
  --wait \
  --timeout 5m \
  --atomic

echo "✅ Deployment complete!"
echo ""
echo "Check status:"
echo "  kubectl get pods -n ${NAMESPACE}"
echo "  kubectl get svc -n ${NAMESPACE}"
echo "  kubectl get ingress -n ${NAMESPACE}"
echo ""
echo "View logs:"
echo "  kubectl logs -f deployment/${RELEASE_NAME} -n ${NAMESPACE}"
