# AquaPump Deployment Guide

## Quick Start

### Option 1: Quick Deploy (Recommended for immediate fix)
```bash
chmod +x scripts/quick-deploy.sh
./scripts/quick-deploy.sh production
```

This script automatically:
- Detects Docker Hub issues
- Uses cached images when available
- Falls back to mirror registries
- Handles 503 errors with retries

### Option 2: Standard Deploy
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh production
```

### Option 3: Optimized Deploy (with registry support)
```bash
chmod +x scripts/deploy-optimized.sh
./scripts/deploy-optimized.sh production
```

## Troubleshooting Docker Hub 503 Errors

### Immediate Solutions

1. **Wait and Retry**
   ```bash
   # Docker Hub might be temporarily down
   sleep 300  # Wait 5 minutes
   ./scripts/deploy.sh production
   ```

2. **Use Cached Images**
   ```bash
   # Check if you have cached images
   docker images | grep node
   
   # If yes, build will use cache automatically
   docker build -t aquapump:latest .
   ```

3. **Login to Docker Hub** (increases rate limits)
   ```bash
   docker login
   # Enter your Docker Hub credentials
   ```

4. **Use Google Container Registry Mirror**
   ```bash
   # Pull from mirror
   docker pull mirror.gcr.io/library/node:22-alpine
   docker tag mirror.gcr.io/library/node:22-alpine node:22-alpine
   
   # Then build
   docker build -t aquapump:latest .
   ```

5. **Manual Build with Buildkit**
   ```bash
   DOCKER_BUILDKIT=1 docker build \
     --progress=plain \
     --network=host \
     -t aquapump:latest \
     .
   ```

### Root Causes

- **503 Service Unavailable**: Docker Hub registry is down/overloaded
- **Rate Limiting**: Anonymous users limited to 100 pulls per 6 hours
- **Network Issues**: Firewall/proxy blocking Docker Hub
- **DNS Issues**: Can't resolve hub.docker.com

### Prevention

1. **Use a Docker Registry**
   ```bash
   # GitHub Container Registry
   docker login ghcr.io
   ./scripts/deploy-optimized.sh production ghcr.io/yourusername
   
   # Docker Hub (private)
   docker login
   ./scripts/deploy-optimized.sh production yourusername
   ```

2. **Pre-pull Base Images**
   ```bash
   docker pull node:22-alpine
   docker pull node:20-slim
   ```

3. **Use BuildKit Cache**
   ```bash
   export DOCKER_BUILDKIT=1
   docker build --cache-from aquapump:latest .
   ```

## Deployment Methods

### Local Development
```bash
# Build and run locally
bun install
bun run start-web

# Or with Docker
docker-compose up
```

### Docker Compose (Production)
```bash
./scripts/deploy.sh production
# Select option 1 (Docker)
```

### Kubernetes (Production)
```bash
./scripts/deploy.sh production
# Select option 2 (Kubernetes)
```

### Helm (GitOps)
```bash
./scripts/deploy-optimized.sh production
# Select option 2 (Helm/Kubernetes)
```

## Image Optimization

The new Dockerfile:
- Uses `node:22-alpine` (smaller, ~150MB vs ~300MB)
- Multi-stage build (reduces final image size)
- Only copies necessary files
- Includes `dumb-init` for proper signal handling
- Non-root user for security
- Health checks built-in

## Health Checks

Check if the app is running:
```bash
curl http://localhost:8081/api/health
```

View logs:
```bash
# Docker Compose
docker-compose logs -f

# Docker
docker logs -f aquapump-app-prod

# Kubernetes
kubectl logs -f deployment/aquapump-app
```

## Performance

Current setup:
- Build time: ~2-3 minutes (first build)
- Build time: ~30-60 seconds (with cache)
- Image size: ~400MB (optimized)
- Startup time: ~5-10 seconds
- Memory usage: ~200-500MB

## CI/CD Integration

### GitHub Actions
See `.github/workflows/main.yml` for automated deployments.

### Argo CD
See `infra/argocd/` for GitOps configuration.

## Security

- Non-root user (`expouser:1001`)
- Read-only filesystem where possible
- Health checks for liveness/readiness
- Resource limits configured
- Secrets management via Kubernetes/env files

## Monitoring

Add monitoring with:
```bash
# Prometheus metrics endpoint
curl http://localhost:8081/api/metrics

# Health status
curl http://localhost:8081/api/health
```

## Rollback

If deployment fails:
```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Kubernetes
kubectl rollout undo deployment/aquapump-app

# Helm
helm rollback aquapump
```

## Support

If issues persist:
1. Check Docker Hub status: https://status.docker.com/
2. Review build logs: `/tmp/docker-build.log`
3. Check container logs: `docker logs aquapump-app-prod`
4. Verify environment variables: `docker-compose config`
