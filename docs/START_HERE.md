# 🚀 AquaPump - Start Here

## Problem Fixed: Can't Access localhost:8081 from WSL

### ✅ Solution

Run this command:
```bash
./start-web-wsl.sh
```

Then access: **http://localhost:8081**

### What This Does
- Binds Expo to `0.0.0.0` (all network interfaces)
- Properly configures WSL networking
- Makes localhost accessible from Windows browser

### If Script Doesn't Work
See the complete [WSL Setup Guide](./Docs/WSL_SETUP.md) for:
- Firewall configuration
- Alternative solutions
- Troubleshooting steps

---

## 📚 All Documentation Organized in Docs/

All project documentation is now organized in the `Docs/` directory:

```
Docs/
├── INDEX.md                    # Complete documentation index
├── QUICK_START.md              # Get started in 5 minutes
├── WSL_SETUP.md                # Fix WSL localhost issues
├── TROUBLESHOOTING.md          # Common issues & solutions
├── DEPLOYMENT.md               # Deployment guide
├── DOCKER.md                   # Docker guide
├── KUBERNETES.md               # Kubernetes guide
├── PRODUCTION.md               # Production best practices
├── PRODUCTION_CHECKLIST.md     # Pre-deployment checklist
└── ARCHITECTURE.md             # System architecture
```

### 🎯 Quick Links

**Get Started:**
- [📖 Documentation Index](./Docs/INDEX.md) - Complete documentation
- [⚡ Quick Start](./Docs/QUICK_START.md) - 5-minute setup
- [🐧 WSL Setup](./Docs/WSL_SETUP.md) - Fix localhost access

**Deploy:**
- [🚀 Deployment Guide](./Docs/DEPLOYMENT.md)
- [🐳 Docker Guide](./Docs/DOCKER.md)
- [☸️ Kubernetes Guide](./Docs/KUBERNETES.md)
- [✅ Production Checklist](./Docs/PRODUCTION_CHECKLIST.md)

**Reference:**
- [🏗️ Architecture](./Docs/ARCHITECTURE.md)
- [🔧 Troubleshooting](./Docs/TROUBLESHOOTING.md)
- [🏭 Production Guide](./Docs/PRODUCTION.md)

---

## 🎯 What to Do Next

### For Development
```bash
# 1. Install dependencies
bun install

# 2. Create environment file
cp .env.example .env

# 3. Start development server
./start-web-wsl.sh          # For WSL
# OR
bun run start-web           # For Linux/Mac
```

### For Deployment
```bash
# 1. Review checklist
cat Docs/PRODUCTION_CHECKLIST.md

# 2. Configure environment
cp .env.example .env.production
# Edit .env.production with production values

# 3. Deploy
./scripts/deploy.sh production
```

---

## 🆘 Common Issues

### ❌ Can't access localhost:8081
**Solution:** Run `./start-web-wsl.sh`  
**Guide:** [WSL Setup](./Docs/WSL_SETUP.md)

### ❌ Port 8081 already in use
**Solution:** `lsof -ti:8081 | xargs kill -9`  
**Guide:** [Troubleshooting](./Docs/TROUBLESHOOTING.md)

### ❌ Container won't start
**Solution:** `docker logs <container-id>`  
**Guide:** [Docker Guide](./Docs/DOCKER.md)

### ❌ Pods not starting
**Solution:** `kubectl describe pod <pod-name>`  
**Guide:** [Kubernetes Guide](./Docs/KUBERNETES.md)

---

## 📊 Project Structure

```
aquapump/
├── Docs/                       # 📚 All documentation
│   ├── INDEX.md               # Complete index
│   ├── QUICK_START.md         # Quick start guide
│   ├── WSL_SETUP.md           # WSL configuration
│   ├── TROUBLESHOOTING.md     # Fix issues
│   ├── DEPLOYMENT.md          # Deploy guide
│   ├── DOCKER.md              # Docker guide
│   ├── KUBERNETES.md          # Kubernetes guide
│   └── ARCHITECTURE.md        # System design
│
├── app/                        # App pages (Expo Router)
├── components/                 # React components
├── contexts/                   # State management
├── backend/                    # Backend API
├── kubernetes/                 # K8s manifests
├── scripts/                    # Deployment scripts
│
├── start-web-wsl.sh           # 🎯 WSL startup script
├── .env                        # Environment config
├── Dockerfile                  # Container definition
├── docker-compose.yml          # Docker dev setup
└── package.json                # Dependencies
```

