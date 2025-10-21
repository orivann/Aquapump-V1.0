# AquaPump V1.0 - Complete Setup Guide

**Smart Water Pump Management System** - This guide will help you set up and run the AquaPump application from scratch.

---

## 🏗️ Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   Frontend  │────▶│   Backend    │────▶│   Supabase    │
│ React Native│     │  Hono + tRPC │     │  PostgreSQL   │
│    (Expo)   │     │    Node.js   │     │               │
└─────────────┘     └──────────────┘     └───────────────┘
```

### Tech Stack

- **Frontend**: React Native + Expo 53, TypeScript, TanStack Query
- **Backend**: Node.js + Hono, tRPC v11, Supabase
- **DevOps**: Docker, Kubernetes, ArgoCD, Helm
- **State Management**: React Context + TanStack Query
- **Styling**: React Native StyleSheet with theme system

---

## 📁 Project Structure

```
aquapump-v1.0/
├── frontend/           # React Native Expo app
│   ├── app/           # Expo Router pages (index.tsx, pumps.tsx)
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React contexts (Theme, Language)
│   ├── constants/     # Theme, colors, translations
│   └── lib/           # Utilities (tRPC client, Supabase)
├── backend/           # Node.js API server
│   ├── trpc/          # tRPC routes and procedures
│   │   └── routes/    # API endpoints (pumps/*)
│   ├── services/      # Business logic (Supabase client)
│   └── hono.ts        # Main server entry
├── infra/             # Infrastructure & deployment
│   ├── Dockerfile     # Production container image
│   ├── docker-compose.yml  # Local development
│   ├── helm/          # Kubernetes Helm charts
│   └── kubernetes/    # Raw K8s manifests
└── docs/              # Documentation
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (or Bun 1.0+)
- **Expo CLI**: `npm install -g expo-cli` (or use `npx expo`)
- **Docker** (optional, for containerized deployment)
- **Supabase** account (or self-hosted Supabase)

### 1. Install Dependencies

```bash
# Using npm
npm install

# Or using bun (recommended for speed)
bun install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the following **required** variables:

```env
# Frontend API endpoint
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:8081

# Supabase (Frontend - Public Keys)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (Backend - Service Key)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Backend Configuration
NODE_ENV=development
PORT=8081
CORS_ORIGIN=http://localhost:8081,http://localhost:19006
```

> **⚠️ Security Note**: NEVER commit your `.env` file or expose `SUPABASE_SERVICE_KEY` in client-side code!

### 3. Setup Supabase Database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the following SQL in the Supabase SQL Editor:

```sql
-- Create pumps table
CREATE TABLE pumps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT CHECK (status IN ('online', 'offline', 'maintenance')),
  pressure NUMERIC NOT NULL,
  flow_rate NUMERIC NOT NULL,
  power_consumption NUMERIC NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pump_logs table
CREATE TABLE pump_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pump_id UUID NOT NULL REFERENCES pumps(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('start', 'stop', 'maintenance', 'error', 'warning')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_pump_logs_pump_id ON pump_logs(pump_id);
CREATE INDEX idx_pump_logs_created_at ON pump_logs(created_at DESC);

-- Insert sample data
INSERT INTO pumps (name, model, status, pressure, flow_rate, power_consumption, location) VALUES
  ('Pump #1', 'AP-3000', 'online', 120.5, 500.0, 5.5, 'Building A'),
  ('Pump #2', 'AP-3000', 'online', 118.2, 485.0, 5.3, 'Building B'),
  ('Pump #3', 'AP-5000', 'maintenance', 0, 0, 0, 'Building C');
```

3. Copy your Supabase URL and keys from **Project Settings > API** to your `.env` file.

### 4. Run the Development Server

```bash
# Start Expo development server
npm start
# or
bun start
```

This will start:
- **Web**: http://localhost:8081 (auto-opens in browser)
- **Mobile**: Scan QR code with Expo Go app

---

## 🖥️ Development

### Running on Different Platforms

```bash
# Web only
npm run start-web

# Mobile (iOS/Android via Expo Go)
npm start
# Then press 'i' for iOS simulator or 'a' for Android emulator
```

### Project Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server (all platforms) |
| `npm run start-web` | Start web-only dev server |
| `npm run lint` | Run ESLint |

### Mobile Development Notes

When developing for mobile devices:

1. **Update API URL**: In `.env`, change `EXPO_PUBLIC_RORK_API_BASE_URL` to your computer's IP:

```env
# Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
EXPO_PUBLIC_RORK_API_BASE_URL=http://192.168.1.100:8081
```

2. **Install Expo Go**: Download from App Store (iOS) or Play Store (Android)

3. **Scan QR Code**: Use Expo Go to scan the QR code from the terminal

---

## 🐳 Docker Deployment

### Local Docker Compose

1. Build and run:

```bash
cd infra
docker-compose up -d --build
```

2. Access the app at http://localhost:8081

3. View logs:

```bash
docker-compose logs -f app
```

4. Stop services:

```bash
docker-compose down
```

### Production Docker

For production deployment:

```bash
# Build production image
docker build -f infra/Dockerfile -t aquapump:latest .

# Run production container
docker run -d \
  -p 8081:8081 \
  --env-file .env.production \
  --name aquapump-app \
  aquapump:latest
```

---

## ☸️ Kubernetes Deployment

See [KUBERNETES.md](./KUBERNETES.md) for detailed Kubernetes deployment guide.

Quick deploy with Helm:

```bash
cd infra/helm
helm install aquapump ./aquapump -n aquapump --create-namespace
```

---

## 🧪 Testing

### API Health Check

```bash
curl http://localhost:8081/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-21T12:00:00.000Z",
  "uptime": 123.456
}
```

### Test tRPC Endpoints

```bash
# List pumps
curl http://localhost:8081/api/trpc/pumps.list

