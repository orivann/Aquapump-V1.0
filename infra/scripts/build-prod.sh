#!/bin/bash
set -e

echo "========================================"
echo "  Building Production Docker Images"
echo "========================================"
echo ""

cd "$(dirname "$0")/../.."

if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found"
    echo "Please create .env.production with your configuration"
    exit 1
fi

source .env.production

echo "📦 Building backend image..."
docker build \
    --platform linux/amd64,linux/arm64 \
    -t orivann/aquapump-backend:prod \
    -t orivann/aquapump-backend:latest \
    -f infra/Dockerfile.backend \
    .

echo ""
echo "🎨 Building frontend image..."
docker build \
    --platform linux/amd64,linux/arm64 \
    --build-arg EXPO_PUBLIC_API_URL="${EXPO_PUBLIC_RORK_API_BASE_URL}" \
    --build-arg EXPO_PUBLIC_SUPABASE_URL="${EXPO_PUBLIC_SUPABASE_URL}" \
    --build-arg EXPO_PUBLIC_SUPABASE_ANON_KEY="${EXPO_PUBLIC_SUPABASE_ANON_KEY}" \
    --build-arg EXPO_PUBLIC_TOOLKIT_URL="${EXPO_PUBLIC_TOOLKIT_URL}" \
    -t orivann/aquapump-frontend:prod \
    -t orivann/aquapump-frontend:latest \
    -f infra/Dockerfile.frontend \
    .

echo ""
echo "✅ Build complete!"
echo ""
echo "Images built:"
echo "  - orivann/aquapump-backend:prod"
echo "  - orivann/aquapump-frontend:prod"
echo ""
echo "Next steps:"
echo "  1. Push images: ./infra/scripts/push-prod.sh"
echo "  2. Deploy: ./infra/scripts/deploy-prod.sh"
