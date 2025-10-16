# Docker Deployment Guide

Complete guide for deploying AquaPump with Docker and Docker Compose.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 2GB+ available RAM
- 5GB+ available disk space

## Quick Start

### Development

```bash
# Start development environment
docker-compose up

# Access at http://localhost:8081
```

### Production

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Dockerfile Overview

### Multi-Stage Build

```dockerfile
# Stage 1: Dependencies
FROM node:20-slim AS deps
# Install Bun and dependencies

# Stage 2: Builder
FROM node:20-slim AS builder
# Copy dependencies and build

# Stage 3: Runner
FROM node:20-slim AS runner
# Production-ready image
```

### Features

- ✅ Multi-stage build (optimized size)
- ✅ Non-root user (expouser)
- ✅ Health checks included
- ✅ Minimal base image
- ✅ Layer caching optimization
- ✅ Security best practices

## Docker Compose

### Development (docker-compose.yml)

```yaml
services:
  app:
    build: .
    ports:
      - "8081:8081"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/usr/src/app
    command: bun run start-web-dev
```

**Features:**
- Hot reload with volume mounts
- Development mode
- Full logging
- Easy debugging

### Production (docker-compose.prod.yml)

```yaml
services:
  app:
    build: .
    ports:
      - "8081:8081"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8081/api/health"]
```

**Features:**
- Production optimized
- Auto-restart on failure
- Health checks
- Resource limits
- Security hardened

## Building Images

### Development Build

```bash
# Build image
docker build -t aquapump:dev .

# Run container
docker run -p 8081:8081 aquapump:dev
```

### Production Build

```bash
# Build with production tag
docker build -t aquapump:latest .

# Or with version
docker build -t aquapump:v1.0.0 .

# Build without cache
docker build --no-cache -t aquapump:latest .
```

### Multi-Platform Build

```bash
# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t aquapump:latest \
  --push .
```

## Running Containers

### Basic Run

```bash
# Run in foreground
docker run -p 8081:8081 aquapump:latest

# Run in background
docker run -d -p 8081:8081 aquapump:latest

# Run with environment variables
docker run -p 8081:8081 \
  -e NODE_ENV=production \
  -e PORT=8081 \
  aquapump:latest
```

### With Environment File

```bash
# Create .env.docker
cp .env.example .env.docker

# Run with env file
docker run -p 8081:8081 --env-file .env.docker aquapump:latest
```

### Interactive Mode

```bash
# Run with shell
docker run -it -p 8081:8081 aquapump:latest /bin/sh

# Execute command in running container
docker exec -it <container-id> /bin/sh
```

## Docker Compose Commands

### Starting Services

```bash
# Start in foreground
docker-compose up

# Start in background
docker-compose up -d

# Start specific service
docker-compose up app

# Start with rebuild
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Stopping Services

```bash
# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove with volumes
docker-compose down -v

# Production
docker-compose -f docker-compose.prod.yml down
```

### Viewing Logs

```bash
# All services
docker-compose logs

# Follow logs
docker-compose logs -f

# Specific service
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app

# Production
docker-compose -f docker-compose.prod.yml logs -f
```

### Managing Services

```bash
# Restart services
docker-compose restart

# Restart specific service
docker-compose restart app

# View running services
docker-compose ps

# View service status
docker-compose ps app
```

## Health Checks

### Built-in Health Check

The Dockerfile includes:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8081/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

### Check Health Status

```bash
# View health status
docker ps

# Inspect health
docker inspect <container-id> | grep -A 10 Health

# Check health endpoint
curl http://localhost:8081/api/health
```

## Container Management

### List Containers

```bash
# Running containers
docker ps

# All containers
docker ps -a

# With filters
docker ps --filter "name=aquapump"
docker ps --filter "status=running"
```

### Container Logs

```bash
# View logs
docker logs <container-id>

# Follow logs
docker logs -f <container-id>

# Last 100 lines
docker logs --tail=100 <container-id>

# With timestamps
docker logs -t <container-id>
```

### Container Stats

```bash
# View resource usage
docker stats

# Specific container
docker stats <container-id>

# No streaming
docker stats --no-stream
```

### Inspect Container

```bash
# Full inspection
docker inspect <container-id>

# Specific field
docker inspect -f '{{.State.Status}}' <container-id>
docker inspect -f '{{.NetworkSettings.IPAddress}}' <container-id>
```

## Volume Management

### List Volumes

```bash
# All volumes
docker volume ls

# Inspect volume
docker volume inspect <volume-name>
```

### Clean Up Volumes

```bash
# Remove unused volumes
docker volume prune

# Remove specific volume
docker volume rm <volume-name>
```

## Image Management

### List Images

```bash
# All images
docker images

# With filters
docker images aquapump
docker images --filter "dangling=true"
```

### Remove Images

```bash
# Remove specific image
docker rmi aquapump:latest

# Remove all unused images
docker image prune -a

# Remove dangling images
docker image prune
```

### Tag Images

```bash
# Tag image
docker tag aquapump:latest aquapump:v1.0.0

# Tag for registry
docker tag aquapump:latest registry.example.com/aquapump:latest
```

### Push to Registry

```bash
# Login to registry
docker login registry.example.com

# Push image
docker push registry.example.com/aquapump:latest

# Push all tags
docker push --all-tags registry.example.com/aquapump
```

## Networking

### Container Networks

```bash
# List networks
docker network ls

# Inspect network
docker network inspect bridge

