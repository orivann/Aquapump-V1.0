# AquaPump Connection Guide

This guide explains how to connect all components of the AquaPump system: Frontend → Backend → Supabase.

---

## 🔗 Connection Architecture

```
┌────────────────┐         ┌────────────────┐         ┌────────────────┐
│    Frontend    │  HTTP   │    Backend     │  HTTP   │    Supabase    │
│  React Native  │────────▶│  Hono + tRPC   │────────▶│   PostgreSQL   │
│     (Expo)     │  tRPC   │    Node.js     │   SDK   │                │
└────────────────┘         └────────────────┘         └────────────────┘
     Port: 8081              Port: 8081                Cloud/Self-hosted
```

---

## 📝 Environment Variables

### Frontend Variables (EXPO_PUBLIC_*)

These are accessible in **client-side code** and should be safe to expose:

```env
# Backend API endpoint
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:8081

# Supabase public keys (safe to expose)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: AI toolkit
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com
```

### Backend Variables (Server-side only)

These are **NEVER exposed** to client-side code:

```env
# Server configuration
NODE_ENV=development
PORT=8081
CORS_ORIGIN=http://localhost:8081,http://localhost:19006

# Supabase service key (KEEP SECRET!)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...service_role...

# Logging
LOG_LEVEL=info
```

---

## 🔑 Getting Supabase Credentials

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in project details:
   - Name: `aquapump`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your location
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

### Step 2: Get API Keys

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy the following:

   **For Frontend (.env - EXPO_PUBLIC_* variables)**:
   - **URL**: Copy from "Project URL" → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public**: Copy from "Project API keys" → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

   **For Backend (.env - server variables)**:
   - **URL**: Same as above → `SUPABASE_URL`
   - **service_role**: Click "👁️ Reveal" next to "service_role" → `SUPABASE_SERVICE_KEY`

> **⚠️ CRITICAL**: The `service_role` key has **admin privileges**. NEVER expose it in frontend code or commit it to Git!

### Step 3: Configure .env File

Your `.env` should look like this:

```env
# Frontend
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:8081
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzc4MTIwMCwiZXhwIjoxOTM5MzU3MjAwfQ.xyz123

# Backend
NODE_ENV=development
PORT=8081
CORS_ORIGIN=http://localhost:8081,http://localhost:19006
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjIzNzgxMjAwLCJleHAiOjE5MzkzNTcyMDB9.abc456
LOG_LEVEL=info
```

---

## 🗄️ Database Setup

### Step 1: Create Tables

1. Go to Supabase Dashboard
2. Click **SQL Editor** in the sidebar
3. Click **"New query"**
4. Paste the following SQL:

```sql
-- Create pumps table
CREATE TABLE IF NOT EXISTS pumps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'maintenance')),
  pressure NUMERIC NOT NULL DEFAULT 0,
  flow_rate NUMERIC NOT NULL DEFAULT 0,
  power_consumption NUMERIC NOT NULL DEFAULT 0,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pump_logs table
CREATE TABLE IF NOT EXISTS pump_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pump_id UUID NOT NULL REFERENCES pumps(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('start', 'stop', 'maintenance', 'error', 'warning')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pump_logs_pump_id ON pump_logs(pump_id);
CREATE INDEX IF NOT EXISTS idx_pump_logs_created_at ON pump_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pumps_status ON pumps(status);

-- Insert sample data
INSERT INTO pumps (name, model, status, pressure, flow_rate, power_consumption, location) 
VALUES
  ('Pump #1', 'AP-3000', 'online', 120.5, 500.0, 5.5, 'Building A'),
  ('Pump #2', 'AP-3000', 'online', 118.2, 485.0, 5.3, 'Building B'),
  ('Pump #3', 'AP-5000', 'maintenance', 0, 0, 0, 'Building C'),
  ('Pump #4', 'AP-3000', 'offline', 0, 0, 0, 'Building D')
ON CONFLICT (id) DO NOTHING;

-- Insert sample logs
INSERT INTO pump_logs (pump_id, event_type, message, metadata)
SELECT 
  id,
  'start',
  'Pump started successfully',
  '{"user": "system", "source": "auto"}'::jsonb
FROM pumps
WHERE status = 'online'
ON CONFLICT DO NOTHING;
```

5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. Verify tables created: Go to **Table Editor** and check for `pumps` and `pump_logs` tables

### Step 2: Enable Row Level Security (Optional for Production)

For development, you can skip this. For production:

```sql
-- Enable RLS
ALTER TABLE pumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE pump_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to bypass RLS
CREATE POLICY "Service role bypass" ON pumps FOR ALL USING (true);
CREATE POLICY "Service role bypass" ON pump_logs FOR ALL USING (true);
```

