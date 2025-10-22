#!/bin/bash

# ===============================================
# AquaPump Production Docker Build Script
# ===============================================
# Builds and pushes production images to Docker Hub
# Usage: bash infra/scripts/docker-build-prod.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  AquaPump Production Build${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running!${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Docker is running"
echo ""

# Configuration
DOCKER_USERNAME="orivann"
BACKEND_IMAGE="${DOCKER_USERNAME}/aquapump-backend"
FRONTEND_IMAGE="${DOCKER_USERNAME}/aquapump-frontend"
TAG="${1:-prod}"

echo -e "${BLUE}Building images...${NC}"
echo "  Backend:  ${BACKEND_IMAGE}:${TAG}"
echo "  Frontend: ${FRONTEND_IMAGE}:${TAG}"
echo ""

# Build backend
echo -e "${YELLOW}Building backend...${NC}"
docker build \
  -f infra/Dockerfile.backend \
  -t ${BACKEND_IMAGE}:${TAG} \
  -t ${BACKEND_IMAGE}:latest \
  .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Backend built successfully"
else
    echo -e "${RED}✗${NC} Backend build failed"
    exit 1
fi

echo ""

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
docker build \
  -f infra/Dockerfile.frontend \
  -t ${FRONTEND_IMAGE}:${TAG} \
  -t ${FRONTEND_IMAGE}:latest \
  .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Frontend built successfully"
else
    echo -e "${RED}✗${NC} Frontend build failed"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ All images built successfully${NC}"
echo ""

# Push to Docker Hub
echo -e "${BLUE}Push to Docker Hub?${NC}"
read -p "Continue? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Pushing backend...${NC}"
    docker push ${BACKEND_IMAGE}:${TAG}
    docker push ${BACKEND_IMAGE}:latest
    
    echo -e "${YELLOW}Pushing frontend...${NC}"
    docker push ${FRONTEND_IMAGE}:${TAG}
    docker push ${FRONTEND_IMAGE}:latest
    
    echo ""
    echo -e "${GREEN}✓ Images pushed to Docker Hub${NC}"
    echo ""
    echo -e "${BLUE}Deployed images:${NC}"
    echo "  ${BACKEND_IMAGE}:${TAG}"
    echo "  ${FRONTEND_IMAGE}:${TAG}"
    echo ""
else
    echo ""
    echo -e "${YELLOW}Skipped push to Docker Hub${NC}"
    echo ""
    echo -e "${BLUE}To push manually:${NC}"
    echo "  docker push ${BACKEND_IMAGE}:${TAG}"
    echo "  docker push ${FRONTEND_IMAGE}:${TAG}"
    echo ""
fi

echo -e "${BLUE}Next steps:${NC}"
echo "  1. Update Kubernetes/Helm with new image tags"
echo "  2. Deploy: kubectl apply -f infra/kubernetes/"
echo "  3. Or use Helm: helm upgrade aquapump infra/helm/aquapump"
echo ""
