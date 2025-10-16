# Quick Start Guide

Get AquaPump running locally in under 5 minutes.

## Prerequisites

- **Node.js** 20+ and **Bun** 1.1+
- **Docker** (optional, for Supabase local)
- **Git**

## 1. Clone & Install

\`\`\`bash
git clone https://github.com/your-org/aquapump.git
cd aquapump
bun install
\`\`\`

## 2. Configure Environment

\`\`\`bash
cp .env.example .env
\`\`\`

Update `.env` with your credentials:

\`\`\`env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_AI_CHAT_KEY=your-ai-chat-key
SUPABASE_SERVICE_KEY=your-service-key
\`\`\`

## 3. Start Development Server

\`\`\`bash
bun run start-web
\`\`\`

Access at: **http://localhost:8081**

## 4. Access Features

### Frontend
- **Home**: http://localhost:8081
- **Technology**: Scroll or navigate to technology section
- **Products**: View pump catalog
- **Chatbot**: Click the chat bubble (bottom-right)

### Backend API
- **Health Check**: http://localhost:8081/api/health
- **tRPC Endpoint**: http://localhost:8081/api/trpc

## Next Steps

- [Development Guide](./DEVELOPMENT.md) - Deep dive into development
- [Architecture](./ARCHITECTURE.md) - Understand the system
- [API Reference](./API.md) - Explore available APIs

## Troubleshooting

### Port Already in Use
\`\`\`bash
lsof -ti:8081 | xargs kill -9
bun run start-web
\`\`\`

### Missing Dependencies
\`\`\`bash
rm -rf node_modules bun.lock
bun install
\`\`\`

### Expo Issues
\`\`\`bash
rm -rf .expo node_modules
bun install
bun run start-web
\`\`\`
