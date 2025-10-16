# Supabase Integration

Complete guide to Supabase setup and usage in AquaPump.

## Overview

Supabase provides:
- **PostgreSQL Database**: Pump data and logs
- **Authentication**: User management (future)
- **Real-time**: Live updates via WebSocket
- **Storage**: File uploads (future)
- **Edge Functions**: Serverless (future)

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and keys

### 2. Configure Environment

Add to \`.env\`:

\`\`\`env
# Frontend (public)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend (server-only)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
\`\`\`

### 3. Create Database Schema

Run in Supabase SQL Editor:

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pumps table
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

-- Pump logs table
CREATE TABLE pump_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pump_id UUID REFERENCES pumps(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('start', 'stop', 'maintenance', 'error', 'warning')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pumps_status ON pumps(status);
CREATE INDEX idx_pumps_location ON pumps(location);
CREATE INDEX idx_pump_logs_pump_id ON pump_logs(pump_id);
CREATE INDEX idx_pump_logs_event_type ON pump_logs(event_type);
CREATE INDEX idx_pump_logs_created_at ON pump_logs(created_at DESC);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pumps_updated_at
BEFORE UPDATE ON pumps
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE pumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE pump_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access to all (adjust for auth later)
CREATE POLICY "Allow read access to all" ON pumps FOR SELECT USING (true);
CREATE POLICY "Allow read access to all" ON pump_logs FOR SELECT USING (true);

-- Service role has full access (backend)
CREATE POLICY "Service role has full access" ON pumps FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access" ON pump_logs FOR ALL USING (auth.role() = 'service_role');
\`\`\`

### 4. Seed Data (Optional)

\`\`\`sql
INSERT INTO pumps (name, model, status, pressure, flow_rate, power_consumption, location) VALUES
  ('Pump A1', 'AquaPump Pro 5000', 'online', 4.5, 120.5, 2.3, 'Building A - Floor 1'),
  ('Pump B2', 'AquaPump Elite 7000', 'online', 5.2, 150.0, 3.1, 'Building B - Floor 2'),
  ('Pump C3', 'AquaPump Standard 3000', 'maintenance', 0, 0, 0, 'Building C - Basement');

INSERT INTO pump_logs (pump_id, event_type, message, metadata) 
SELECT id, 'start', 'Pump started successfully', '{"user": "system"}'::jsonb 
FROM pumps WHERE name = 'Pump A1';
\`\`\`

## Usage

### Frontend (Client)

\`\`\`typescript
import { supabase } from '@/frontend/lib/supabase';

// Fetch pumps
const { data, error } = await supabase
  .from('pumps')
  .select('*')
  .order('created_at', { ascending: false });

// Subscribe to changes
const subscription = supabase
  .channel('pumps-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'pumps' },
    (payload) => {
      console.log('Pump changed:', payload);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
\`\`\`

### Backend (Server)

\`\`\`typescript
import { supabaseAdmin } from '@/backend/services/supabase';

// Create pump
const { data, error } = await supabaseAdmin
  .from('pumps')
  .insert({
    name: 'New Pump',
    model: 'AquaPump Pro 5000',
    status: 'online',
    pressure: 4.5,
    flow_rate: 120,
    power_consumption: 2.3,
    location: 'Building D'
  })
  .select()
  .single();
\`\`\`

### tRPC Procedures

Already integrated! Use via tRPC:

\`\`\`typescript
import { trpc } from '@/lib/trpc';

// List pumps
const { data } = trpc.pumps.list.useQuery();

// Get single pump
const { data } = trpc.pumps.get.useQuery({ id: 'pump-uuid' });

// Create pump
const createMutation = trpc.pumps.create.useMutation();
await createMutation.mutateAsync({
  name: 'New Pump',
  model: 'AquaPump Pro 5000',
  status: 'online',
  pressure: 4.5,
  flow_rate: 120,
  power_consumption: 2.3,
  location: 'Building D'
});

// Update pump
const updateMutation = trpc.pumps.update.useMutation();
await updateMutation.mutateAsync({
  id: 'pump-uuid',
  status: 'maintenance'
});

// Delete pump
const deleteMutation = trpc.pumps.delete.useMutation();
await deleteMutation.mutateAsync({ id: 'pump-uuid' });

// Get pump logs
const { data } = trpc.pumps.logs.list.useQuery({
  pumpId: 'pump-uuid',
  limit: 50
});

// Create log entry
const logMutation = trpc.pumps.logs.create.useMutation();
await logMutation.mutateAsync({
  pump_id: 'pump-uuid',
  event_type: 'maintenance',
  message: 'Scheduled maintenance completed',
  metadata: { technician: 'John Doe' }
});
\`\`\`

## Real-time Subscriptions

### Subscribe to Pump Changes

\`\`\`typescript
import { supabase } from '@/frontend/lib/supabase';
import { useEffect } from 'react';

function PumpsMonitor() {
  useEffect(() => {
    const subscription = supabase
      .channel('realtime-pumps')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'pumps' 
        },
        (payload) => {
          console.log('Pump updated:', payload.new);
          // Update UI with new data
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);
}
\`\`\`

## Security

### Row Level Security (RLS)

Already enabled! Adjust policies for authentication:

\`\`\`sql
-- Authenticated users can read
CREATE POLICY "Authenticated users can read pumps" 
ON pumps FOR SELECT 
TO authenticated 
USING (true);

-- Only admins can write
CREATE POLICY "Only admins can write pumps" 
ON pumps FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');
\`\`\`

### API Keys

- **Anon Key**: Safe for frontend, respects RLS
- **Service Key**: Full access, backend only

## Performance

### Indexes

Already created for common queries. Add more if needed:

\`\`\`sql
CREATE INDEX idx_pumps_name ON pumps USING gin(to_tsvector('english', name));
\`\`\`

### Connection Pooling

Supabase handles automatically. For custom pooling:

\`\`\`typescript
const supabase = createClient(url, key, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    headers: { 'x-my-custom-header': 'value' },
  },
});
\`\`\`

## Backup & Recovery

### Automated Backups

Supabase Pro/Team plans include daily backups.

### Manual Backup

\`\`\`bash
pg_dump -h db.your-project.supabase.co \\
  -U postgres \\
  -d postgres \\
  -f backup.sql
\`\`\`

### Restore

\`\`\`bash
psql -h db.your-project.supabase.co \\
  -U postgres \\
  -d postgres \\
  -f backup.sql
\`\`\`

## Troubleshooting

### Connection Issues

\`\`\`typescript
// Test connection
const { data, error } = await supabase
  .from('pumps')
  .select('count', { count: 'exact', head: true });

console.log('Connection OK:', !error);
\`\`\`

### RLS Debugging

\`\`\`sql
-- Disable RLS temporarily (dev only!)
ALTER TABLE pumps DISABLE ROW LEVEL SECURITY;

-- Re-enable
ALTER TABLE pumps ENABLE ROW LEVEL SECURITY;
\`\`\`

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
