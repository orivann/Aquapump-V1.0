#!/bin/bash

ENVIRONMENT=${1:-dev}
NAMESPACE="aquapump-${ENVIRONMENT}"

echo "🔍 Health check for ${ENVIRONMENT}..."
echo ""

echo "📊 Pod Status:"
kubectl get pods -n ${NAMESPACE}
echo ""

echo "���� Service Status:"
kubectl get svc -n ${NAMESPACE}
echo ""

echo "🔀 Ingress Status:"
kubectl get ingress -n ${NAMESPACE}
echo ""

echo "📈 HPA Status:"
kubectl get hpa -n ${NAMESPACE}
echo ""

echo "🔍 Recent Events:"
kubectl get events -n ${NAMESPACE} --sort-by='.lastTimestamp' | tail -10
echo ""

POD_NAME=$(kubectl get pods -n ${NAMESPACE} -l app.kubernetes.io/name=aquapump -o jsonpath='{.items[0].metadata.name}')

if [ -n "$POD_NAME" ]; then
    echo "🏥 Health Check Endpoint:"
    kubectl exec -n ${NAMESPACE} ${POD_NAME} -- curl -s http://localhost:8081/api/health | jq .
    echo ""
    
    echo "📝 Recent Logs:"
    kubectl logs -n ${NAMESPACE} ${POD_NAME} --tail=20
fi
