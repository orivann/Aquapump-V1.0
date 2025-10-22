# ⚡ AquaPump Quick Reference

Fast reference for common commands and operations.

---

## 🚀 Getting Started

```bash
# Clone and setup
git clone <repo-url> && cd Aquapump-V1.0
cp .env.example .env && nano .env

# Start development
chmod +x infra/scripts/*.sh
./infra/scripts/deploy-local.sh

# Access
open http://localhost:8080
```

---

## 📦 Docker Commands

### Local Development

```bash
# Start
cd infra && docker compose up -d

# Stop
docker compose down

# Rebuild
docker compose up --build -d

# Logs
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend

# Shell access
docker exec -it aquapump-backend sh
docker exec -it aquapump-frontend sh
```

### Production

```bash
# Start production
cd infra && docker compose -f docker-compose.prod.yml up -d

# Stop
docker compose -f docker-compose.prod.yml down

# Logs
docker compose -f docker-compose.prod.yml logs -f

# Update
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Status
docker compose -f docker-compose.prod.yml ps
```

---

## 🏗️ Build & Deploy

```bash
# Verify setup
./infra/scripts/verify-production.sh

# Build images
./infra/scripts/build-prod.sh

# Push to Docker Hub
docker login
./infra/scripts/push-prod.sh

# Deploy locally
cd infra && docker compose -f docker-compose.prod.yml up -d
```

---

## ☸️ Kubernetes

```bash
# Create namespace
kubectl create namespace aquapump-prod

# Deploy with Helm
helm upgrade --install aquapump ./infra/helm/aquapump \
  -n aquapump-prod \
  -f infra/helm/aquapump/values.yaml

# Status
kubectl get pods -n aquapump-prod
kubectl get svc -n aquapump-prod
kubectl get ingress -n aquapump-prod

# Logs
kubectl logs -f deployment/aquapump-frontend -n aquapump-prod
kubectl logs -f deployment/aquapump-backend -n aquapump-prod

# Shell access
kubectl exec -it deployment/aquapump-backend -n aquapump-prod -- sh

# Scale
kubectl scale deployment/aquapump-frontend --replicas=5 -n aquapump-prod

# Delete
helm uninstall aquapump -n aquapump-prod
```

---

## 🔧 Development

```bash
# Install dependencies
bun install

# Run backend only
bun run backend/server.ts

# Run frontend only
bun start

# Type check
bun run type-check

# Lint
bun run lint
```

---

## 🐛 Debugging

```bash
# View container logs
docker logs -f aquapump-backend
docker logs -f aquapump-frontend

# Check container status
docker ps -a | grep aquapump

# Inspect container
docker inspect aquapump-backend

# Check networks
docker network ls
docker network inspect aquapump-network

# Test API
curl http://localhost:8081/health
curl http://localhost:8081/

# Test frontend
curl http://localhost:8080/health
```

---

## 🔍 Health Checks

```bash
# Backend
curl http://localhost:8081/health
# {"status":"healthy","timestamp":"...","uptime":...}

# Frontend
curl http://localhost:8080/health
# healthy

# Production
curl https://api.aquapump.com/health
curl https://aquapump.com/health
```

---

## 🌐 Environment Variables

### Development (`.env`)
```env
EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com
SUPABASE_SERVICE_KEY=your_service_key
```

### Production (`.env.production`)
```env
EXPO_PUBLIC_RORK_API_BASE_URL=https://api.aquapump.com
EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com

SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
CORS_ORIGIN=https://aquapump.com,https://www.aquapump.com
LOG_LEVEL=warn
```

---

## 🔄 Common Tasks

### Restart Services

```bash
# Local
docker compose -f infra/docker-compose.yml restart

# Production
docker compose -f infra/docker-compose.prod.yml restart

# K8s
kubectl rollout restart deployment/aquapump-frontend -n aquapump-prod
```

### Update Images

```bash
# Pull latest
docker pull orivann/aquapump-backend:prod
docker pull orivann/aquapump-frontend:prod

# Or rebuild
./infra/scripts/build-prod.sh
./infra/scripts/push-prod.sh
```

### Clean Up

```bash
# Remove containers
docker compose -f infra/docker-compose.yml down -v

# Remove images
docker rmi aquapump-backend:latest aquapump-frontend:latest

# Clean system
docker system prune -a --volumes
```

---

## 📊 Monitoring

```bash
# Docker stats
docker stats

# K8s metrics
kubectl top pods -n aquapump-prod
kubectl top nodes

# Logs with timestamp
docker compose logs -f --timestamps

# Follow specific container
docker logs -f --tail 100 aquapump-backend
```

---

## 🆘 Emergency Commands

```bash
# Stop everything
docker stop $(docker ps -q)

# Kill unresponsive container
docker kill aquapump-backend

# Force remove
docker rm -f aquapump-backend aquapump-frontend

# Emergency rebuild
docker compose down -v
docker compose up --build --force-recreate -d

# K8s emergency
kubectl delete pod --all -n aquapump-prod
```

---

## 📁 Important Files

```
.env                    # Local dev config
.env.production         # Production config
infra/docker-compose.yml           # Dev compose
infra/docker-compose.prod.yml      # Prod compose
infra/Dockerfile.frontend          # Frontend build
infra/Dockerfile.backend           # Backend build
infra/nginx.conf                   # Nginx config
infra/helm/aquapump/values.yaml    # K8s config
```

---

## 🔗 URLs

### Development
- Frontend: http://localhost:8080
- Backend: http://localhost:8081
- Health: http://localhost:8081/health

### Production
- Frontend: https://aquapump.com
- Backend: https://api.aquapump.com
- Health: https://api.aquapump.com/health

---

## 📚 Documentation

- [README.md](./README.md) - Overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment guide
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - Production details
- [docs/](./docs/) - Additional docs

---

**Quick help:** Run `./infra/scripts/verify-production.sh` to check your setup!
