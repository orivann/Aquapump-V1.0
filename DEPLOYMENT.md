# 🚀 AquaPump Deployment Guide

Complete step-by-step guide to deploy AquaPump from development to production.

---

## 📋 Prerequisites Checklist

- [ ] Docker 24+ installed
- [ ] Docker Compose installed
- [ ] Git repository access
- [ ] Supabase account and project
- [ ] Docker Hub account (orivann)
- [ ] Domain name (for production)
- [ ] SSL certificate (for production)

---

## 🏠 Local Development Setup

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd Aquapump-V1.0
```

### Step 2: Configure Environment

```bash
# Copy template
cp .env.example .env

# Edit configuration
nano .env
```

**Required in `.env`:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com

SUPABASE_SERVICE_KEY=your_service_role_key_here
```

### Step 3: Start Development

```bash
# Make scripts executable
chmod +x infra/scripts/*.sh

# Start services
./infra/scripts/deploy-local.sh
```

### Step 4: Access Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8081
- **Health Check**: http://localhost:8081/health

### Step 5: View Logs

```bash
# All services
docker compose -f infra/docker-compose.yml logs -f

# Backend only
docker compose -f infra/docker-compose.yml logs -f backend

# Frontend only
docker compose -f infra/docker-compose.yml logs -f frontend
```

### Step 6: Stop Services

```bash
cd infra
docker compose down
```

---

## 🏭 Production Deployment

### Phase 1: Preparation

#### 1.1 Create Production Environment File

```bash
cp .env.production.example .env.production
nano .env.production
```

**Production configuration:**
```env
# Frontend Variables (publicly accessible)
EXPO_PUBLIC_RORK_API_BASE_URL=https://api.aquapump.com
EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com

# Backend Variables (server-side ONLY)
NODE_ENV=production
PORT=8081
HOST=0.0.0.0
CORS_ORIGIN=https://aquapump.com,https://www.aquapump.com

SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

LOG_LEVEL=warn
```

#### 1.2 Verify Setup

```bash
./infra/scripts/verify-production.sh
```

Fix any errors before proceeding.

---

### Phase 2: Build Docker Images

#### 2.1 Build Production Images

```bash
./infra/scripts/build-prod.sh
```

This creates:
- `orivann/aquapump-backend:prod`
- `orivann/aquapump-frontend:prod`

Build time: ~5-10 minutes depending on your machine.

#### 2.2 Test Images Locally

```bash
cd infra
docker compose -f docker-compose.prod.yml up
```

Visit http://localhost:80 and verify:
- [ ] Frontend loads correctly (NOT Expo dev screen)
- [ ] API calls work
- [ ] Theme switching works
- [ ] Language switching works
- [ ] All sections render properly

Press `Ctrl+C` to stop.

---

### Phase 3: Push to Docker Hub

#### 3.1 Login to Docker Hub

```bash
docker login
# Username: orivann
# Password: <your-docker-hub-token>
```

Or with token:
```bash
export DOCKER_HUB_TOKEN="your_token_here"
echo "$DOCKER_HUB_TOKEN" | docker login -u orivann --password-stdin
```

#### 3.2 Push Images

```bash
./infra/scripts/push-prod.sh
```

This pushes:
- `orivann/aquapump-backend:prod`
- `orivann/aquapump-backend:latest`
- `orivann/aquapump-frontend:prod`
- `orivann/aquapump-frontend:latest`

---

### Phase 4: Deploy to Production Server

Choose your deployment method:

#### Option A: Docker Compose (Recommended for single server)

**On your production server:**

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Clone repo or copy compose file
mkdir -p aquapump && cd aquapump
wget https://raw.githubusercontent.com/yourrepo/aquapump/main/infra/docker-compose.prod.yml

# 3. Create environment file
nano .env.production
# Paste your production config

# 4. Pull and start
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# 5. Check status
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

**Setup reverse proxy (Nginx or Caddy):**

```nginx
# /etc/nginx/sites-available/aquapump
server {
    listen 80;
    listen 443 ssl http2;
    server_name aquapump.com www.aquapump.com;

    ssl_certificate /etc/letsencrypt/live/aquapump.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aquapump.com/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/aquapump /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Option B: Kubernetes (Recommended for high availability)

```bash
# 1. Create namespace
kubectl create namespace aquapump-prod

# 2. Create secrets
kubectl create secret generic aquapump-secrets \
  --from-literal=SUPABASE_SERVICE_KEY="your_service_key" \
  --from-literal=SUPABASE_URL="https://yourproject.supabase.co" \
  --namespace aquapump-prod

# 3. Update Helm values
nano infra/helm/aquapump/values.yaml
# Update:
#   - ingress.hosts[0].host to your domain
#   - configMap.EXPO_PUBLIC_API_URL
#   - configMap.CORS_ORIGIN

