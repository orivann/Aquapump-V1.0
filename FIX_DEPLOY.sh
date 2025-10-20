#!/bin/bash

# =============================================================================
# IMMEDIATE FIX FOR DOCKER HUB 503 ERROR
# =============================================================================

echo "🚨 Docker Hub 503 Error Fix"
echo ""

# Solution 1: Use Google Mirror
echo "📥 Pulling from Google Container Registry mirror..."
if docker pull mirror.gcr.io/library/node:22-alpine; then
    docker tag mirror.gcr.io/library/node:22-alpine node:22-alpine
    echo "✅ Base image ready!"
else
    echo "⚠️  Mirror failed, trying direct pull..."
    sleep 5
    docker pull node:22-alpine || echo "❌ Pull failed"
fi

echo ""
echo "🔨 Building AquaPump..."
if docker build -t aquapump:latest .; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed - check logs above"
    exit 1
fi

echo ""
echo "🚀 Deploying..."
cd /home/user/rork-app
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Waiting for app to start..."
sleep 10

for i in {1..15}; do
    if curl -sf http://localhost:8081/api/health >/dev/null 2>&1; then
        echo ""
        echo "✨ SUCCESS! App is running!"
        echo ""
        echo "🌐 Access your app:"
        echo "   http://localhost:8081"
        echo ""
        exit 0
    fi
    echo -n "."
    sleep 2
done

echo ""
echo "⚠️  Health check timeout - checking logs:"
docker logs aquapump-app-prod --tail=20
