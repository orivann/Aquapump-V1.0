# AquaPump Production Deployment Guide

> **Note:** This is a reference to the main production documentation.
> See: `../README.production.md` for the complete guide.

This documentation has been organized into the `Docs/` directory for easier navigation.

## Quick Links

- **[Main Production Guide](../README.production.md)** - Complete production setup
- **[Architecture](./ARCHITECTURE.md)** - System architecture
- **[Deployment Steps](./DEPLOYMENT.md)** - Step-by-step deployment
- **[Kubernetes Setup](./KUBERNETES.md)** - K8s configuration
- **[Docker Setup](./DOCKER.md)** - Docker deployment
- **[Production Checklist](./PRODUCTION_CHECKLIST.md)** - Pre-deployment checklist

## Documentation Structure

All production-related documentation is available in this `Docs/` directory:

```
Docs/
├── README.md                   # Documentation index
├── QUICK_START.md             # 5-minute quick start
├── WSL_SETUP.md               # WSL-specific setup
├── TROUBLESHOOTING.md         # Common issues & solutions
├── ARCHITECTURE.md            # System architecture
├── DEPLOYMENT.md              # Deployment guide
├── PRODUCTION_CHECKLIST.md    # Pre-deployment checklist
├── PRODUCTION.md              # This file
├── KUBERNETES.md              # Kubernetes details
└── DOCKER.md                  # Docker details
```

## Quick Commands

### Local Development
```bash
bun run start-web
# Or for WSL:
./start-web-wsl.sh
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment
```bash
./scripts/deploy.sh production
```

## Need Help?

- **Getting Started**: [QUICK_START.md](./QUICK_START.md)
- **WSL Issues**: [WSL_SETUP.md](./WSL_SETUP.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Full Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

For the complete production guide with all details, see [README.production.md](../README.production.md)