# 4. Install with Helm
helm upgrade --install aquapump \
  ./infra/helm/aquapump \
  --namespace aquapump-prod \
  --values infra/helm/aquapump/values.yaml

# 5. Check deployment
kubectl get pods -n aquapump-prod
kubectl get ingress -n aquapump-prod
kubectl logs -f deployment/aquapump-frontend -n aquapump-prod
```

---

### Phase 5: Configure CI/CD

#### 5.1 Add GitHub Secrets

Go to: **Settings → Secrets and variables → Actions**

Add these secrets:
```
DOCKER_HUB_TOKEN              # Docker Hub access token
EXPO_PUBLIC_API_URL           # https://api.aquapump.com
EXPO_PUBLIC_SUPABASE_URL      # Your Supabase URL
EXPO_PUBLIC_SUPABASE_ANON_KEY # Your anon key
EXPO_PUBLIC_TOOLKIT_URL       # https://toolkit.rork.com
ARGOCD_SERVER                 # (Optional) ArgoCD URL
```

#### 5.2 Verify Pipeline

The pipeline at `.github/workflows/deploy-production.yml` will:
1. Build Docker images on push to `main`
2. Push to Docker Hub
3. Update Helm values
4. Trigger ArgoCD sync (if configured)

**Manual trigger:**
```bash
# Via GitHub CLI
gh workflow run deploy-production.yml

# Or via GitHub web UI:
# Actions → Deploy to Production → Run workflow
```

---

## 🔍 Verification & Testing

### Health Checks

```bash
# Backend health
curl https://api.aquapump.com/health

# Should return:
# {"status":"healthy","timestamp":"...","uptime":123.45}

# Frontend health
curl https://aquapump.com/health

# Should return:
# healthy
```

### Functional Tests

- [ ] Homepage loads
- [ ] Navigation works
- [ ] Hero section animations
- [ ] Technology section
- [ ] Products section
- [ ] About section
- [ ] Contact form
- [ ] AI Chatbot
- [ ] Theme toggle (light/dark)
- [ ] Language toggle (EN/HE)
- [ ] Mobile responsive
- [ ] API calls succeed
- [ ] No console errors

---

## 📊 Monitoring

### Docker Compose

```bash
# View all logs
docker compose -f infra/docker-compose.prod.yml logs -f

# View stats
docker stats aquapump-frontend-prod aquapump-backend-prod

# Restart service
docker compose -f infra/docker-compose.prod.yml restart frontend
```

### Kubernetes

```bash
# View logs
kubectl logs -f deployment/aquapump-frontend -n aquapump-prod
kubectl logs -f deployment/aquapump-backend -n aquapump-prod

# View metrics
kubectl top pods -n aquapump-prod

# Scale
kubectl scale deployment/aquapump-frontend --replicas=5 -n aquapump-prod
```

---

## 🆘 Troubleshooting

### Issue: Frontend shows Expo dev screen

**Problem:** Frontend not built correctly

**Solution:**
```bash
# Rebuild with no cache
docker build --no-cache \
  --build-arg EXPO_PUBLIC_API_URL=https://api.aquapump.com \
  --build-arg EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co \
  --build-arg EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key \
  --build-arg EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com \
  -f infra/Dockerfile.frontend \
  -t orivann/aquapump-frontend:prod .
```

### Issue: CORS errors

**Problem:** Backend rejecting frontend requests

**Solution:** Update `CORS_ORIGIN` in `.env.production`:
```env
CORS_ORIGIN=https://aquapump.com,https://www.aquapump.com
```

Restart backend:
```bash
docker compose -f infra/docker-compose.prod.yml restart backend
```

### Issue: Database connection failed

**Problem:** Invalid Supabase credentials

**Solution:**
1. Verify keys in Supabase dashboard
2. Check `SUPABASE_SERVICE_KEY` (not anon key!)
3. Verify `SUPABASE_URL` format

### Issue: Images not pulling

**Problem:** Docker Hub auth failed

**Solution:**
```bash
docker logout
docker login -u orivann
docker pull orivann/aquapump-frontend:prod
```

---

## 🔄 Updates & Rollback

### Update Application

```bash
# Pull latest images
docker compose -f infra/docker-compose.prod.yml pull

# Restart with new images
docker compose -f infra/docker-compose.prod.yml up -d
```

### Rollback

```bash
# Docker Compose
docker compose -f infra/docker-compose.prod.yml down
docker pull orivann/aquapump-frontend:backup  # if you tagged backup
docker compose -f infra/docker-compose.prod.yml up -d

# Kubernetes
helm rollback aquapump -n aquapump-prod
```

---

## 📞 Support

If you encounter issues:

1. Check logs first
2. Review this troubleshooting guide
3. Verify environment variables
4. Check network connectivity
5. Contact DevOps team

---

**Last Updated:** 2025-01-22  
**Version:** 1.0.0
