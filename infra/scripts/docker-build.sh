#!/bin/bash

# ===============================================
# AquaPump Docker Build Script
# ===============================================
# Builds Docker images for local deployment
# Run from project root: bash infra/scripts/docker-build.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  AquaPump Docker Build${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

cd "$(dirname "$0")/../.."

if [ ! -f ".env" ]; then
    print_warning ".env file not found"
    if [ -f ".env.example" ]; then
        print_info "Creating .env from .env.example"
        cp .env.example .env
        print_status "Created .env file - please update with your credentials"
    else
        print_error ".env.example not found"
        exit 1
    fi
fi

print_info "Building Docker images..."
echo ""

cd infra

if docker compose build --no-cache 2>&1; then
    print_status "Docker images built successfully!"
    echo ""
    print_info "To start the containers, run:"
    echo "  cd infra && docker compose up"
    echo ""
    print_info "Or to start in detached mode:"
    echo "  cd infra && docker compose up -d"
    echo ""
    exit 0
else
    print_error "Docker build failed"
    echo ""
    print_info "Common issues:"
    echo "  1. Expo export command - check Dockerfile.frontend"
    echo "  2. Missing dependencies - run: bun install"
    echo "  3. Base image pull - try: docker pull node:22-alpine"
    echo ""
    exit 1
fi
