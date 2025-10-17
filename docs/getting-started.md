# Getting Started

Get AquaPump running locally in under 5 minutes.

## Prerequisites

- **Node.js** 20+
- **Bun** package manager
- **Git**

Optional:
- **Docker** (for containerized development)
- **Kubernetes CLI** (kubectl) for production deployment

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd aquapump
bun install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Frontend (public)
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_AI_CHAT_KEY=your-ai-chat-key

# Backend (server-only)
SUPABASE_SERVICE_KEY=your-service-key
```

### 3. Start Development Server

#### Standard

```bash
bun run start-web
```

#### WSL Users

If you're running from WSL and can't access `localhost:8081` from Windows browser:

```bash
./start-web-wsl.sh
```

See [WSL Setup](wsl-setup.md) for details.

### 4. Access Application

Open your browser and navigate to **http://localhost:8081**

## Next Steps

### Explore the Application

- **Theme Toggle** - Switch between dark/light mode (top-right)
- **Language** - Toggle English/Hebrew (top-right)
- **Chatbot** - Click chat bubble (bottom-right)
- **Navigation** - Explore different sections

### Set Up Database

Follow the [Supabase Setup](#supabase-setup) guide to configure your database.

### Start Development

1. Make changes to files in `app/`, `components/`, or `backend/`
2. Changes hot-reload automatically
3. Check console for errors and logs

## Supabase Setup

### 1. Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Note your project URL and keys

### 2. Run Database Migrations

Open Supabase SQL Editor and run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pumps table
CREATE TABLE pumps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'maintenance')),
  pressure NUMERIC NOT NULL CHECK (pressure >= 0),
  flow_rate NUMERIC NOT NULL CHECK (flow_rate >= 0),
  power_consumption NUMERIC NOT NULL CHECK (power_consumption >= 0),
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pump logs table
CREATE TABLE pump_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pump_id UUID REFERENCES pumps(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('start', 'stop', 'maintenance', 'error', 'warning')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_pumps_status ON pumps(status);
CREATE INDEX idx_pumps_location ON pumps(location);
CREATE INDEX idx_pump_logs_pump_id ON pump_logs(pump_id);
CREATE INDEX idx_pump_logs_created_at ON pump_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE pumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE pump_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access to all
CREATE POLICY "Allow read access" ON pumps FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON pump_logs FOR SELECT USING (true);

-- Service role has full access
CREATE POLICY "Service role full access" ON pumps FOR ALL 
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON pump_logs FOR ALL 
  USING (auth.role() = 'service_role');
```

### 3. Update Environment Variables

Add your Supabase credentials to `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### 4. Test Connection

Restart your development server and check the console for any connection errors.

## Development Commands

```bash
# Start web server
bun run start-web

# Start with debug logs
bun run start-web-dev

# Lint code
bun run lint

# Type check
bunx tsc --noEmit
```

## Docker Development

### Start with Docker Compose

```bash
docker-compose up
```

Access at: **http://localhost:8081**

### Rebuild Container

```bash
docker-compose up --build
```

### View Logs

```bash
docker-compose logs -f
```

### Stop Services

```bash
docker-compose down
```

## Troubleshooting

### Can't Access localhost:8081

**Solution for WSL users:**
```bash
./start-web-wsl.sh
```

**For other platforms:**
- Check firewall settings
- Try `0.0.0.0` instead of `localhost`
- Verify port 8081 is not in use

### Port Already in Use

```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
```

### Module Not Found

```bash
# Clean install
rm -rf node_modules bun.lock
bun install
```

### TypeScript Errors

```bash
# Type check
bunx tsc --noEmit

# Check for errors in console
```

### Expo Issues

```bash
# Clear cache
rm -rf .expo node_modules
bun install
bun run start-web
```

## Project Structure

```
aquapump/
├── app/              # Expo Router pages
│   ├── _layout.tsx  # Root layout
│   ├── index.tsx    # Home page
│   └── pumps.tsx    # Pumps page
├── components/       # React components
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── Chatbot.tsx
│   └── ...
├── contexts/         # State management
│   ├── ThemeContext.tsx
│   └── LanguageContext.tsx
├── backend/          # Backend API
│   ├── hono.ts      # Server setup
│   ├── services/    # Business logic
│   └── trpc/        # API routes
├── frontend/         # Frontend utilities
│   └── lib/         # Supabase client
├── constants/        # App constants
│   ├── colors.ts
│   ├── theme.ts
│   └── translations.ts
└── assets/          # Static assets
```

## API Usage

### Using tRPC

```typescript
import { trpc } from '@/lib/trpc';

// In React component
const { data, isLoading } = trpc.pumps.list.useQuery();

// Create pump
const createMutation = trpc.pumps.create.useMutation();
await createMutation.mutateAsync({
  name: 'Pump A',
  model: 'AquaPump Pro',
  status: 'online',
  pressure: 4.5,
  flow_rate: 120,
  power_consumption: 2.3,
  location: 'Building A'
});
```

### Direct Supabase Access

```typescript
import { supabase } from '@/frontend/lib/supabase';

// Fetch data
const { data, error } = await supabase
  .from('pumps')
  .select('*')
  .order('created_at', { ascending: false });

// Subscribe to changes
const subscription = supabase
  .channel('pumps-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'pumps' },
    (payload) => console.log('Change:', payload)
  )
  .subscribe();
```

## Health Checks

```bash
# Application health
curl http://localhost:8081/api/health

# Readiness check
curl http://localhost:8081/api/ready

# API info
curl http://localhost:8081/api
```

## What's Next?

- [Development Guide](development.md) - Deep dive into development
- [Deployment Guide](deployment.md) - Deploy to production
- [Architecture](architecture.md) - Understand the system
- [API Reference](api.md) - Explore available APIs
- [Contributing](contributing.md) - How to contribute