# Get pump by ID
curl http://localhost:8081/api/trpc/pumps.get?input={"id":"pump-id-here"}
```

---

## 📝 API Usage

### Frontend tRPC Client

```typescript
import { trpc } from '@frontend/lib/trpc';

// List all pumps
function PumpList() {
  const { data, isLoading } = trpc.pumps.list.useQuery();
  
  if (isLoading) return <Text>Loading...</Text>;
  
  return (
    <View>
      {data?.map(pump => (
        <Text key={pump.id}>{pump.name}</Text>
      ))}
    </View>
  );
}

// Get single pump
function PumpDetails({ id }) {
  const { data } = trpc.pumps.get.useQuery({ id });
  return <Text>{data?.name}</Text>;
}

// Create pump
function CreatePump() {
  const createMutation = trpc.pumps.create.useMutation();
  
  const handleCreate = async () => {
    await createMutation.mutateAsync({
      name: 'Pump #4',
      model: 'AP-3000',
      status: 'online',
      pressure: 120,
      flow_rate: 500,
      power_consumption: 5.5,
      location: 'Building D'
    });
  };
  
  return <Button onPress={handleCreate} title="Create Pump" />;
}
```

---

## 🎨 Customization

### Theme Configuration

Edit `frontend/constants/theme.ts`:

```typescript
export const lightTheme = {
  colors: {
    primary: '#0EA5E9',    // Change brand color
    secondary: '#F8FAFC',
    // ... more colors
  }
};
```

### Language Support

Add translations in `frontend/constants/translations.ts`:

```typescript
export const translations = {
  hero: {
    title: {
      en: 'Smart Water Pumps',
      he: 'משאבות מים חכמות'
    }
  }
};
```

Toggle language in the UI using the globe icon in the navigation bar.

---

## 🐛 Troubleshooting

### Issue: "Welcome to Expo" shows instead of app

**Solution**: Clear Expo cache and restart:

```bash
rm -rf .expo node_modules
npm install
npm start --clear
```

### Issue: tRPC connection errors

**Solution**: Verify `EXPO_PUBLIC_RORK_API_BASE_URL` in `.env`:

```env
# For web development
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:8081

# For mobile development (use your computer's IP)
EXPO_PUBLIC_RORK_API_BASE_URL=http://192.168.1.100:8081
```

### Issue: Supabase authentication errors

**Solution**: Double-check your Supabase keys:
1. Go to Supabase Dashboard > Project Settings > API
2. Copy the **anon public** key to `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Copy the **service_role** key to `SUPABASE_SERVICE_KEY`

### Issue: Context errors (useTheme, useLanguage)

These warnings can be safely ignored. The contexts provide fallback values when used outside providers.

### Issue: Docker build fails

**Solution**: Ensure Dockerfile is in correct location:

```bash
docker build -f infra/Dockerfile -t aquapump:latest .
```

### Issue: Port 8081 already in use

**Solution**: Kill the process using the port:

```bash
# Find process
lsof -ti:8081

# Kill process
kill -9 $(lsof -ti:8081)

# Or change port in .env
PORT=8082
```

---

## 📚 Additional Documentation

- [Architecture Guide](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Kubernetes Guide](./KUBERNETES.md)
- [GitOps with ArgoCD](./GITOPS.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

---

## 📞 Support

For issues and questions:
- **GitHub Issues**: [github.com/your-org/aquapump-v1.0/issues](https://github.com/your-org/aquapump-v1.0/issues)
- **Email**: support@aquatech.example.com

---

**Built with ❤️ by AquaTech Group | Ramla, Israel**
