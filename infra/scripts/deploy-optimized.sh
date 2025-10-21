#!/bin/bash

# Optimized AquaPump Deployment Script with Docker Registry Support
# Usage: ./scripts/deploy-optimized.sh [environment] [registry]
# Example: ./scripts/deploy-optimized.sh production ghcr.io/yourorg

set -e

ENVIRONMENT=${1:-development}
REGISTRY=${2:-""}
VERSION=${3:-$(date +%Y%m%d-%H%M%S)}
IMAGE_NAME="aquapump"

if [ -n "$REGISTRY" ]; then
    FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}"
else
    FULL_IMAGE_NAME="${IMAGE_NAME}"
fi

echo "🚀 Deploying AquaPump"
echo "   Environment: $ENVIRONMENT"
echo "   Version: $VERSION"
echo "   Image: $FULL_IMAGE_NAME:$VERSION"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

check_docker_daemon() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker daemon is not running"
        exit 1
    fi
}

check_requirements() {
    print_status "Checking requirements..."
    
    check_docker_daemon
    
    if [ ! -f "Dockerfile" ]; then
        print_error "Dockerfile not found"
        exit 1
    fi
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found"
        exit 1
    fi
    
    print_status "All requirements met"
}

pull_cache_images() {
    print_info "Attempting to pull cache images..."
    
    docker pull ${FULL_IMAGE_NAME}:latest 2>/dev/null || {
        print_warning "No cache found, building from scratch"
    }
}

build_image_with_retry() {
    print_status "Building Docker image..."
    
    local max_retries=3
    local retry_count=0
    local build_success=false
    
    while [ $retry_count -lt $max_retries ] && [ "$build_success" = false ]; do
        print_info "Build attempt $((retry_count + 1))/$max_retries"
        
        if DOCKER_BUILDKIT=1 docker build \
            --build-arg BUILDKIT_INLINE_CACHE=1 \
            --cache-from ${FULL_IMAGE_NAME}:latest \
            --progress=plain \
            -t ${FULL_IMAGE_NAME}:${VERSION} \
            -t ${FULL_IMAGE_NAME}:latest \
            . ; then
            
            build_success=true
            print_status "Docker image built successfully"
            
            docker images | grep ${IMAGE_NAME} | head -3
            
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $max_retries ]; then
                print_warning "Build failed. Waiting 10s before retry..."
                sleep 10
            else
                print_error "Build failed after $max_retries attempts"
                echo ""
                print_error "Possible causes:"
                echo "  1. Docker Hub rate limiting or downtime (503 errors)"
                echo "  2. Network connectivity issues"
                echo "  3. Insufficient disk space"
                echo ""
                echo "Solutions:"
                echo "  • Wait 5-10 minutes and try again"
                echo "  • Check Docker Hub status: https://status.docker.com/"
                echo "  • Use a mirror registry"
                echo "  • Login to Docker Hub: docker login"
                echo "  • Clear Docker cache: docker system prune -a"
                exit 1
            fi
        fi
    done
}

push_to_registry() {
    if [ -n "$REGISTRY" ]; then
        print_status "Pushing to registry..."
        
        docker push ${FULL_IMAGE_NAME}:${VERSION}
        docker push ${FULL_IMAGE_NAME}:latest
        
        print_status "Images pushed successfully"
    else
        print_info "No registry specified, skipping push"
    fi
}

deploy_docker_compose() {
    print_status "Deploying with Docker Compose..."
    
    export IMAGE_TAG=${VERSION}
    
    if [ "$ENVIRONMENT" == "production" ]; then
        docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml up -d
    else
        docker-compose down --remove-orphans 2>/dev/null || true
        docker-compose up -d
    fi
    
    print_status "Waiting for health check..."
    sleep 5
    
    for i in {1..30}; do
        if curl -sf http://localhost:8081/api/health >/dev/null 2>&1; then
            print_status "Application is healthy!"
            break
        else
            if [ $i -eq 30 ]; then
                print_error "Health check failed"
                docker-compose logs --tail=50
                exit 1
            fi
            echo -n "."
            sleep 2
        fi
    done
    
    print_status "Docker Compose deployment complete"
}

deploy_helm() {
    print_status "Deploying with Helm..."
    
    if ! command -v helm &> /dev/null; then
        print_error "Helm is not installed"
        exit 1
    fi
    
    local values_file="infra/helm/aquapump/values.yaml"
    
    if [ "$ENVIRONMENT" == "production" ]; then
        values_file="infra/helm/aquapump/values.yaml,infra/helm/aquapump/values-production.yaml"
    elif [ "$ENVIRONMENT" == "staging" ]; then
        values_file="infra/helm/aquapump/values.yaml,infra/helm/aquapump/values-staging.yaml"
    elif [ "$ENVIRONMENT" == "development" ]; then
        values_file="infra/helm/aquapump/values.yaml,infra/helm/aquapump/values-dev.yaml"
    fi
    
    helm upgrade --install aquapump \
        ./infra/helm/aquapump \
        -f ${values_file} \
        --set image.tag=${VERSION} \
        --set image.repository=${FULL_IMAGE_NAME} \
        --namespace aquapump \
        --create-namespace \
        --wait \
        --timeout 5m
    
    print_status "Helm deployment complete"
}

show_deployment_info() {
    echo ""
    print_status "Deployment completed successfully! 🎉"
    echo ""
    echo "═══════════════════════════════════════════════════════"
    echo "Deployment Information"
    echo "═══════════════════════════════════════════════════════"
    echo "Environment:  $ENVIRONMENT"
    echo "Version:      $VERSION"
    echo "Image:        $FULL_IMAGE_NAME:$VERSION"
    echo ""
    echo "Next steps:"
    echo "  • Check logs:    docker-compose logs -f"
    echo "  • Health check:  curl http://localhost:8081/api/health"
    echo "  • Access app:    http://localhost:8081"
    echo ""
    
    if [ "$ENVIRONMENT" == "production" ]; then
        echo "Production checklist:"
        echo "  ☐ Verify health check"
        echo "  ☐ Check application logs"
        echo "  ☐ Test critical endpoints"
        echo "  ☐ Monitor resource usage"
        echo "  ☐ Verify database connections"
    fi
    echo "═══════════════════════════════════════════════════════"
}

main() {
    check_requirements
    
    echo ""
    echo "Select deployment method:"
    echo "1) Docker Compose (local/simple)"
    echo "2) Helm/Kubernetes (production)"
    echo "3) Build only"
    read -p "Enter choice [1-3]: " choice
    
    case $choice in
        1)
            pull_cache_images
            build_image_with_retry
            deploy_docker_compose
            ;;
        2)
            pull_cache_images
            build_image_with_retry
            push_to_registry
            deploy_helm
            ;;
        3)
            pull_cache_images
            build_image_with_retry
            push_to_registry
            print_info "Build complete. Ready for manual deployment."
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    show_deployment_info
}

main
