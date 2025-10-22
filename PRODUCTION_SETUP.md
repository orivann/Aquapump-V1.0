# AquaPump Production Setup Guide

Complete guide to deploying AquaPump to production with Docker, Kubernetes, and CI/CD.

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│  Load Balancer  │
│   / Ingress     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│Nginx │  │ API  │
│ FE   │◄─┤ BE   │
└──────┘  └──┬───┘
              │
          ┌───▼────┐
          │Database│
          │Supabase│
          └────────┘
```

**Stack:**
- **Frontend**: React Native Web (Expo) → Nginx
- **Backend**: Node.js (Hono + tRPC) → Bun runtime
- **Infrastructure**: Docker, Kubernetes, Helm, ArgoCD
- **CI/CD**: GitHub Actions

---

## 📋 Prerequisites

### Required Tools
- Docker 24+ & Docker Compose
- Node.js 22+
- Bun (latest)
- kubectl (for K8s deployment)
- Helm 3+ (for K8s deployment)

### Required Accounts
- Docker Hub account (orivann)
- Supabase account
- Domain with DNS access
- Kubernetes cluster (optional)

---

## 🚀 Quick Start (Local Development)

### 1. Clone and Configure

```bash
cd /path/to/Aquapump-V1.0

# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env
```

### 2. Start Local Development

```bash
chmod +x infra/scripts/deploy-local.sh
./infra/scripts/deploy-local.sh
```

Access at:
- Frontend: http://localhost:8080
- Backend: http://localhost:8081
- API Health: http://localhost:8081/health

### 3. View Logs

```bash
docker compose -f infra/docker-compose.yml logs -f
```

---

## 🏭 Production Deployment

### Step 1: Configure Production Environment

Create `.env.production`:

```bash
cp .env.production.example .env.production
nano .env.production
```

Required variables:
```env
# Frontend (publicly accessible)
EXPO_PUBLIC_RORK_API_BASE_URL=https://api.aquapump.com
EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com

# Backend (server-side only)
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
CORS_ORIGIN=https://aquapump.com,https://www.aquapump.com
LOG_LEVEL=warn
```

### Step 2: Build Production Images

```bash
chmod +x infra/scripts/build-prod.sh
./infra/scripts/build-prod.sh
```

This creates:
- `orivann/aquapump-backend:prod`
- `orivann/aquapump-frontend:prod`

### Step 3: Test Images Locally

```bash
cd infra
docker compose -f docker-compose.prod.yml up
```

Access at http://localhost:80

### Step 4: Push to Docker Hub

```bash
chmod +x infra/scripts/push-prod.sh

# Login to Docker Hub
export DOCKER_HUB_TOKEN="your_token_here"

# Push
./infra/scripts/push-prod.sh
```

### Step 5: Deploy to Production Server

#### Option A: Docker Compose (Simple)

On your production server:

```bash
# Pull the latest images
docker pull orivann/aquapump-backend:prod
docker pull orivann/aquapump-frontend:prod

# Create .env.production with your secrets
nano .env.production

# Start services
docker compose -f infra/docker-compose.prod.yml up -d

# Check status
docker compose -f infra/docker-compose.prod.yml ps
```

#### Option B: Kubernetes + Helm (Scalable)

```bash
# Add Helm repo (if needed)
helm repo add aquapump ./infra/helm/aquapump
helm repo update

# Create namespace
kubectl create namespace aquapump-prod

# Create secrets
kubectl create secret generic aquapump-secrets \
  --from-literal=SUPABASE_SERVICE_KEY="your_key" \
  --namespace aquapump-prod

# Install/Upgrade
helm upgrade --install aquapump \
  ./infra/helm/aquapump \
  --namespace aquapump-prod \
  --values infra/helm/aquapump/values.yaml \
  --set ingress.hosts[0].host=aquapump.com

