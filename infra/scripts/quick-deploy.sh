#!/bin/bash

# Quick deployment fix for Docker Hub 503 errors
# This script handles the immediate issue and deploys

set -e

echo "🔧 Quick Deployment Fix"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }

ENVIRONMENT=${1:-production}

print_info "Attempting to fix Docker Hub connectivity..."

check_docker_hub() {
    print_info "Checking Docker Hub status..."
    
    if curl -sf https://hub.docker.com/_/health >/dev/null 2>&1; then
        print_status "Docker Hub is reachable"
        return 0
    else
        print_warning "Docker Hub appears to be down or rate-limited"
        return 1
    fi
}

try_pull_base_image() {
    print_info "Attempting to pull base image..."
    
    if docker pull node:22-alpine 2>/dev/null; then
        print_status "Base image pulled successfully"
        return 0
    else
        print_warning "Failed to pull base image"
        return 1
    fi
}

use_cached_build() {
    print_info "Checking for cached images..."
    
    if docker images | grep -q "node.*22-alpine"; then
        print_status "Found cached base image, proceeding with build"
        return 0
    else
        print_error "No cached images found"
        return 1
    fi
}

build_with_mirror() {
    print_warning "Attempting to use Google Container Registry mirror..."
    
    cat > Dockerfile.mirror <<'EOF'
FROM mirror.gcr.io/library/node:22-alpine AS base
RUN apk add --no-cache libc6-compat curl dumb-init
WORKDIR /app

FROM base AS deps
RUN npm install -g bun@latest
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production=false

FROM base AS builder
RUN npm install -g bun@latest
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV EXPO_USE_FAST_RESOLVER=1

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8081

RUN npm install -g bun@latest && \
    addgroup -g 1001 -S nodejs && \
    adduser -S expouser -u 1001 && \
    mkdir -p /app/.expo && \
    chown -R expouser:nodejs /app

COPY --from=builder --chown=expouser:nodejs /app/package.json ./
COPY --from=builder --chown=expouser:nodejs /app/bun.lock* ./
COPY --from=builder --chown=expouser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expouser:nodejs /app/app ./app
COPY --from=builder --chown=expouser:nodejs /app/backend ./backend
COPY --from=builder --chown=expouser:nodejs /app/components ./components
COPY --from=builder --chown=expouser:nodejs /app/constants ./constants
COPY --from=builder --chown=expouser:nodejs /app/contexts ./contexts
COPY --from=builder --chown=expouser:nodejs /app/lib ./lib
COPY --from=builder --chown=expouser:nodejs /app/assets ./assets
COPY --from=builder --chown=expouser:nodejs /app/app.json ./
COPY --from=builder --chown=expouser:nodejs /app/tsconfig.json ./

USER expouser
EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8081/api/health || exit 1

CMD ["dumb-init", "bun", "run", "start-web-docker"]
EOF
    
    if docker build -f Dockerfile.mirror -t aquapump:latest .; then
        rm Dockerfile.mirror
        print_status "Built successfully using mirror"
        return 0
    else
        rm Dockerfile.mirror
        print_error "Mirror build failed"
        return 1
    fi
}

build_image() {
    print_info "Building Docker image..."
    
    local max_attempts=3
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        attempt=$((attempt + 1))
        print_info "Build attempt $attempt/$max_attempts"
        
        if DOCKER_BUILDKIT=1 docker build \
            --progress=plain \
            --network=host \
            -t aquapump:latest \
            . 2>&1 | tee /tmp/docker-build.log; then
            print_status "Build successful!"
            return 0
        else
            if [ $attempt -lt $max_attempts ]; then
                print_warning "Build failed, waiting 5s..."
                sleep 5
            fi
        fi
    done
    
    return 1
}

deploy_locally() {
    print_info "Deploying with Docker Compose..."
    
    if [ "$ENVIRONMENT" == "production" ]; then
        docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml up -d
    else
        docker-compose down 2>/dev/null || true
        docker-compose up -d
    fi
    
    print_status "Deployment started"
    
    print_info "Waiting for health check..."
    sleep 5
    
    for i in {1..20}; do
        if curl -sf http://localhost:8081/api/health >/dev/null 2>&1; then
            print_status "Application is healthy! ✨"
            echo ""
            echo "Access your app at: http://localhost:8081"
            return 0
        fi
        echo -n "."
        sleep 2
    done
    
    print_warning "Health check timeout, checking logs..."
    docker-compose logs --tail=30
}

main() {
    cd /home/user/rork-app
    
    if check_docker_hub; then
        if build_image; then
            deploy_locally
            exit 0
        fi
    fi
    
    print_warning "Docker Hub unavailable, trying alternatives..."
    
    if use_cached_build; then
        if build_image; then
            deploy_locally
            exit 0
        fi
    fi
    
    print_warning "Attempting mirror registry..."
    if build_with_mirror; then
        deploy_locally
        exit 0
    fi
    
    print_error "All deployment methods failed"
    echo ""
    echo "Manual steps to try:"
    echo "1. Wait 10-15 minutes for Docker Hub to recover"
    echo "2. Login to Docker Hub: docker login"
    echo "3. Use a VPN if you're rate-limited"
    echo "4. Pre-pull the base image: docker pull node:22-alpine"
    echo "5. Check Docker Hub status: https://status.docker.com/"
    echo ""
    echo "Logs saved to: /tmp/docker-build.log"
    exit 1
}

main