# Create network
docker network create aquapump-network

# Connect container to network
docker network connect aquapump-network <container-id>
```

### Network Communication

```bash
# Run on custom network
docker run --network aquapump-network aquapump:latest

# With Docker Compose (automatic network)
docker-compose up
```

## Environment Variables

### Setting Variables

```bash
# Single variable
docker run -e NODE_ENV=production aquapump:latest

# Multiple variables
docker run \
  -e NODE_ENV=production \
  -e PORT=8081 \
  -e CORS_ORIGIN=https://example.com \
  aquapump:latest

# From file
docker run --env-file .env.docker aquapump:latest
```

### Environment File Format

```bash
# .env.docker
NODE_ENV=production
PORT=8081
CORS_ORIGIN=https://example.com
EXPO_PUBLIC_API_URL=http://localhost:8081/api
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs <container-id>

# Check events
docker events --filter container=<container-id>

# Inspect container
docker inspect <container-id>

# Common fixes:
# 1. Port already in use - Change port mapping
# 2. Invalid environment variables - Check .env
# 3. Image pull failed - Check registry access
```

### Container Keeps Restarting

```bash
# Check restart policy
docker inspect -f '{{.HostConfig.RestartPolicy}}' <container-id>

# View logs
docker logs --tail=100 <container-id>

# Stop auto-restart
docker update --restart=no <container-id>
```

### High Resource Usage

```bash
# Check resource usage
docker stats <container-id>

# Set resource limits
docker run \
  --memory="2g" \
  --cpus="1.0" \
  aquapump:latest
```

### Network Issues

```bash
# Check container IP
docker inspect -f '{{.NetworkSettings.IPAddress}}' <container-id>

# Test connectivity
docker exec <container-id> ping -c 3 google.com

# Check port binding
docker port <container-id>
```

### Permission Issues

```bash
# Run as different user
docker run --user 1000:1000 aquapump:latest

# Fix ownership
docker exec <container-id> chown -R expouser:nodejs /usr/src/app
```

## Optimization

### Reduce Image Size

```bash
# Use multi-stage builds (already implemented)
# Remove unnecessary files
# Use .dockerignore

# Check image size
docker images aquapump
```

### Build Cache

```bash
# Use build cache
docker build -t aquapump:latest .

# Invalidate cache
docker build --no-cache -t aquapump:latest .

# Use BuildKit (faster)
DOCKER_BUILDKIT=1 docker build -t aquapump:latest .
```

### Layer Optimization

- Order commands by change frequency
- Combine RUN commands where possible
- Copy files in optimal order
- Use .dockerignore effectively

## Security

### Scan for Vulnerabilities

```bash
# Scan image
docker scan aquapump:latest

# Or use Trivy
trivy image aquapump:latest
```

### Security Best Practices

✅ Non-root user (implemented)
✅ Minimal base image
✅ No secrets in image
✅ Updated dependencies
✅ Health checks
✅ Resource limits

### Secrets Management

```bash
# Use Docker secrets (Swarm)
echo "secret-value" | docker secret create my-secret -

# Use environment variables
docker run -e SECRET_KEY=value aquapump:latest

# Use external secret manager (recommended for production)
```

## Monitoring

### Container Metrics

```bash
# Real-time stats
docker stats

# Export metrics
docker stats --no-stream --format "{{json .}}" > metrics.json
```

### Health Monitoring

```bash
# Check health
docker ps --filter health=healthy

# Health status
docker inspect --format='{{.State.Health.Status}}' <container-id>
```

## Cleanup

### Remove Containers

```bash
# Stop all containers
docker stop $(docker ps -aq)

# Remove all stopped containers
docker container prune

# Remove specific container
docker rm <container-id>

# Force remove running container
docker rm -f <container-id>
```

### Full Cleanup

```bash
# Remove everything unused
docker system prune -a

# Remove specific project
docker-compose down -v --rmi all

# Free up space
docker system df
```

## Production Deployment

### Best Practices

1. **Use specific tags** - Not :latest
2. **Set resource limits** - Memory and CPU
3. **Enable health checks** - Liveness and readiness
4. **Use restart policies** - unless-stopped or always
5. **Monitor logs** - Centralized logging
6. **Regular updates** - Security patches
7. **Backup strategy** - Data persistence
8. **Load balancing** - Multiple instances

### Example Production Setup

```bash
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    image: aquapump:v1.0.0
    ports:
      - "8081:8081"
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
      restart_policy:
        condition: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8081/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Scripts

Use provided scripts:

```bash
# Build and run
./scripts/docker-build.sh

# View logs
./scripts/logs.sh docker
```

## Support

For issues:
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [WSL Setup Guide](./WSL_SETUP.md)
- [Docker Documentation](https://docs.docker.com/)

## Quick Reference

| Task | Command |
|------|---------|
| Build | `docker build -t aquapump:latest .` |
| Run | `docker run -d -p 8081:8081 aquapump:latest` |
| Logs | `docker logs -f <container-id>` |
| Stop | `docker stop <container-id>` |
| Remove | `docker rm <container-id>` |
| Compose up | `docker-compose up -d` |
| Compose down | `docker-compose down` |
| Compose logs | `docker-compose logs -f` |
| Stats | `docker stats` |
| Cleanup | `docker system prune -a` |

---

**Next Steps:**
- [Kubernetes Guide](./KUBERNETES.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)
- [Monitoring](./MONITORING.md)
