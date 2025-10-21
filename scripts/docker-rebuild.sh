#!/bin/bash
set -e

echo "🧹 Cleaning up old containers and images..."
cd "$(dirname "$0")/.."
docker compose -f infra/docker-compose.yml down -v 2>/dev/null || true
docker rmi aquapump-frontend:latest aquapump-backend:latest 2>/dev/null || true

echo "🏗️  Building fresh containers..."
docker compose -f infra/docker-compose.yml build --no-cache

echo "🚀 Starting AquaPump..."
docker compose -f infra/docker-compose.yml up -d

echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "✅ AquaPump is starting!"
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend:  http://localhost:8081/health"
echo ""
echo "📋 View logs with: docker compose -f infra/docker-compose.yml logs -f"
echo "🛑 Stop with: docker compose -f infra/docker-compose.yml down"
