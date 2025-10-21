#!/bin/bash

# AquaPump Logs Script
# Usage: ./scripts/logs.sh [docker|k8s]

PLATFORM=${1:-docker}

if [ "$PLATFORM" == "docker" ]; then
    echo "📋 Showing Docker logs..."
    docker-compose logs -f app
elif [ "$PLATFORM" == "k8s" ] || [ "$PLATFORM" == "kubernetes" ]; then
    echo "📋 Showing Kubernetes logs..."
    kubectl logs -f deployment/aquapump-app --all-containers=true
else
    echo "❌ Invalid platform. Use 'docker' or 'k8s'"
    exit 1
fi
