#!/bin/bash

set -e

echo "🏠 Starting local development environment..."

if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Install from: https://bun.sh"
    exit 1
fi

if [ ! -f .env ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your Supabase credentials"
fi

echo "📦 Installing dependencies..."
bun install

echo "🗄️ Setting up Supabase (if not already running)..."
if command -v docker &> /dev/null; then
    if ! docker ps | grep -q supabase; then
        echo "Starting Supabase with Docker..."
        npx supabase start || echo "⚠️  Supabase CLI not available, skipping..."
    fi
fi

echo "🚀 Starting development server..."
bun run start-web

echo "✅ Development server started!"
echo "🌐 Access at: http://localhost:8081"
