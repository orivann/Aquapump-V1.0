# ⚡ AquaPump Quick Start Guide

> Get your AquaPump application running in 5 minutes

---

## 🚀 Local Development (5 min setup)

### Step 1: Clone & Install (1 min)

```bash
git clone <repository-url>
cd aquapump
bun install
```

### Step 2: Configure Environment (2 min)

```bash
# Copy environment template
cp .env.example .env

# Edit .env and set required variables:
# - EXPO_PUBLIC_SUPABASE_URL
# - EXPO_PUBLIC_SUPABASE_ANON_KEY
# Optional for chatbot:
# - EXPO_PUBLIC_AI_CHAT_KEY
```

### Step 3: Start Backend (1 min)

```bash
# Terminal 1: Start backend API
bun run backend/server.ts

# Should see:
# ✅ AquaPump Backend is running!
# 🌐 API available at: http://0.0.0.0:8081
```

### Step 4: Start Frontend (1 min)

```bash
# Terminal 2: Start frontend
bun start

# Or for web only:
bun run start-web

# Access at: http://localhost:19006
```

---

## 🐳 Docker Deployment (10 min)

### Quick Deploy

```bash
# Build and start all services
docker compose -f infra/docker-compose.yml up -d

# Check status
docker compose ps

# Access:
# Frontend: http://localhost:8080
# Backend: http://localhost:8081
```

### Verify Health

```bash
# Backend health check
curl http://localhost:8081/health
# Should return: {"status":"healthy"}

# Frontend health
curl http://localhost:8080
# Should return: HTML content
```

---

## ☸️ Kubernetes Deployment (15 min)

### Prerequisites
- Kubernetes cluster running
- kubectl configured
- Helm 3+ installed

### Deploy

```bash
# 1. Create namespace
kubectl create namespace aquapump

# 2. Create secrets
kubectl create secret generic aquapump-secrets \
  --from-env-file=.env.production \
  --namespace=aquapump

# 3. Install Helm chart
helm install aquapump ./infra/helm/aquapump \
  --namespace aquapump \
  --values ./infra/helm/aquapump/values.yaml

# 4. Check deployment
kubectl get pods -n aquapump
kubectl get svc -n aquapump
kubectl get ingress -n aquapump
```

---

## 🔧 Common Commands

### Development

```bash
# Start dev server
bun start

# Start web only
bun run start-web

# Start backend
bun run backend/server.ts

# Lint code
bun run lint
```

### Docker

```bash
# Build images
docker compose build

# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Rebuild and restart
docker compose up -d --build
```

### Kubernetes

```bash
# Get pods
kubectl get pods -n aquapump

# Get logs
kubectl logs -f deployment/aquapump -n aquapump

# Scale deployment
kubectl scale deployment aquapump --replicas=5 -n aquapump

# Delete deployment
helm uninstall aquapump -n aquapump
```

---

## 🐛 Troubleshooting

### Backend not starting?

```bash
# Check if port 8081 is available
lsof -i :8081

# Check backend logs
tail -f backend.log
```

### Frontend not loading?

```bash
# Clear Expo cache
bun start --clear

# Check environment variables
cat .env | grep EXPO_PUBLIC
```

### Docker issues?

```bash
# Clear Docker cache
docker system prune -a

# Rebuild from scratch
docker compose build --no-cache
```

### Kubernetes pods not running?

```bash
# Describe pod
kubectl describe pod <pod-name> -n aquapump

# Check events
kubectl get events -n aquapump --sort-by='.lastTimestamp'

# Check logs
kubectl logs <pod-name> -n aquapump
```

---

## 📚 Key Files

### Environment Configuration
- `.env` - Local environment (NOT committed)
- `.env.example` - Template with all variables
- `.env.production` - Production config (NOT committed)

### Application Code
- `frontend/app/` - Pages (Expo Router)
- `frontend/components/` - UI components
- `backend/hono.ts` - Backend server
- `backend/trpc/` - API routes

### Infrastructure
- `infra/Dockerfile*` - Container definitions
- `infra/docker-compose.yml` - Docker Compose config
- `infra/helm/aquapump/` - Kubernetes Helm chart
- `infra/kubernetes/` - K8s manifests

### Documentation
- `README.md` - Project overview
- `PRODUCTION_GUIDE.md` - Full deployment guide
- `OPTIMIZATION_SUMMARY.md` - Changes summary
- `QUICK_START.md` - This file

---

## 🎯 Environment Variables

### Required

```env
# Frontend (client-accessible)
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:8081
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend (server-side)
PORT=8081
HOST=0.0.0.0
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

### Optional

```env
# AI Chatbot
EXPO_PUBLIC_AI_CHAT_KEY=your-ai-api-key

# Rork Toolkit
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com

# Logging
LOG_LEVEL=info
NODE_ENV=development
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend loads at expected URL
- [ ] Theme toggle switches dark/light mode
- [ ] Language toggle switches EN/HE
- [ ] Navigation links work
- [ ] All sections load (Hero, About, Products, Contact)
- [ ] Chatbot opens and responds
- [ ] Backend health check: `curl <backend-url>/health`
- [ ] API accessible: `curl <backend-url>/api`
- [ ] Monitoring (if enabled)
- [ ] Logs are being collected

---

## 🆘 Getting Help

### Check Logs

```bash
# Application logs
kubectl logs -f deployment/aquapump -n aquapump

# Backend logs (Docker)
docker compose logs backend -f

# System logs
journalctl -u aquapump -f
```

### Health Checks

```bash
# Backend health
curl http://localhost:8081/health

# Backend ready
curl http://localhost:8081/ready

# Frontend
curl http://localhost:8080
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Change `PORT` in `.env` |
| Missing env vars | Copy from `.env.example` |
| Docker build fails | Run with `--no-cache` |
| Pods crashing | Check `kubectl describe pod` |
| Theme not persisting | Clear app cache |
| Translations not working | Verify `useLanguage()` hook |

---

## 📞 Support

- **Documentation**: See `PRODUCTION_GUIDE.md`
- **Issues**: Check logs and troubleshooting guide
- **Security**: Never commit `.env` files
- **Updates**: Pull latest and run `bun install`

---

**Ready to deploy?** Follow the steps above and you'll have AquaPump running in minutes! 🚀
