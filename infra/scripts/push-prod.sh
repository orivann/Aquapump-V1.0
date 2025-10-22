#!/bin/bash
set -e

echo "========================================"
echo "  Pushing Production Images to Docker Hub"
echo "========================================"
echo ""

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running"
    exit 1
fi

echo "🔐 Logging into Docker Hub..."
if [ -z "$DOCKER_HUB_TOKEN" ]; then
    docker login
else
    echo "$DOCKER_HUB_TOKEN" | docker login -u orivann --password-stdin
fi

echo ""
echo "⬆️  Pushing backend image..."
docker push orivann/aquapump-backend:prod
docker push orivann/aquapump-backend:latest

echo ""
echo "⬆️  Pushing frontend image..."
docker push orivann/aquapump-frontend:prod
docker push orivann/aquapump-frontend:latest

echo ""
echo "✅ Push complete!"
echo ""
echo "Images available at:"
echo "  - docker.io/orivann/aquapump-backend:prod"
echo "  - docker.io/orivann/aquapump-frontend:prod"
