# AquaPump Documentation Index

Complete documentation for the AquaPump project - a production-ready React Native Web application.

## 📖 Table of Contents

### Getting Started
1. [Quick Start Guide](./QUICK_START.md) ⚡
2. [WSL Setup Guide](./WSL_SETUP.md) 🐧
3. [Development Guide](#development)

### Deployment
4. [Deployment Overview](./DEPLOYMENT.md) 🚀
5. [Docker Guide](./DOCKER.md) 🐳
6. [Kubernetes Guide](./KUBERNETES.md) ☸️
7. [Production Guide](./PRODUCTION.md) 🏭
8. [Production Checklist](./PRODUCTION_CHECKLIST.md) ✅

### Architecture & Design
9. [Architecture Overview](./ARCHITECTURE.md) 🏗️
10. [System Design](#system-design)
11. [API Documentation](#api-documentation)

### Operations
12. [Troubleshooting Guide](./TROUBLESHOOTING.md) 🔧
13. [Monitoring & Observability](#monitoring)
14. [Security Best Practices](#security)

### Reference
15. [Environment Variables](#environment-variables)
16. [Scripts Reference](#scripts)
17. [FAQ](#faq)

---

## 🎯 Quick Navigation

### I need to...

| Task | Documentation |
|------|---------------|
| **Start developing locally** | [Quick Start](./QUICK_START.md) |
| **Fix WSL localhost issue** | [WSL Setup](./WSL_SETUP.md) |
| **Deploy to production** | [Deployment Guide](./DEPLOYMENT.md) |
| **Use Docker** | [Docker Guide](./DOCKER.md) |
| **Use Kubernetes** | [Kubernetes Guide](./KUBERNETES.md) |
| **Troubleshoot issues** | [Troubleshooting](./TROUBLESHOOTING.md) |
| **Understand architecture** | [Architecture](./ARCHITECTURE.md) |
| **Prepare for deployment** | [Production Checklist](./PRODUCTION_CHECKLIST.md) |

---

## 📚 Documentation Details

### 1. Quick Start Guide
**File**: [QUICK_START.md](./QUICK_START.md)  
**Purpose**: Get up and running in 5 minutes  
**Covers**:
- Local development setup
- Docker quick start
- Kubernetes quick start
- Essential commands
- Health checks

**Start here if**: You're new to the project

---

### 2. WSL Setup Guide
**File**: [WSL_SETUP.md](./WSL_SETUP.md)  
**Purpose**: Fix localhost access issues in WSL  
**Covers**:
- WSL networking configuration
- Port binding solutions
- Firewall configuration
- Network troubleshooting
- Performance optimization

**Start here if**: Running from WSL and can't access localhost:8081

---

### 3. Deployment Guide
**File**: [DEPLOYMENT.md](./DEPLOYMENT.md)  
**Purpose**: Complete deployment instructions  
**Covers**:
- Docker deployment
- Kubernetes deployment
- Environment configuration
- Scaling strategies
- Rollback procedures

**Start here if**: Ready to deploy to production

---

### 4. Docker Guide
**File**: [DOCKER.md](./DOCKER.md)  
**Purpose**: Docker-specific deployment  
**Covers**:
- Dockerfile explanation
- Docker Compose usage
- Container management
- Image building and tagging
- Networking and volumes
- Troubleshooting Docker issues

**Start here if**: Deploying with Docker

---

### 5. Kubernetes Guide
**File**: [KUBERNETES.md](./KUBERNETES.md)  
**Purpose**: Kubernetes deployment and management  
**Covers**:
- K8s architecture
- Configuration files explained
- Deployment strategies
- Scaling and auto-scaling
- Monitoring and debugging
- Health checks and probes

**Start here if**: Deploying to Kubernetes

---

### 6. Production Guide
**File**: [PRODUCTION.md](./PRODUCTION.md)  
**Purpose**: Production deployment best practices  
**Covers**:
- Production architecture
- Security considerations
- Performance optimization
- Monitoring setup
- Backup strategies

**Start here if**: Preparing for production deployment

---

### 7. Production Checklist
**File**: [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)  
**Purpose**: Pre-deployment verification  
**Covers**:
- Code quality checks ✅
- Security checks ✅
- Performance checks ✅
- Configuration checks ✅
- Testing requirements ✅
- Post-deployment verification

**Start here if**: About to deploy to production

---

### 8. Architecture Overview
**File**: [ARCHITECTURE.md](./ARCHITECTURE.md)  
**Purpose**: System design and architecture  
**Covers**:
- Technology stack
- System architecture
- Data flow
- Component structure
- Deployment architecture
- Scalability design

**Start here if**: Want to understand system design

---

### 9. Troubleshooting Guide
**File**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)  
**Purpose**: Common issues and solutions  
**Covers**:
- Development issues
- Runtime errors
- Docker problems
- Kubernetes issues
- Performance problems
- Network issues
- Emergency procedures

**Start here if**: Encountering issues

---

## 🛠 Development

### Local Development Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd aquapump

# 2. Install dependencies
bun install

# 3. Create environment file
cp .env.example .env

# 4. Start development server
bun run start-web
```

**Access**: http://localhost:8081

### WSL Development

```bash
# Use the provided script
./start-web-wsl.sh
```

See [WSL Setup Guide](./WSL_SETUP.md) for details.

### Development Commands

```bash
# Start web server
bun run start-web

# Start with debug
bun run start-web-dev

# Lint code
bun run lint

# Type check
bunx tsc --noEmit
```

---

## 🏗 System Design

### Architecture Diagram

```
┌─────────────────────────────────────┐
│          Users (Web/Mobile)          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    Load Balancer / Ingress           │
│    (HTTPS/TLS Termination)           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       Kubernetes Service             │
└──────────────┬──────────────────────┘
               │
       ┌───────┼───────┐
       ▼       ▼       ▼
   ┌─────┐ ┌─────┐ ┌─────┐
   │Pod 1│ │Pod 2│ │Pod N│
   └─────┘ └─────┘ └─────┘
```

### Technology Stack

**Frontend**:
- React Native Web (Expo SDK 53)
- TypeScript (strict mode)
- Expo Router (file-based routing)
- React Query (server state)
- Context API (app state)

**Backend**:
- Hono.js (web framework)
- tRPC (type-safe API)
- Bun (runtime)

**Infrastructure**:
- Docker (containerization)
- Kubernetes (orchestration)
- Nginx Ingress (load balancing)

See [Architecture Overview](./ARCHITECTURE.md) for complete details.

---

## 📡 API Documentation

### Health Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/ready` | GET | Readiness check |
| `/api` | GET | API information |

### tRPC Endpoints

Base URL: `http://localhost:8081/api/trpc`

**Example**:
```typescript
// Client usage
const hiQuery = trpc.example.hi.useQuery();

// Direct call
const data = await trpcClient.example.hi.query();
```

### Testing Endpoints

```bash
# Health check
curl http://localhost:8081/api/health

# Readiness check
curl http://localhost:8081/api/ready

# API info
curl http://localhost:8081/api
```

---

## 📊 Monitoring

### Health Monitoring

```bash
# Check application health
curl http://localhost:8081/api/health

# Kubernetes health
kubectl get pods
kubectl describe pod <pod-name>
```

### Log Monitoring

```bash
# Docker logs
docker logs -f <container-id>

# Kubernetes logs
kubectl logs -f deployment/aquapump-app

# Using script
./scripts/logs.sh k8s
```

### Resource Monitoring

```bash
# Docker stats
docker stats

# Kubernetes metrics
kubectl top pods
kubectl top nodes

# HPA status
kubectl get hpa
```

---

## 🔒 Security

### Best Practices

✅ Non-root user in containers  
✅ HTTPS/TLS via Ingress  
✅ CORS properly configured  
✅ Secrets management  
✅ Environment variable security  
✅ Regular security updates  

### Secrets Management

**Local Development**:
```bash
# .env file (not committed)
cp .env.example .env
```

**Kubernetes**:
```bash
# Create secrets
kubectl create secret generic aquapump-secrets \
  --from-literal=AI_CHAT_KEY=your-key
```

### Security Scanning

```bash
# Scan Docker image
docker scan aquapump:latest

# Or use Trivy
trivy image aquapump:latest
```

---

## 🌍 Environment Variables

### Client-Side (EXPO_PUBLIC_*)

```bash
EXPO_PUBLIC_API_URL=http://localhost:8081/api
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com
EXPO_PUBLIC_AI_CHAT_KEY=sk-xxxxx
```

### Server-Side

```bash
NODE_ENV=development
PORT=8081
CORS_ORIGIN=*
```

### Configuration Files

- **Development**: `.env`
- **Production**: `.env.production`
- **Docker**: `.env.docker`
- **Kubernetes**: `kubernetes/secrets.yaml`

---

## 🔧 Scripts Reference

### Provided Scripts

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Deploy to production
./scripts/deploy.sh production

# View logs
./scripts/logs.sh k8s        # Kubernetes
./scripts/logs.sh docker     # Docker

# Rollback deployment
./scripts/rollback.sh

# Start WSL web server
./start-web-wsl.sh
```

### Script Locations

```
scripts/
├── deploy.sh      # Deployment automation
├── rollback.sh    # Rollback automation
└── logs.sh        # Log viewing

start-web-wsl.sh   # WSL startup script
```

---

## ❓ FAQ

### Q: How do I fix "Can't access localhost:8081" in WSL?

**A**: Use the provided script:
```bash
./start-web-wsl.sh
```

See [WSL Setup Guide](./WSL_SETUP.md) for details.

---

### Q: Port 8081 is already in use, how do I fix it?

**A**: Kill the process:
```bash
lsof -ti:8081 | xargs kill -9
```

---

### Q: How do I deploy to production?

**A**: Follow these steps:
1. Review [Production Checklist](./PRODUCTION_CHECKLIST.md)
2. Configure environment variables
3. Run deployment script: `./scripts/deploy.sh production`
4. Verify deployment
5. Monitor health endpoints

See [Deployment Guide](./DEPLOYMENT.md) for complete instructions.

---

### Q: How do I scale the application?

**A**: 
- **Manual**: `kubectl scale deployment aquapump-app --replicas=5`
- **Auto**: HPA is configured (2-10 replicas based on CPU/memory)

See [Kubernetes Guide](./KUBERNETES.md) for details.

---

### Q: How do I rollback a deployment?

**A**:
```bash
# Using script
./scripts/rollback.sh

# Or manually
kubectl rollout undo deployment/aquapump-app
```

---

### Q: Where are the health check endpoints?

**A**:
- Health: `GET /api/health`
- Readiness: `GET /api/ready`
- Info: `GET /api`

---

### Q: How do I view logs?

**A**:
```bash
# Docker
docker logs -f <container-id>

# Kubernetes
kubectl logs -f deployment/aquapump-app

# Using scripts
./scripts/logs.sh k8s
./scripts/logs.sh docker
```

---

## 📞 Support & Resources

### Documentation
- [Quick Start](./QUICK_START.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Architecture](./ARCHITECTURE.md)

### External Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Docker Docs](https://docs.docker.com/)

### Project Files
- Main README: [../README.md](../README.md)
- Package Info: [../package.json](../package.json)
- App Config: [../app.json](../app.json)

---

## 🎯 Next Steps

### For New Developers
1. ✅ Read [Quick Start Guide](./QUICK_START.md)
2. ✅ Set up local development
3. ✅ Review [Architecture](./ARCHITECTURE.md)
4. ✅ Explore the codebase

### For DevOps
1. ✅ Review [Production Checklist](./PRODUCTION_CHECKLIST.md)
2. ✅ Configure environment variables
3. ✅ Review [Deployment Guide](./DEPLOYMENT.md)
4. ✅ Set up monitoring
5. ✅ Deploy to production

### For Troubleshooting
1. ✅ Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. ✅ Review logs
3. ✅ Check health endpoints
4. ✅ Verify configuration

---

## 📋 Documentation Checklist

- [x] Quick Start Guide
- [x] WSL Setup Guide
- [x] Deployment Guide
- [x] Docker Guide
- [x] Kubernetes Guide
- [x] Production Guide
- [x] Production Checklist
- [x] Architecture Overview
- [x] Troubleshooting Guide
- [x] Documentation Index

---

## 🏆 Project Status

✅ **Production Ready**

- Code quality verified
- Security hardened
- Performance optimized
- Documentation complete
- Deployment automated
- Monitoring configured

**Ready for deployment!** 🚀

---

*Last Updated: 2025-01-16*  
*Version: 1.0.0*  
*AquaPump by AquaTech Group*
