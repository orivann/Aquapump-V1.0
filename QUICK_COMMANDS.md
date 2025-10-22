# AquaPump - Quick Commands Reference

## 🚀 First Time Setup

```bash
# 1. Verify your system
bash infra/scripts/verify-setup.sh

# 2. Install dependencies
bun install  # or: npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run locally
bun run backend/server.ts  # Terminal 1
bun start                   # Terminal 2
```

---

## 🐳 Docker Quick Start

```bash
# Build and run
cd infra
docker compose up --build

# Or step by step:
docker compose build   # Build images
docker compose up -d   # Start in background
docker compose logs -f # Watch logs
```

---

## 🔍 Verify Everything Works

```bash
# System check
bash infra/scripts/verify-setup.sh

# Health checks
curl http://localhost:8081/health  # Backend
curl http://localhost:8080          # Frontend

# Container status
docker compose ps
docker compose logs backend
docker compose logs frontend
```

---

## 🛠️ Development Commands

```bash
# Start Expo dev server
bun start

# Start Expo for web only
bun run start-web

# Start backend
bun run backend/server.ts

# Lint code
bun run lint

# Type check
bun run tsc --noEmit
```

---

## 🐳 Docker Management

```bash
# Start services
docker compose up              # Foreground (see logs)
docker compose up -d           # Background (detached)

# Stop services
docker compose down            # Stop containers
docker compose down -v         # Stop + remove volumes

# Rebuild
docker compose build           # Normal build
docker compose build --no-cache # Clean build

# View logs
docker compose logs            # All logs
docker compose logs -f         # Follow logs
docker compose logs backend    # Specific service

# Restart service
docker compose restart backend
docker compose restart frontend

# Execute commands in container
docker compose exec backend sh
docker compose exec frontend sh

# Clean up
docker system prune           # Remove unused data
docker system prune -a        # Remove all unused data
```

---

## 🔧 Troubleshooting Commands

```bash
# Port already in use
lsof -ti:8080 | xargs kill -9  # Kill process on port 8080
lsof -ti:8081 | xargs kill -9  # Kill process on port 8081

# Clear Expo cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules bun.lock
bun install

# Reset Docker
docker compose down -v
docker system prune -a
docker compose build --no-cache

# Check container health
docker inspect aquapump-backend --format='{{.State.Health.Status}}'
docker inspect aquapump-frontend --format='{{.State.Health.Status}}'
```

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend (Dev) | http://localhost:19006 | Expo dev server |
| Frontend (Docker) | http://localhost:8080 | Production build |
| Backend | http://localhost:8081 | API server |
| Health Check | http://localhost:8081/health | Server status |

---

## 📦 Common Workflows

### Update Code
```bash
git pull
bun install
docker compose down
docker compose build
docker compose up -d
```

### Debug Build Issues
```bash
# Check build logs
docker compose build 2>&1 | tee build.log

# Check runtime logs
docker compose logs > runtime.log

# Enter container
docker compose exec backend sh
cd /app && ls -la
```

### Fresh Start
```bash
# Complete reset
docker compose down -v
docker system prune -a
rm -rf node_modules bun.lock
bun install
docker compose build --no-cache
docker compose up
```

---

## ☸️ Production Deployment

### Using Helm
```bash
# Install
helm install aquapump ./infra/helm/aquapump \
  --namespace aquapump \
  --create-namespace

# Upgrade
helm upgrade aquapump ./infra/helm/aquapump

# Rollback
helm rollback aquapump

# Status
helm status aquapump
```

### Using kubectl
```bash
# Apply configs
kubectl apply -f infra/kubernetes/

# Check status
kubectl get all -n aquapump
kubectl describe pod <pod-name> -n aquapump
kubectl logs <pod-name> -n aquapump

# Port forward
kubectl port-forward svc/aquapump 8080:80 -n aquapump
```

### Using Argo CD
```bash
# Install Argo CD app
kubectl apply -f infra/argocd/application.yaml

# Check sync status
argocd app get aquapump

# Force sync
argocd app sync aquapump
```

---

## 📊 Monitoring

```bash
# Docker stats
docker stats

# Container logs (live)
docker compose logs -f --tail=100

# Check disk usage
docker system df

# List images
docker images

# List containers
docker ps -a
```

---

## 🔐 Security

```bash
# Check for secrets in git
git log --all --full-history -- .env

# Scan for vulnerabilities
docker scan aquapump-backend:latest

# Audit dependencies
npm audit
# or
bun audit
```

---

## 🧪 Testing

```bash
# Test endpoints
curl -X GET http://localhost:8081/health
curl -X GET http://localhost:8081/api/trpc/example.hi

# Test with verbose
curl -v http://localhost:8080

# Load test (if hey is installed)
hey -n 1000 -c 10 http://localhost:8081/health
```

---

## 📝 Useful Aliases

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# AquaPump aliases
alias aqua-up='cd ~/Aqua_V1.1/Aquapump-V1.0/infra && docker compose up -d'
alias aqua-down='cd ~/Aqua_V1.1/Aquapump-V1.0/infra && docker compose down'
alias aqua-logs='cd ~/Aqua_V1.1/Aquapump-V1.0/infra && docker compose logs -f'
alias aqua-build='cd ~/Aqua_V1.1/Aquapump-V1.0/infra && docker compose build'
alias aqua-verify='cd ~/Aqua_V1.1/Aquapump-V1.0 && bash infra/scripts/verify-setup.sh'
alias aqua-health='curl http://localhost:8081/health && echo "" && curl http://localhost:8080'
```

Then reload: `source ~/.bashrc` or `source ~/.zshrc`

---

## 🆘 Get Help

```bash
# Run verification
bash infra/scripts/verify-setup.sh

# Read docs
cat DEPLOYMENT_FIXED.md
cat FIXES_APPLIED.md
cat docs/TROUBLESHOOTING.md

# Check Docker Compose help
docker compose --help
docker compose up --help
```

---

**Quick Start**: `bash infra/scripts/verify-setup.sh && cd infra && docker compose up`

**Need Help?** See [DEPLOYMENT_FIXED.md](DEPLOYMENT_FIXED.md) or [FIXES_APPLIED.md](FIXES_APPLIED.md)
