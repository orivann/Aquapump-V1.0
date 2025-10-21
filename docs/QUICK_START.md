# AquaPump - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 20+
- Bun package manager
- Docker (for containerized deployment)
- kubectl (for Kubernetes deployment)

## Local Development

### 1. Install Dependencies
```bash
bun install
```

### 2. Start Development Server
```bash
bun run start-web
```

Access at: **http://localhost:8081**

## Docker Deployment

### Quick Start
```bash
# Build and run
docker-compose up

# Access at http://localhost:8081
```

### Production
```bash
# Build image
docker build -t aquapump:latest .

# Run production
docker-compose -f docker-compose.prod.yml up -d
```

## Kubernetes Deployment

### 1. Setup Secrets
```bash
cp kubernetes/secrets.yaml.example kubernetes/secrets.yaml
# Edit kubernetes/secrets.yaml with your values
```

### 2. Deploy
```bash
# Apply all configurations
kubectl apply -f kubernetes/

# Check status
kubectl get pods
```

### 3. Access Application
```bash
# Get service IP
kubectl get svc aquapump-service

# Or use port-forward for testing
kubectl port-forward svc/aquapump-service 8080:80
```

## Using Deployment Scripts

### Make Scripts Executable
```bash
chmod +x scripts/*.sh
```

### Deploy
```bash
./scripts/deploy.sh production
```

### View Logs
```bash
# Docker
./scripts/logs.sh docker

# Kubernetes
./scripts/logs.sh k8s
```

### Rollback
```bash
./scripts/rollback.sh
```

## Environment Configuration

### Development
```bash
cp .env.example .env
# Edit .env with your values
```

### Production
```bash
# Edit .env.production with production values
# Update kubernetes/secrets.yaml
# Update kubernetes/configmap.yaml
```

## Health Checks

```bash
# Check application health
curl http://localhost:8081/api/health

# Check readiness
curl http://localhost:8081/api/ready

# Check API status
curl http://localhost:8081/api
```

## Common Commands

### Docker
```bash
# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Rebuild
docker-compose up --build
```

### Kubernetes
```bash
# View pods
kubectl get pods

# View logs
kubectl logs -f deployment/aquapump-app

# Scale manually
kubectl scale deployment aquapump-app --replicas=5

# Check auto-scaling
kubectl get hpa

# Rollback
kubectl rollout undo deployment/aquapump-app
```

## Features

✅ **Cross-Platform**: Web, iOS, Android support
✅ **Responsive**: Desktop and mobile optimized
✅ **Themes**: Dark and light mode
✅ **i18n**: English and Hebrew support
✅ **AI Chatbot**: Integrated AI assistant
✅ **Production-Ready**: Docker + Kubernetes
✅ **Auto-Scaling**: HPA configured
✅ **Health Checks**: Liveness and readiness probes
✅ **Type-Safe**: Full TypeScript with strict mode
✅ **Modern Stack**: React Native Web, Expo, Hono, tRPC

## Project Structure

```
aquapump/
├── app/              # Pages (Expo Router)
├── components/       # React components
├── contexts/         # State management
├── constants/        # Constants & config
├── backend/          # Backend API (Hono + tRPC)
├── kubernetes/       # K8s manifests
├── scripts/          # Deployment scripts
└── Dockerfile        # Container definition
```

## Documentation

- **Production Guide**: [README.production.md](README.production.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Checklist**: [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
```

### Docker Issues
```bash
# Clean up
docker system prune -a

# Rebuild
docker-compose up --build
```

### Kubernetes Issues
```bash
# Check pod status
kubectl describe pod <pod-name>

# View events
kubectl get events --sort-by=.metadata.creationTimestamp

# Delete and redeploy
kubectl delete -f kubernetes/
kubectl apply -f kubernetes/
```

## Next Steps

1. ✅ Review [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)
2. ✅ Configure environment variables
3. ✅ Setup monitoring
4. ✅ Configure domain and SSL
5. ✅ Deploy to production
6. ✅ Monitor and maintain

## Support

For detailed information, see:
- Production deployment: [README.production.md](README.production.md)
- Architecture details: [ARCHITECTURE.md](ARCHITECTURE.md)
- Deployment steps: [DEPLOYMENT.md](DEPLOYMENT.md)

## License

Proprietary - AquaTech Group
