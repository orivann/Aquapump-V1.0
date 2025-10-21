#!/bin/bash
# Restore your original Aquapump environment configuration

cd ~/Aqua_V1.1/Aquapump-V1.0

# Restore .env.production with your original values
cat > .env.production << 'EOF'
# Production Environment Variables
EXPO_PUBLIC_API_URL=https://api.aquapump.com/api
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com
EXPO_PUBLIC_AI_CHAT_KEY=sk-abcdijkl1234uvwxabcdijkl1234uvwxabcdijkl
NODE_ENV=production
PORT=8081
CORS_ORIGIN=https://aquapump.com,https://www.aquapump.com
EOF

# Restore .env with your original values
cat > .env << 'EOF'
# Expo Public Variables (accessible in client-side code)
EXPO_PUBLIC_API_URL=http://localhost:8081/api
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com
EXPO_PUBLIC_AI_CHAT_KEY=sk-abcdijkl1234uvwxabcdijkl1234uvwxabcdijkl

# Backend Variables (server-side only)
NODE_ENV=development
PORT=8081
CORS_ORIGIN=*

# WSL Configuration
# If you're running from WSL and need to access from Windows browser,
# use 0.0.0.0 as host binding (configured in package.json)
EOF

# Set proper permissions
chmod 600 .env .env.production

echo "✓ Environment files restored!"
echo ""
echo "Current configuration:"
echo "====================="
echo ""
echo ".env.production:"
cat .env.production
echo ""
echo "-------------------"
echo ""
echo ".env:"
cat .env