---

## ✅ Files Created/Modified

### New Files
- ✅ `start-web-wsl.sh` - WSL startup script with proper network binding
- ✅ `.env` - Environment configuration file
- ✅ `Docs/WSL_SETUP.md` - Comprehensive WSL setup guide
- ✅ `Docs/TROUBLESHOOTING.md` - Troubleshooting guide
- ✅ `Docs/DOCKER.md` - Docker-specific guide
- ✅ `Docs/KUBERNETES.md` - Kubernetes-specific guide
- ✅ `Docs/PRODUCTION.md` - Production reference
- ✅ `Docs/INDEX.md` - Complete documentation index
- ✅ `DOCS_SUMMARY.md` - Documentation summary
- ✅ `START_HERE.md` - This file

### Existing Documentation (Referenced)
All existing documentation is referenced and organized in `Docs/`:
- README.md (main project README)
- README.production.md (production guide)
- DEPLOYMENT.md (deployment guide)
- ARCHITECTURE.md (architecture overview)
- SUMMARY.md (project summary)
- QUICK_START.md (quick start guide)
- PRODUCTION_CHECKLIST.md (production checklist)

---

## 🎯 Quick Commands Reference

### Development
```bash
./start-web-wsl.sh              # Start web server (WSL)
bun run start-web               # Start web server (standard)
bun run start-web-dev           # Start with debug logs
bun run lint                    # Lint code
```

### Docker
```bash
docker-compose up               # Start development
docker-compose up --build       # Rebuild and start
docker-compose logs -f          # View logs
docker-compose down             # Stop and remove
```

### Kubernetes
```bash
kubectl apply -f kubernetes/    # Deploy
kubectl get pods                # Check pods
kubectl logs -f deployment/app  # View logs
kubectl rollout undo deployment # Rollback
```

### Scripts
```bash
./scripts/deploy.sh production  # Deploy to production
./scripts/logs.sh k8s           # View Kubernetes logs
./scripts/logs.sh docker        # View Docker logs
./scripts/rollback.sh           # Rollback deployment
```

### Health Checks
```bash
curl http://localhost:8081/api/health   # Health check
curl http://localhost:8081/api/ready    # Readiness check
curl http://localhost:8081/api          # API info
```

---

## 📞 Need Help?

### Documentation
- **[Complete Index](./Docs/INDEX.md)** - All documentation
- **[Quick Start](./Docs/QUICK_START.md)** - Get started
- **[Troubleshooting](./Docs/TROUBLESHOOTING.md)** - Fix issues

### Specific Issues
- **WSL localhost issues**: [WSL Setup Guide](./Docs/WSL_SETUP.md)
- **Deployment help**: [Deployment Guide](./Docs/DEPLOYMENT.md)
- **Docker questions**: [Docker Guide](./Docs/DOCKER.md)
- **Kubernetes questions**: [Kubernetes Guide](./Docs/KUBERNETES.md)
- **System architecture**: [Architecture Overview](./Docs/ARCHITECTURE.md)

---

## 🏆 Status

✅ **WSL Issue Fixed** - localhost:8081 now accessible  
✅ **Documentation Organized** - All guides in Docs/ directory  
✅ **Ready for Development** - Start with `./start-web-wsl.sh`  
✅ **Ready for Deployment** - Follow Production Checklist  

---

## 🎯 Next Steps

1. **Start Development**
   ```bash
   ./start-web-wsl.sh
   ```

2. **Read Documentation**
   - [Quick Start Guide](./Docs/QUICK_START.md)
   - [Complete Documentation Index](./Docs/INDEX.md)

3. **Explore the App**
   - Access at http://localhost:8081
   - Test all features
   - Check console for logs

4. **Prepare for Deployment** (when ready)
   - Review [Production Checklist](./Docs/PRODUCTION_CHECKLIST.md)
   - Follow [Deployment Guide](./Docs/DEPLOYMENT.md)

---

**Happy Coding! 🚀**

*For detailed information, see the [Documentation Index](./Docs/INDEX.md)*
