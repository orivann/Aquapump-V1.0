#!/bin/bash

# ===============================================
# AquaPump Production Deployment Script
# ===============================================
# Pulls and runs production images from Docker Hub
# Usage: bash infra/scripts/deploy-prod.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  AquaPump Production Deployment${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running!${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Docker is running"
echo ""

# Check .env.production
if [ ! -f ".env.production" ]; then
    echo -e "${RED}✗ .env.production not found!${NC}"
    echo "  Create it from: cp .env.production.example .env.production"
    exit 1
fi

echo -e "${GREEN}✓${NC} .env.production exists"
echo ""

# Navigate to infra directory
cd "$(dirname "$0")/.." || exit 1

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker compose -f docker-compose.prod.yml down

echo ""

# Pull latest images
echo -e "${YELLOW}Pulling latest images from Docker Hub...${NC}"
docker compose -f docker-compose.prod.yml pull

echo ""

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker compose -f docker-compose.prod.yml up -d

echo ""

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 10

# Check backend health
echo -e "${BLUE}Checking backend health...${NC}"
for i in {1..30}; do
    if curl -sf http://localhost:8081/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Backend is healthy"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗${NC} Backend health check failed"
        docker logs aquapump-backend-prod --tail 50
        exit 1
    fi
    sleep 2
done

echo ""

# Check frontend health
echo -e "${BLUE}Checking frontend health...${NC}"
for i in {1..30}; do
    if curl -sf http://localhost:8080 > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Frontend is healthy"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗${NC} Frontend health check failed"
        docker logs aquapump-frontend-prod --tail 50
        exit 1
    fi
    sleep 2
done

echo ""
echo -e "${GREEN}✓ Deployment successful!${NC}"
echo ""
echo -e "${BLUE}Services are running:${NC}"
echo "  Backend:  http://localhost:8081"
echo "  Frontend: http://localhost:8080"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  View logs:    docker compose -f infra/docker-compose.prod.yml logs -f"
echo "  Stop:         docker compose -f infra/docker-compose.prod.yml down"
echo "  Restart:      docker compose -f infra/docker-compose.prod.yml restart"
echo ""
