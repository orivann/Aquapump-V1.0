#!/bin/bash

# ===============================================
# AquaPump Docker Push Script
# ===============================================
# Pushes pre-built images to Docker Hub
# Usage: bash infra/scripts/docker-push-prod.sh [tag]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Push to Docker Hub${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Configuration
DOCKER_USERNAME="orivann"
BACKEND_IMAGE="${DOCKER_USERNAME}/aquapump-backend"
FRONTEND_IMAGE="${DOCKER_USERNAME}/aquapump-frontend"
TAG="${1:-prod}"

# Check if logged in to Docker Hub
if ! docker info | grep -q "Username"; then
    echo -e "${YELLOW}Not logged in to Docker Hub${NC}"
    echo "Running: docker login"
    docker login
    echo ""
fi

echo -e "${BLUE}Pushing images with tag: ${TAG}${NC}"
echo ""

# Tag images
echo -e "${YELLOW}Tagging images...${NC}"
docker tag aquapump-backend:latest ${BACKEND_IMAGE}:${TAG}
docker tag aquapump-backend:latest ${BACKEND_IMAGE}:latest
docker tag aquapump-frontend:latest ${FRONTEND_IMAGE}:${TAG}
docker tag aquapump-frontend:latest ${FRONTEND_IMAGE}:latest

echo -e "${GREEN}✓${NC} Images tagged"
echo ""

# Push backend
echo -e "${YELLOW}Pushing backend...${NC}"
docker push ${BACKEND_IMAGE}:${TAG}
docker push ${BACKEND_IMAGE}:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Backend pushed successfully"
else
    echo -e "${RED}✗${NC} Backend push failed"
    exit 1
fi

echo ""

# Push frontend
echo -e "${YELLOW}Pushing frontend...${NC}"
docker push ${FRONTEND_IMAGE}:${TAG}
docker push ${FRONTEND_IMAGE}:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Frontend pushed successfully"
else
    echo -e "${RED}✗${NC} Frontend push failed"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ All images pushed to Docker Hub${NC}"
echo ""
echo -e "${BLUE}Deployed images:${NC}"
echo "  ${BACKEND_IMAGE}:${TAG}"
echo "  ${BACKEND_IMAGE}:latest"
echo "  ${FRONTEND_IMAGE}:${TAG}"
echo "  ${FRONTEND_IMAGE}:latest"
echo ""