# Check deployment
kubectl get pods -n aquapump-prod
kubectl get ingress -n aquapump-prod
```

---

## 🤖 CI/CD Setup

### GitHub Actions Configuration

1. **Add Repository Secrets** (Settings → Secrets and variables → Actions):

```
DOCKER_HUB_TOKEN          # Your Docker Hub access token
EXPO_PUBLIC_API_URL       # https://api.aquapump.com
EXPO_PUBLIC_SUPABASE_URL  # Your Supabase URL
EXPO_PUBLIC_SUPABASE_ANON_KEY  # Your Supabase anon key
EXPO_PUBLIC_TOOLKIT_URL   # https://toolkit.rork.com
ARGOCD_SERVER             # (Optional) ArgoCD server URL
```

2. **Trigger Deployment**

Push to `main` branch triggers automatic:
- Docker image build
- Push to Docker Hub
- Helm chart update
- ArgoCD sync (if configured)

Manual trigger:
```bash
# Via GitHub UI: Actions → Deploy to Production → Run workflow
# Or via CLI:
gh workflow run deploy-production.yml
```

---

## 🔒 Security Checklist

- [ ] All secrets in GitHub Secrets (not in code)
- [ ] `.env.production` added to `.gitignore`
- [ ] HTTPS enabled with valid SSL certificate
- [ ] CORS configured to specific domains (not `*`)
- [ ] Database credentials secured
- [ ] API rate limiting configured
- [ ] Container images scanned for vulnerabilities
- [ ] Non-root user in Docker containers
- [ ] Read-only root filesystem where possible
- [ ] Network policies enabled in Kubernetes

---

## 🎯 Performance Optimization

### Frontend
- ✅ Static files served via Nginx
- ✅ Gzip compression enabled
- ✅ Browser caching (1 year for assets)
- ✅ SPA routing with fallback
- ✅ Optimized Docker layers

### Backend
- ✅ Bun runtime (faster than Node)
- ✅ Connection pooling
- ✅ Request logging
- ✅ Graceful shutdown
- ✅ Health check endpoints

### Infrastructure
- ✅ Multi-stage Docker builds
- ✅ Layer caching
- ✅ Resource limits set
- ✅ Horizontal pod autoscaling (K8s)
- ✅ Pod disruption budgets

---

## 📊 Monitoring & Logging

### Health Checks

```bash
# Backend health
curl https://api.aquapump.com/health

# Frontend health
curl https://aquapump.com/health
```

### View Logs

**Docker Compose:**
```bash
docker compose -f infra/docker-compose.prod.yml logs -f backend
docker compose -f infra/docker-compose.prod.yml logs -f frontend
```

**Kubernetes:**
```bash
kubectl logs -f deployment/aquapump-backend -n aquapump-prod
kubectl logs -f deployment/aquapump-frontend -n aquapump-prod
```

### Metrics

If Prometheus is enabled:
```bash
kubectl port-forward svc/prometheus -n monitoring 9090:9090
# Visit http://localhost:9090
```

---

## 🔧 Troubleshooting

### Frontend shows Expo dev screen

**Problem:** The frontend is not building correctly for production.

**Solution:**
```bash
# Rebuild with no cache
docker build --no-cache -f infra/Dockerfile.frontend \
  --build-arg EXPO_PUBLIC_API_URL=https://api.aquapump.com \
  -t orivann/aquapump-frontend:prod .
```

### API calls fail (CORS errors)

**Problem:** CORS misconfiguration.

**Solution:** Update `CORS_ORIGIN` in `.env.production`:
```env
CORS_ORIGIN=https://aquapump.com,https://www.aquapump.com
```

### Images not pulling in production

**Problem:** Docker Hub authentication failed.

**Solution:**
```bash
docker login
docker pull orivann/aquapump-frontend:prod
```

### Database connection fails

**Problem:** Invalid Supabase credentials.

**Solution:** Verify environment variables:
```bash
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY  # Should NOT be the anon key
```

---

## 🔄 Rollback

### Docker Compose

```bash
# Tag current as backup
docker tag orivann/aquapump-frontend:prod orivann/aquapump-frontend:backup

# Pull previous version
docker pull orivann/aquapump-frontend:latest

# Restart
docker compose -f infra/docker-compose.prod.yml up -d
```

### Kubernetes

```bash
# View history
helm history aquapump -n aquapump-prod

# Rollback to previous
helm rollback aquapump -n aquapump-prod
```

---

## 📦 Backup & Disaster Recovery

### Database Backup (Supabase)

Supabase provides automatic backups. To create manual backup:
```bash
# Via Supabase CLI
supabase db dump > backup_$(date +%Y%m%d).sql
```

### Configuration Backup

```bash
# Backup Kubernetes resources
kubectl get all -n aquapump-prod -o yaml > k8s_backup.yaml

# Backup Helm values
helm get values aquapump -n aquapump-prod > values_backup.yaml
```

---

## 🎓 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

## 📞 Support

For issues:
1. Check logs first (see Monitoring section)
2. Review troubleshooting guide above
3. Check GitHub Issues
4. Contact DevOps team

---

**Last Updated:** 2025-01-22
**Version:** 1.0.0
