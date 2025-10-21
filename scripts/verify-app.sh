#!/bin/bash

echo "🔍 AquaPump App Verification"
echo "=============================="
echo ""

# Check if containers are running
echo "1. Checking Docker containers..."
if docker compose -f infra/docker-compose.yml ps | grep -q "Up"; then
    echo "   ✅ Containers are running"
else
    echo "   ❌ Containers are not running"
    echo "   Run: ./scripts/docker-rebuild.sh"
    exit 1
fi

# Check frontend
echo ""
echo "2. Checking frontend (port 8080)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200"; then
    echo "   ✅ Frontend is responding"
else
    echo "   ❌ Frontend not accessible"
    echo "   Check logs: docker compose -f infra/docker-compose.yml logs frontend"
fi

# Check backend
echo ""
echo "3. Checking backend (port 8081)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/health | grep -q "200"; then
    echo "   ✅ Backend is responding"
else
    echo "   ❌ Backend not accessible"
    echo "   Check logs: docker compose -f infra/docker-compose.yml logs backend"
fi

# Check if it's the actual app (not Expo dev page)
echo ""
echo "4. Checking if it's your actual app..."
CONTENT=$(curl -s http://localhost:8080 2>/dev/null || echo "")
if echo "$CONTENT" | grep -q "AquaPump\|AquaTech"; then
    echo "   ✅ Your AquaPump app is loaded!"
else
    echo "   ⚠️  Cannot verify app content"
    echo "   Open http://localhost:8080 in your browser"
fi

echo ""
echo "=============================="
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend:  http://localhost:8081/health"
echo ""
echo "View logs: docker compose -f infra/docker-compose.yml logs -f"
echo "Stop app:  docker compose -f infra/docker-compose.yml down"
