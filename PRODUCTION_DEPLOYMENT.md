# AquaPump Production Deployment Guide

## \ud83d\ude80 Overview

This guide covers deploying AquaPump to production using Docker, Kubernetes, and CI/CD automation.

## \ud83d\udce6 Pre-Deployment Checklist

### 1. Environment Configuration

- [ ] Copy `.env.production.example` to `.env.production`
- [ ] Update all placeholder values with real credentials
- [ ] Verify Supabase URL and keys
- [ ] Set correct CORS_ORIGIN for your domain
- [ ] Configure AI API keys

### 2. Docker Registry

- [ ] Docker Hub account created (username: orivann)
- [ ] Docker Hub access token generated
- [ ] Logged in locally: `docker login`

### 3. Infrastructure

- [ ] Domain name configured
- [ ] SSL certificates ready (Let's Encrypt recommended)
- [ ] Server/cluster provisioned
- [ ] Network and firewall rules configured

## \ud83d\udc33 Deployment Options

### Option 1: Docker Compose (VPS/Single Server)

**Best for**: Small to medium deployments, simple infrastructure

```bash
# 1. Verify setup
bash infra/scripts/verify-setup.sh

# 2. Configure production environment
cp .env.production.example .env.production
nano .env.production  # Update with real values

# 3. Deploy using pre-built images from Docker Hub
bash infra/scripts/deploy-prod.sh

# Services will be available at:
# - Frontend: http://your-server:8080
# - Backend:  http://your-server:8081
```

**Manual steps**:

```bash
cd infra

# Pull latest images
docker compose -f docker-compose.prod.yml pull

# Start services
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

### Option 2: Build Your Own Images

**Best for**: Custom builds, private registries

```bash
# 1. Build and tag images
cd infra
docker compose up --build

# 2. Tag for Docker Hub
docker tag aquapump-backend:latest orivann/aquapump-backend:prod
docker tag aquapump-frontend:latest orivann/aquapump-frontend:prod

# 3. Push to Docker Hub
docker push orivann/aquapump-backend:prod
docker push orivann/aquapump-frontend:prod

# Or use the automated script
bash infra/scripts/docker-build-prod.sh
```

### Option 3: Kubernetes with Helm

**Best for**: Production at scale, high availability

```bash
# 1. Update Helm values
nano infra/helm/aquapump/values.yaml

# Required changes:
# - Set replicaCount (default: 3)
# - Update ingress.hosts with your domain
# - Configure resources based on your cluster
# - Set backend.image.tag and frontend.image.tag

# 2. Create namespace
kubectl create namespace aquapump

# 3. Create secrets
kubectl create secret generic aquapump-secrets \
  --from-env-file=.env.production \
  --namespace aquapump

# 4. Deploy with Helm
helm upgrade --install aquapump ./infra/helm/aquapump \
  --namespace aquapump \
  --values infra/helm/aquapump/values.yaml

# 5. Verify deployment
kubectl get pods -n aquapump
kubectl get svc -n aquapump
kubectl get ingress -n aquapump

# 6. Check logs
kubectl logs -n aquapump -l app=aquapump --tail=100 -f
```

### Option 4: GitOps with ArgoCD

**Best for**: Automated deployments, GitOps workflow

```bash
# 1. Install ArgoCD (if not installed)
kubectl create namespace argocd
kubectl apply -n argocd -f \
  https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 2. Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath=\"{.data.password}\" | base64 -d

# 3. Configure application
kubectl apply -f infra/argocd/application.yaml

# 4. ArgoCD will automatically:
# - Watch your Git repository
# - Sync changes to cluster
# - Self-heal if configuration drifts
```

## \ud83d\udd27 Post-Deployment Tasks

### 1. Verify Services

```bash
# Check frontend
curl -I http://your-domain.com

# Check backend health
curl http://your-domain.com/api/health

# Or with Docker Compose
curl http://localhost:8080
curl http://localhost:8081/health
```

### 2. Configure DNS

Point your domain to the server/load balancer:

```
A Record: aquapump.com -> your-server-ip
A Record: www.aquapump.com -> your-server-ip
```

### 3. Enable HTTPS

**With Kubernetes (cert-manager)**:

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Helm already configures Let's Encrypt
# Check certificate status
kubectl get certificate -n aquapump
```

**With Docker Compose (nginx + Let's Encrypt)**:

Add nginx reverse proxy with certbot to your docker-compose.prod.yml

### 4. Monitor Services

```bash
# Docker Compose
docker compose -f infra/docker-compose.prod.yml logs -f

# Kubernetes
kubectl logs -n aquapump -l app=aquapump -f
kubectl top pods -n aquapump
```

## \ud83e\udd16 CI/CD Setup

### GitHub Actions Configuration

1. **Add GitHub Secrets**:
   - Go to repository Settings \u2192 Secrets and variables \u2192 Actions
   - Add: `DOCKER_HUB_TOKEN` (your Docker Hub access token)
   - Optional: `ARGOCD_SERVER` and `ARGOCD_AUTH_TOKEN`

2. **Workflow triggers on**:
   - Push to `main` branch
   - Manual dispatch

3. **Pipeline steps**:
   - Build Docker images
   - Push to Docker Hub (orivann/aquapump-*)
   - Update Helm values
   - Trigger ArgoCD sync

### Manual Build & Push

```bash
# Build production images
bash infra/scripts/docker-build-prod.sh

# Push to Docker Hub
bash infra/scripts/docker-push-prod.sh

# Deploy from Docker Hub
bash infra/scripts/deploy-prod.sh
```

## \ud83d\udcca Health Checks & Monitoring

### Service Health Endpoints

- **Backend**: `http://localhost:8081/health`
- **Frontend**: `http://localhost:8080/`

### Docker Health Checks

```bash
# Check container health
docker ps

# View logs
docker logs aquapump-backend-prod --tail 100
docker logs aquapump-frontend-prod --tail 100

# Restart if needed
docker restart aquapump-backend-prod
docker restart aquapump-frontend-prod
```

### Kubernetes Health

```bash
# Pod status
kubectl get pods -n aquapump

# Describe pod
kubectl describe pod -n aquapump <pod-name>

# Logs
kubectl logs -n aquapump <pod-name>

# Restart deployment
kubectl rollout restart deployment/aquapump -n aquapump
```

## \ud83d\udd04 Updates & Rollbacks

### Update with Docker Compose

```bash
cd infra

# Pull latest images
docker compose -f docker-compose.prod.yml pull

# Restart with new images
docker compose -f docker-compose.prod.yml up -d

# Verify
docker compose -f docker-compose.prod.yml ps
```

### Update with Kubernetes

```bash
# Update image tags in values.yaml
nano infra/helm/aquapump/values.yaml

# Apply changes
helm upgrade aquapump ./infra/helm/aquapump \
  --namespace aquapump \
  --values infra/helm/aquapump/values.yaml

# Check rollout status
kubectl rollout status deployment/aquapump -n aquapump
```

### Rollback

```bash
# Docker Compose - use specific image tags
docker compose -f docker-compose.prod.yml down
# Edit docker-compose.prod.yml to use previous tag
docker compose -f docker-compose.prod.yml up -d

# Kubernetes
helm rollback aquapump -n aquapump
kubectl rollout undo deployment/aquapump -n aquapump
```

## \ud83d\udeab Troubleshooting

### Build Fails

```bash
# Check Dockerfile syntax
docker build -f infra/Dockerfile.backend .
docker build -f infra/Dockerfile.frontend .

# Clean Docker cache
docker builder prune -a

# Check logs
docker logs <container-id>
```

### Container Crashes

```bash
# Check logs
docker logs aquapump-backend-prod --tail 200

# Check environment variables
docker exec aquapump-backend-prod env

# Restart
docker restart aquapump-backend-prod
```

### Network Issues

```bash
# Check if ports are open
netstat -tuln | grep 8080
netstat -tuln | grep 8081

# Test connectivity
curl http://localhost:8081/health
curl http://localhost:8080

# Check firewall
sudo ufw status
sudo ufw allow 8080/tcp
sudo ufw allow 8081/tcp
```

### Database Connection Issues

```bash
# Verify Supabase credentials in .env.production
cat .env.production | grep SUPABASE

# Test connection from container
docker exec -it aquapump-backend-prod sh
curl https://your-project.supabase.co
```

## \ud83d\udd12 Security Best Practices

1. **Never commit secrets**
   - Add `.env.production` to `.gitignore`
   - Use Kubernetes Secrets for K8s deployments

2. **Use HTTPS**
   - Configure SSL certificates
   - Enforce HTTPS redirects

3. **Limit CORS origins**
   - Set `CORS_ORIGIN` to your actual domain
   - Never use `*` in production

4. **Regular updates**
   - Keep dependencies updated
   - Monitor security advisories

5. **Access control**
   - Use strong passwords
   - Enable 2FA on Docker Hub and cloud providers

## \ud83d\udcdd Environment Variables Reference

### Frontend (EXPO_PUBLIC_*)

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_RORK_API_BASE_URL` | Backend API URL | `https://api.aquapump.com` |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Public key from Supabase dashboard |
| `EXPO_PUBLIC_TOOLKIT_URL` | Rork toolkit URL | `https://toolkit.rork.com` |
| `EXPO_PUBLIC_AI_CHAT_KEY` | AI chat API key | Your AI service key |

### Backend

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `8081` |
| `HOST` | Bind address | `0.0.0.0` |
| `CORS_ORIGIN` | Allowed origins | `https://aquapump.com` |
| `SUPABASE_URL` | Supabase URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Service role key | **Never expose to client!** |
| `LOG_LEVEL` | Logging level | `warn` or `error` |

## \u2705 Success Criteria

Your deployment is successful when:

- [ ] Frontend loads at your domain
- [ ] Backend health endpoint returns 200
- [ ] Services restart automatically after crash
- [ ] HTTPS is enabled and working
- [ ] Database connections are stable
- [ ] Logs show no critical errors
- [ ] CI/CD pipeline runs successfully

## \ud83d\udcde Support

Need help? Check:

1. [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
2. [Architecture Documentation](docs/ARCHITECTURE.md)
3. Container logs: `docker logs <container-name>`
4. Kubernetes events: `kubectl get events -n aquapump`

---

**Deployment completed? Great! Next steps: monitoring, backups, and scaling.**
