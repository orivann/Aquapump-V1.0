#!/bin/bash

# WSL Web Startup Script for AquaPump
# This script properly binds Expo to 0.0.0.0 so it's accessible from Windows browser

echo "🚀 Starting AquaPump Web Server for WSL..."
echo "📍 Server will be accessible at: http://localhost:8081"
echo ""

# Set environment variables for WSL compatibility
export EXPO_DEV_SERVER_HOST=0.0.0.0
export PORT=8081

# Start the Expo web server
bun run start-web

# Note: If you still can't access from Windows browser:
# 1. Check Windows Firewall settings
# 2. Try accessing via WSL IP: \\wsl$\Ubuntu\home\<user>\<project>
# 3. Or get WSL IP: ip addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'