---

## 🔌 Frontend → Backend Connection

### Configuration

The frontend connects to backend via tRPC. Configuration is in `frontend/lib/trpc.ts`:

```typescript
import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }
  throw new Error("No base url found");
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,  // Backend endpoint
      transformer: superjson,
    }),
  ],
});
```

### Testing Connection

1. Start the backend:

```bash
npm start
```

2. Test the connection:

```bash
# Check health endpoint
curl http://localhost:8081/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-10-21T12:00:00.000Z",
  "uptime": 123.456
}
```

3. Test tRPC endpoint:

```bash
curl http://localhost:8081/api/trpc/pumps.list

# Expected: List of pumps from Supabase
```

---

## 🔗 Backend → Supabase Connection

### Configuration

Backend connects to Supabase via `backend/services/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Example: Get all pumps
export async function getPumps() {
  const { data, error } = await supabaseAdmin
    .from('pumps')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

### Testing Connection

Add this test to your backend:

```typescript
// Test in backend/hono.ts
app.get("/api/test-db", async (c) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('pumps')
      .select('count');
    
    if (error) throw error;
    
    return c.json({ 
      status: "connected",
      message: "Supabase connection successful",
      pumpCount: data.length
    });
  } catch (error) {
    return c.json({ 
      status: "error",
      message: error.message 
    }, 500);
  }
});
```

Test it:

```bash
curl http://localhost:8081/api/test-db
```

---

## 🌐 Network Configuration

### Local Development (Web)

```env
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:8081
```

### Local Development (Mobile Device)

Find your computer's IP address:

**Windows**:
```bash
ipconfig
# Look for "IPv4 Address" under your WiFi adapter
```

**Mac/Linux**:
```bash
ifconfig | grep "inet "
# Or use: hostname -I
```

Then update `.env`:

```env
EXPO_PUBLIC_RORK_API_BASE_URL=http://192.168.1.100:8081
```

> **Note**: Your mobile device must be on the **same WiFi network** as your development machine!

### Production

```env
EXPO_PUBLIC_RORK_API_BASE_URL=https://api.aquapump.com
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Use `EXPO_PUBLIC_*` prefix only for safe-to-expose variables
- Keep `SUPABASE_SERVICE_KEY` in backend only
- Use `.gitignore` to exclude `.env` files
- Use environment-specific configs (`.env.development`, `.env.production`)
- Enable Row Level Security (RLS) in Supabase for production
- Use HTTPS in production

### ❌ DON'T:
- Never commit `.env` files to Git
- Never use `SUPABASE_SERVICE_KEY` in frontend code
- Never expose sensitive keys in client-side code
- Don't hardcode credentials in source files

---

## 🧪 Testing the Full Connection Flow

### 1. Check Backend Health

```bash
curl http://localhost:8081/api/health
```

### 2. Test Supabase Connection

```bash
curl http://localhost:8081/api/trpc/pumps.list
```

### 3. Test Frontend

Open browser at http://localhost:8081 and check:
- Home page loads
- Theme toggle works
- Language toggle works
- No console errors

### 4. Test Mobile App

1. Start Expo: `npm start`
2. Scan QR code with Expo Go
3. App should load without errors
4. Check that data from Supabase is displayed

---

## 🐛 Common Connection Issues

### Issue: "Failed to fetch" or "Network request failed"

**Cause**: Backend not running or wrong URL

**Solution**:
```bash
# Verify backend is running
curl http://localhost:8081/api/health

# Check .env has correct URL
cat .env | grep EXPO_PUBLIC_RORK_API_BASE_URL
```

### Issue: "Supabase: Invalid JWT" or "401 Unauthorized"

**Cause**: Wrong API keys

**Solution**:
1. Go to Supabase Dashboard → Settings → API
2. Copy keys again carefully
3. Make sure no extra spaces or newlines
4. Restart app after changing .env

### Issue: Mobile app can't connect to backend

**Cause**: Using `localhost` instead of IP address

**Solution**:
```env
# Change from this:
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:8081

# To your computer's IP:
EXPO_PUBLIC_RORK_API_BASE_URL=http://192.168.1.100:8081
```

### Issue: CORS errors in browser

**Cause**: Backend CORS not configured

**Solution**: Check `backend/hono.ts`:
```typescript
app.use("*", cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));
```

And update `.env`:
```env
CORS_ORIGIN=http://localhost:8081,http://localhost:19006
```

---

## 📚 Related Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Initial setup instructions
- [Architecture](./ARCHITECTURE.md) - System architecture overview
- [API Documentation](./api.md) - API endpoints reference
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions

---

**Need Help?** Contact support@aquatech.example.com
