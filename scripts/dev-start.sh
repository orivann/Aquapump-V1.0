#!/bin/bash
set -e

echo "🚀 Starting AquaPump in Development Mode..."
cd "$(dirname "$0")/.."

echo "📦 Installing dependencies..."
bun install

echo "🔧 Starting backend..."
bun run backend/server.ts &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 3

echo "📱 Starting frontend..."
npx expo start --web

trap "kill $BACKEND_PID" EXIT
