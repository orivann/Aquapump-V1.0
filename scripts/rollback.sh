#!/bin/bash

# AquaPump Rollback Script
# Usage: ./scripts/rollback.sh [revision]

set -e

REVISION=${1:-0}

echo "🔄 Rolling back AquaPump deployment..."

if [ "$REVISION" -eq 0 ]; then
    echo "Rolling back to previous version..."
    kubectl rollout undo deployment/aquapump-app
else
    echo "Rolling back to revision $REVISION..."
    kubectl rollout undo deployment/aquapump-app --to-revision=$REVISION
fi

echo "Waiting for rollback to complete..."
kubectl rollout status deployment/aquapump-app

echo "✓ Rollback completed successfully!"
echo ""
echo "Current status:"
kubectl get pods -l app=aquapump
