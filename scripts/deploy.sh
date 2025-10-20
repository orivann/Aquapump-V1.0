#!/bin/bash

# AquaPump Deployment Script
# Usage: ./scripts/deploy.sh [environment]
# Example: ./scripts/deploy.sh production

set -e

ENVIRONMENT=${1:-development}
VERSION=${2:-latest}

echo "🚀 Deploying AquaPump - Environment: $ENVIRONMENT, Version: $VERSION"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        print_warning "kubectl is not installed (required for Kubernetes deployment)"
    fi
    
    print_status "All requirements met"
}

# Build Docker image with retry logic
build_image() {
    print_status "Building Docker image..."
    
    local max_retries=3
    local retry_count=0
    local build_success=false
    
    while [ $retry_count -lt $max_retries ] && [ "$build_success" = false ]; do
        if docker build \
            --build-arg BUILDKIT_INLINE_CACHE=1 \
            --cache-from aquapump:latest \
            -t aquapump:$VERSION \
            -t aquapump:latest \
            . ; then
            build_success=true
            print_status "Docker image built successfully"
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $max_retries ]; then
                print_warning "Build failed. Retrying ($retry_count/$max_retries)..."
                sleep 5
            else
                print_error "Build failed after $max_retries attempts"
                print_error "Docker Hub might be experiencing issues. Try:"
                echo "  1. Wait a few minutes and retry"
                echo "  2. Use a mirror: docker pull mirror.gcr.io/library/node:22-alpine"
                echo "  3. Build offline if you have cached images"
                exit 1
            fi
        fi
    done
}

# Deploy to Docker
deploy_docker() {
    print_status "Deploying to Docker..."
    
    if [ "$ENVIRONMENT" == "production" ]; then
        docker-compose -f docker-compose.prod.yml down
        docker-compose -f docker-compose.prod.yml up -d
    else
        docker-compose down
        docker-compose up -d
    fi
    
    print_status "Docker deployment complete"
}

# Deploy to Kubernetes
deploy_kubernetes() {
    print_status "Deploying to Kubernetes..."
    
    # Check if secrets exist
    if ! kubectl get secret aquapump-secrets &> /dev/null; then
        print_error "Kubernetes secrets not found. Please create kubernetes/secrets.yaml first."
        exit 1
    fi
    
    # Apply configurations
    kubectl apply -f kubernetes/configmap.yaml
    kubectl apply -f kubernetes/deployment.yaml
    kubectl apply -f kubernetes/hpa.yaml
    
    if [ "$ENVIRONMENT" == "production" ]; then
        kubectl apply -f kubernetes/ingress.yaml
    fi
    
    # Wait for rollout
    kubectl rollout status deployment/aquapump-app
    
    print_status "Kubernetes deployment complete"
}

# Main deployment logic
main() {
    check_requirements
    
    echo ""
    echo "Select deployment target:"
    echo "1) Docker"
    echo "2) Kubernetes"
    echo "3) Both"
    read -p "Enter choice [1-3]: " choice
    
    case $choice in
        1)
            build_image
            deploy_docker
            ;;
        2)
            build_image
            deploy_kubernetes
            ;;
        3)
            build_image
            deploy_docker
            deploy_kubernetes
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    echo ""
    print_status "Deployment completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "  - Check logs: docker-compose logs -f (Docker) or kubectl logs -f deployment/aquapump-app (K8s)"
    echo "  - Access health check: curl http://localhost:8081/api/health"
    echo "  - Monitor: kubectl get pods (K8s)"
}

main
