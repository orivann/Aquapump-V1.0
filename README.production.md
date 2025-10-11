# AquaPump - Production Deployment Guide

## Overview
This is a production-ready React Native Web application built with Expo, designed for deployment using Docker and Kubernetes.

## Architecture
- **Frontend**: React Native Web (Expo)
- **Backend**: Hono.js with tRPC
- **State Management**: React Query + Context API
- **Styling**: React Native StyleSheet
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Prerequisites
- Node.js 20+
- Bun (package manager)
- Docker & Docker Compose
- Kubernetes cluster (for K8s deployment)
- kubectl CLI

## Environment Variables

### Development
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Production
Update `.env.production` with your production values:
- `EXPO_PUBLIC_API_URL`: Your production API URL
- `CORS_ORIGIN`: Your production domain(s)

## Local Development

### Standard Development
```bash
bun install
bun run start-web
```

### Docker Development
```bash
bun run docker:build
bun run docker:run
```

Access at: http://localhost:8081

## Production Deployment

### Docker Deployment

#### Build Image
```bash
docker build -t aquapump:latest .
```

#### Run with Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### Stop Services
```bash
docker-compose down
```

### Kubernetes Deployment

#### 1. Create Secrets
```bash
# Copy and edit the secrets file
cp kubernetes/secrets.yaml.example kubernetes/secrets.yaml
# Edit kubernetes/secrets.yaml with your actual secrets

# Apply secrets
kubectl apply -f kubernetes/secrets.yaml
```

#### 2. Apply ConfigMap
```bash
kubectl apply -f kubernetes/configmap.yaml
```

#### 3. Deploy Application
```bash
kubectl apply -f kubernetes/deployment.yaml
```

#### 4. Setup Ingress (Optional)
```bash
kubectl apply -f kubernetes/ingress.yaml
```

#### 5. Enable Auto-scaling
```bash
kubectl apply -f kubernetes/hpa.yaml
```

#### Quick Deploy All
```bash
bun run k8s:apply
```

#### Remove All Resources
```bash
bun run k8s:delete
```

## Kubernetes Configuration

### Deployment Features
- **Replicas**: 3 (configurable)
- **Resource Limits**: 2Gi memory, 1 CPU
- **Health Checks**: Liveness, Readiness, and Startup probes
- **Auto-scaling**: HPA configured (2-10 replicas)
- **Load Balancing**: Service with LoadBalancer type

### Monitoring Endpoints
- Health: `GET /api/health`
- Readiness: `GET /api/ready`
- Status: `GET /api`

### Scaling
The HPA automatically scales based on:
- CPU utilization (target: 70%)
- Memory utilization (target: 80%)
- Min replicas: 2
- Max replicas: 10

## Security Features

### Docker
- Multi-stage builds for smaller images
- Non-root user execution
- Health checks included
- Production dependencies only

### Kubernetes
- Resource limits and requests
- Health probes for reliability
- TLS/SSL support via Ingress
- ConfigMaps for non-sensitive config
- Secrets for sensitive data

## Performance Optimizations

### Frontend
- React.memo for component optimization
- useMemo and useCallback for expensive operations
- Lazy loading where applicable
- Optimized images and assets

### Backend
- CORS configured for production
- Request logging
- Error handling middleware
- Health check endpoints

## Monitoring & Logging

### Application Logs
```bash
# Docker
docker-compose logs -f app

# Kubernetes
kubectl logs -f deployment/aquapump-app
```

### Health Checks
```bash
# Docker
curl http://localhost:8081/api/health

# Kubernetes
kubectl get pods
kubectl describe pod <pod-name>
```

## Troubleshooting

### Docker Issues
```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild
docker-compose up --build
```

### Kubernetes Issues
```bash
# Check pod status
kubectl get pods

# View pod logs
kubectl logs <pod-name>

# Describe pod for events
kubectl describe pod <pod-name>

# Check service
kubectl get svc aquapump-service

# Check ingress
kubectl get ingress
```

## CI/CD Integration

### Build Pipeline
1. Run type checking: `bun run type-check`
2. Run linting: `bun run lint`
3. Build Docker image: `docker build -t aquapump:${VERSION} .`
4. Push to registry: `docker push aquapump:${VERSION}`
5. Update K8s deployment: `kubectl set image deployment/aquapump-app aquapump-app=aquapump:${VERSION}`

### Recommended CI/CD Tools
- GitHub Actions
- GitLab CI
- Jenkins
- ArgoCD (for GitOps)

## Backup & Recovery

### Database Backups (if applicable)
Configure regular backups of any persistent data.

### Configuration Backups
Keep your Kubernetes manifests in version control.

## Support & Maintenance

### Regular Updates
- Update dependencies regularly
- Monitor security advisories
- Keep Docker base images updated
- Update Kubernetes cluster

### Performance Monitoring
- Monitor resource usage
- Track response times
- Set up alerts for failures
- Review logs regularly

## License
Proprietary - AquaTech Group

## Contact
For support, contact: support@aquatech.com
