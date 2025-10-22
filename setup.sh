#!/bin/bash
set -e

echo "=========================================="
echo "  AquaPump Initial Setup"
echo "=========================================="
echo ""

# Make all scripts executable
echo "📝 Making scripts executable..."
chmod +x infra/scripts/*.sh
echo "✅ Scripts are now executable"

echo ""
echo "📋 Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
else
    echo "✅ Docker: $(docker --version | cut -d' ' -f3)"
fi

# Check Docker Compose
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose not found"
    exit 1
else
    echo "✅ Docker Compose: $(docker compose version --short)"
fi

# Check Bun (optional)
if command -v bun &> /dev/null; then
    echo "✅ Bun: $(bun --version)"
else
    echo "⚠️  Bun not found (optional for local dev)"
fi

echo ""
echo "🔧 Setting up environment..."

# Setup .env if doesn't exist
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env from .env.example"
        echo "⚠️  Please edit .env with your configuration:"
        echo "   - EXPO_PUBLIC_SUPABASE_URL"
        echo "   - EXPO_PUBLIC_SUPABASE_ANON_KEY"
        echo "   - SUPABASE_SERVICE_KEY"
    else
        echo "⚠️  .env.example not found, skipping .env creation"
    fi
else
    echo "✅ .env already exists"
fi

# Setup .env.production if doesn't exist
if [ ! -f .env.production ]; then
    if [ -f .env.production.example ]; then
        echo "⚠️  .env.production not found"
        echo "   For production deployment, run:"
        echo "   cp .env.production.example .env.production"
        echo "   nano .env.production"
    fi
else
    echo "✅ .env.production exists"
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📚 Quick Start Commands:"
echo ""
echo "  Development:"
echo "    ./infra/scripts/deploy-local.sh"
echo "    → Access: http://localhost:8080"
echo ""
echo "  Production:"
echo "    ./infra/scripts/verify-production.sh"
echo "    ./infra/scripts/build-prod.sh"
echo "    ./infra/scripts/push-prod.sh"
echo ""
echo "📖 Documentation:"
echo "  - QUICK_REFERENCE.md    (command reference)"
echo "  - DEPLOYMENT.md         (deployment guide)"
echo "  - PRODUCTION_SETUP.md   (production details)"
echo ""
echo "🆘 Need help?"
echo "   cat QUICK_REFERENCE.md"
echo ""
