#!/bin/bash
set -e

echo "========================================"
echo "  Starting AquaPump Locally"
echo "========================================"
echo ""

cd "$(dirname "$0")/../.."

if [ ! -f .env ]; then
    echo "⚠️  .env file not found, copying from .env.example"
    cp .env.example .env
    echo "✓ Created .env - please update with your configuration"
fi

echo "🛑 Stopping any existing containers..."
cd infra
docker compose down

echo ""
echo "🏗️  Building and starting services..."
docker compose up --build -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 5

BACKEND_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' aquapump-backend 2>/dev/null || echo "starting")
FRONTEND_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' aquapump-frontend 2>/dev/null || echo "starting")

echo "Backend:  $BACKEND_HEALTH"
echo "Frontend: $FRONTEND_HEALTH"

echo ""
echo "✅ Services started!"
echo ""
echo "📍 Access points:"
echo "  Frontend: http://localhost:8080"
echo "  Backend:  http://localhost:8081"
echo "  Health:   http://localhost:8081/health"
echo ""
echo "📋 Useful commands:"
echo "  View logs:     docker compose -f infra/docker-compose.yml logs -f"
echo "  Stop:          docker compose -f infra/docker-compose.yml down"
echo "  Restart:       docker compose -f infra/docker-compose.yml restart"
