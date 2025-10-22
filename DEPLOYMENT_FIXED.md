# AquaPump - Fixed Deployment Guide

## ✅ Issues Fixed

1. **Verify script** - Now runs all checks without stopping on missing tools
2. **Docker build** - Updated to use `expo export --platform web` instead of deprecated `expo export:web`
3. **Docker Compose** - Added `pull_policy: never` to prevent pulling errors

## 🚀 Quick Start (Updated)

### 1. Verify Your Setup

```bash
bash infra/scripts/verify-setup.sh
```

This will now complete all checks even if some tools are missing.

### 2. Build Docker Images

```bash
# Option A: Using the new build script
bash infra/scripts/docker-build.sh

# Option B: Manual build
cd infra
docker compose build --no-cache
```

### 3. Start Containers

```bash
cd infra
docker compose up
```

Or in detached mode:
```bash
docker compose up -d
```

### 4. Access the Application

- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:8081
- **Health Check**: http://localhost:8081/health

## 🐛 Troubleshooting

### Issue 1: Verify script stops after "node is installed"

**Fixed!** The script now uses `|| true` to continue even if checks fail.

### Issue 2: Docker build fails with "expo export:web can only be used with Webpack"

**Fixed!** Updated `infra/Dockerfile.frontend` line 27:
```dockerfile
# Old (broken)
RUN npx expo export:web

# New (working)
RUN npx expo export --platform web
```

### Issue 3: Docker compose up shows "pull access denied"

**Fixed!** Added to `infra/docker-compose.yml`:
```yaml
services:
  backend:
    pull_policy: never  # Don't try to pull, only use local build
  frontend:
    pull_policy: never  # Don't try to pull, only use local build
```

## 📝 Complete Build Process

```bash
# 1. Navigate to project root
cd ~/Aqua_V1.1/Aquapump-V1.0

# 2. Ensure .env exists
cp .env.example .env
# Edit .env with your credentials

# 3. Build images
cd infra
docker compose build

# 4. Start services
docker compose up -d

# 5. Check logs
docker compose logs -f

# 6. Verify health
curl http://localhost:8081/health
curl http://localhost:8080
```

## 🔍 Verification Commands

```bash
# Check if containers are running
docker compose ps

# View logs
docker compose logs backend
docker compose logs frontend

# Check container health
docker inspect aquapump-backend --format='{{.State.Health.Status}}'
docker inspect aquapump-frontend --format='{{.State.Health.Status}}'

# Test endpoints
curl http://localhost:8081/api/health
curl http://localhost:8080

# Enter container for debugging
docker compose exec backend sh
docker compose exec frontend sh
```

## 🛑 Common Errors & Solutions

### Error: "CommandError: expo export:web can only be used with Webpack"

**Solution**: Already fixed in Dockerfile.frontend. If you still see this:
```bash
cd infra
git pull  # Get latest changes
docker compose build --no-cache
```

### Error: "pull access denied for aquapump-frontend"

**Solution**: Already fixed with `pull_policy: never`. If you still see this:
```bash
# Clean up old images
docker rmi aquapump-frontend:latest aquapump-backend:latest
# Rebuild
docker compose build
```

### Error: "Port 8080 already in use"

**Solution**:
```bash
# Find what's using the port
lsof -ti:8080
# Kill the process
kill -9 $(lsof -ti:8080)
# Or change port in docker-compose.yml
```

### Error: Build fails due to missing dependencies

**Solution**:
```bash
# Install dependencies locally first
bun install  # or npm install

# Then build
cd infra
docker compose build
```

## 📦 Docker Commands Reference

```bash
# Build without cache
docker compose build --no-cache

# Start in foreground (see logs)
docker compose up

# Start in background
docker compose up -d

# Stop containers
docker compose down

# Stop and remove volumes
docker compose down -v

# Restart a service
docker compose restart backend

# View resource usage
docker stats

# Clean up everything
docker system prune -a
```

## ✅ Next Steps After Successful Deployment

1. **Access the frontend**: Open http://localhost:8080 in your browser
2. **Test the API**: Visit http://localhost:8081/health
3. **Check language toggle**: Verify Hebrew/English switch works
4. **Test dark mode**: Toggle light/dark theme
5. **Test chatbot**: Interact with the AI assistant
6. **Monitor logs**: Run `docker compose logs -f` in a separate terminal

## 🏗️ Production Deployment

For production deployment to Kubernetes:

```bash
# Using Helm
cd infra/helm/aquapump
helm install aquapump . --namespace aquapump --create-namespace

# Using kubectl
kubectl apply -f infra/kubernetes/

# Using Argo CD
kubectl apply -f infra/argocd/application.yaml
```

See [PRODUCTION_GUIDE.md](PRODUCTION_GUIDE.md) for detailed production setup.

## 📞 Support

If issues persist after these fixes:
1. Run `bash infra/scripts/verify-setup.sh` and share output
2. Share Docker build logs: `docker compose build 2>&1 | tee build.log`
3. Share container logs: `docker compose logs > container.log`
