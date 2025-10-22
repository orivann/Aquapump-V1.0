# \ud83d\ude80 AquaPump Quick Deploy Guide

## \u26a1 TL;DR - Deploy in 5 Minutes

### Local Development

```bash
git clone <repo>
cd aquapump-v1.0
cp .env.example .env
bun install
bun start
```

### Production with Docker Compose

```bash
# 1. Configure
cp .env.production.example .env.production
nano .env.production  # Update credentials

# 2. Deploy
bash infra/scripts/deploy-prod.sh

# Done! Access at http://your-server:8080
```

## \ud83d\udc33 Docker Commands

### Development

```bash
cd infra
docker compose up --build          # Build & run
docker compose down                # Stop
docker compose logs -f             # View logs
```

### Production

```bash
# Pull & run from Docker Hub
cd infra
docker compose -f docker-compose.prod.yml up -d

# View status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop
docker compose -f docker-compose.prod.yml down
```

## \ud83d\udccd Build & Push to Docker Hub

```bash
# Automated build & push
bash infra/scripts/docker-build-prod.sh

# Or manually
cd infra
docker compose build
docker tag aquapump-backend:latest orivann/aquapump-backend:prod
docker tag aquapump-frontend:latest orivann/aquapump-frontend:prod
docker push orivann/aquapump-backend:prod
docker push orivann/aquapump-frontend:prod
```

## \u2618\ufe0f Kubernetes Quick Deploy

```bash
# 1. Create namespace & secrets
kubectl create namespace aquapump
kubectl create secret generic aquapump-secrets \
  --from-env-file=.env.production \
  --namespace aquapump

# 2. Deploy with Helm
helm upgrade --install aquapump infra/helm/aquapump \
  --namespace aquapump \
  --values infra/helm/aquapump/values.yaml

# 3. Check status
kubectl get pods -n aquapump
kubectl get svc -n aquapump
kubectl logs -n aquapump -l app=aquapump -f
```

## \ud83d\udd27 Useful Commands

### Health Checks

```bash
# Backend
curl http://localhost:8081/health

# Frontend
curl http://localhost:8080
```

### Logs

```bash
# Docker
docker logs aquapump-backend-prod --tail 100 -f
docker logs aquapump-frontend-prod --tail 100 -f

# Kubernetes
kubectl logs -n aquapump -l app=aquapump --tail=100 -f
```

### Restart Services

```bash
# Docker
docker restart aquapump-backend-prod
docker restart aquapump-frontend-prod

# Kubernetes
kubectl rollout restart deployment/aquapump -n aquapump
```

## \ud83d\udeab Common Issues

### Port Already in Use

```bash
# Find and kill process
sudo lsof -ti:8080 | xargs kill -9
sudo lsof -ti:8081 | xargs kill -9
```

### Docker Build Fails

```bash
# Clean cache and rebuild
docker builder prune -a
docker compose build --no-cache
```

### Can't Connect to Backend

```bash
# Check if backend is running
docker ps | grep backend

# Check logs
docker logs aquapump-backend-prod

# Verify environment variables
docker exec aquapump-backend-prod env | grep SUPABASE
```

## \ud83d\udcc4 File Checklist

Before deployment, ensure:

- [ ] `.env.production` exists with real credentials
- [ ] Supabase URL and keys are correct
- [ ] CORS_ORIGIN matches your domain
- [ ] Docker is installed and running
- [ ] Port 8080 and 8081 are available

## \ud83d\udd10 Security Checklist

- [ ] `.env` files are not committed (check .gitignore)
- [ ] Production uses strong passwords
- [ ] HTTPS is enabled
- [ ] CORS_ORIGIN is not set to `*`
- [ ] Service keys are never exposed to client

## \ud83d\udcde Need Help?

1. Run verification: `bash infra/scripts/verify-setup.sh`
2. Check logs: `docker logs <container-name>`
3. Read: [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)
4. Review: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

**Quick deploy complete! \ud83c\udf89**
