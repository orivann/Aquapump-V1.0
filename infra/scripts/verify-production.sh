#!/bin/bash
set -e

echo "=========================================="
echo "  AquaPump Production Verification"
echo "=========================================="
echo ""

cd "$(dirname "$0")/../.."

ERRORS=0

echo "1️⃣  Checking Docker..."
if ! docker --version > /dev/null 2>&1; then
    echo "  ❌ Docker not found"
    ERRORS=$((ERRORS + 1))
else
    echo "  ✅ Docker $(docker --version | cut -d' ' -f3)"
fi

echo ""
echo "2️⃣  Checking configuration files..."
if [ ! -f .env.production ]; then
    echo "  ❌ .env.production missing"
    ERRORS=$((ERRORS + 1))
else
    echo "  ✅ .env.production exists"
    
    source .env.production
    
    if [ -z "$EXPO_PUBLIC_RORK_API_BASE_URL" ]; then
        echo "  ⚠️  EXPO_PUBLIC_RORK_API_BASE_URL not set"
    else
        echo "  ✅ API URL: $EXPO_PUBLIC_RORK_API_BASE_URL"
    fi
    
    if [ -z "$SUPABASE_SERVICE_KEY" ]; then
        echo "  ⚠️  SUPABASE_SERVICE_KEY not set"
    else
        echo "  ✅ Supabase configured"
    fi
fi

echo ""
echo "3️⃣  Checking Docker images..."
if docker image inspect orivann/aquapump-backend:prod > /dev/null 2>&1; then
    echo "  ✅ Backend image exists"
else
    echo "  ⚠️  Backend image not found (run build-prod.sh)"
fi

if docker image inspect orivann/aquapump-frontend:prod > /dev/null 2>&1; then
    echo "  ✅ Frontend image exists"
else
    echo "  ⚠️  Frontend image not found (run build-prod.sh)"
fi

echo ""
echo "4️⃣  Checking Docker Compose files..."
if [ -f infra/docker-compose.prod.yml ]; then
    echo "  ✅ Production compose file exists"
else
    echo "  ❌ docker-compose.prod.yml missing"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "5️⃣  Checking Nginx configuration..."
if [ -f infra/nginx.conf ]; then
    echo "  ✅ Nginx config exists"
else
    echo "  ❌ nginx.conf missing"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "6️⃣  Checking Helm chart..."
if [ -f infra/helm/aquapump/Chart.yaml ]; then
    echo "  ✅ Helm chart exists"
    CHART_VERSION=$(grep '^version:' infra/helm/aquapump/Chart.yaml | awk '{print $2}')
    echo "  ✅ Chart version: $CHART_VERSION"
else
    echo "  ⚠️  Helm chart missing (K8s deployment unavailable)"
fi

echo ""
echo "7️⃣  Checking CI/CD pipeline..."
if [ -f .github/workflows/deploy-production.yml ]; then
    echo "  ✅ GitHub Actions workflow exists"
else
    echo "  ⚠️  CI/CD workflow missing"
fi

echo ""
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ All checks passed!"
    echo ""
    echo "🚀 Next steps:"
    echo "  1. Build images:  ./infra/scripts/build-prod.sh"
    echo "  2. Test locally:  cd infra && docker compose -f docker-compose.prod.yml up"
    echo "  3. Push images:   ./infra/scripts/push-prod.sh"
    echo "  4. Deploy:        See PRODUCTION_SETUP.md"
else
    echo "❌ Found $ERRORS critical error(s)"
    echo "Please fix the issues above before deploying"
    exit 1
fi
echo "=========================================="
