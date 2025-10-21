#!/bin/bash

set -e

ENVIRONMENT=${1:-dev}
NAMESPACE="aquapump-${ENVIRONMENT}"
RELEASE_NAME="aquapump"
REVISION=${2:-0}

if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
  echo "❌ Invalid environment. Use: dev, staging, or production"
  exit 1
fi

echo "🔄 Rolling back AquaPump in ${ENVIRONMENT}..."

if [ "$REVISION" = "0" ]; then
  echo "Rolling back to previous revision..."
  helm rollback ${RELEASE_NAME} -n ${NAMESPACE} --wait --timeout 5m
else
  echo "Rolling back to revision ${REVISION}..."
  helm rollback ${RELEASE_NAME} ${REVISION} -n ${NAMESPACE} --wait --timeout 5m
fi

echo "✅ Rollback complete!"
echo ""
echo "Check status:"
echo "  kubectl get pods -n ${NAMESPACE}"
echo "  helm history ${RELEASE_NAME} -n ${NAMESPACE}"
