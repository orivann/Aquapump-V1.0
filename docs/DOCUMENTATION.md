# Documentation Guide

The AquaPump documentation has been completely refactored into a clean, unified system.

## Quick Start

📖 **[Start with docs/INDEX.md](docs/INDEX.md)** - Complete documentation index

## New Documentation Structure

All documentation is now in the `docs/` directory:

```
docs/
├── INDEX.md              # Documentation index & navigation
├── getting-started.md    # Quick start guide (5 minutes)
├── wsl-setup.md         # WSL localhost fix
├── deployment.md        # Complete deployment guide
├── gitops.md           # CI/CD with Argo CD
├── architecture.md      # System design overview
├── api.md              # API reference
└── contributing.md      # Contributing guidelines
```

## What Was Changed

### Consolidated Documentation

**Before:**
- 30+ scattered documentation files
- Multiple `Docs/` and `docs/` directories
- Duplicate and conflicting information
- No clear structure or navigation

**After:**
- 8 well-organized documentation files
- Single `docs/` directory (lowercase)
- No duplication
- Clear navigation and index

### What Was Removed

All redundant files were deleted:
- `QUICK_START.md`, `START_HERE.md`, `SETUP_COMPLETE.md`
- `SUMMARY.md`, `DOCS_SUMMARY.md`, `REFACTOR_SUMMARY.md`
- `QA.md`, `CHANGELOG.md`
- `README.production.md`, `DEPLOYMENT.md`, `ARCHITECTURE.md`
- `PRODUCTION_CHECKLIST.md`, `DEPLOYMENT_GUIDE.md`
- Entire `Docs/` directory (uppercase)
- Old `docs/` files (ARCHITECTURE.md, GITOPS.md, etc.)

### What Was Created

New, comprehensive documentation:

1. **[docs/INDEX.md](docs/INDEX.md)** - Complete documentation index
2. **[docs/getting-started.md](docs/getting-started.md)** - Unified quick start
3. **[docs/wsl-setup.md](docs/wsl-setup.md)** - WSL-specific guide
4. **[docs/deployment.md](docs/deployment.md)** - Complete deployment guide
5. **[docs/gitops.md](docs/gitops.md)** - GitOps workflow
6. **[docs/architecture.md](docs/architecture.md)** - System architecture
7. **[docs/api.md](docs/api.md)** - API reference
8. **[docs/contributing.md](docs/contributing.md)** - Contributing guide

## How to Use

### For New Developers

1. Read [docs/INDEX.md](docs/INDEX.md) for navigation
2. Follow [docs/getting-started.md](docs/getting-started.md) to set up
3. Understand [docs/architecture.md](docs/architecture.md)
4. Check [docs/api.md](docs/api.md) for APIs

**Using WSL?** See [docs/wsl-setup.md](docs/wsl-setup.md)

### For DevOps

1. Review [docs/deployment.md](docs/deployment.md)
2. Set up [docs/gitops.md](docs/gitops.md)
3. Understand [docs/architecture.md](docs/architecture.md)

### For Contributors

1. Read [docs/contributing.md](docs/contributing.md)
2. Set up with [docs/getting-started.md](docs/getting-started.md)
3. Reference [docs/api.md](docs/api.md)

## Key Documentation Files

### [docs/INDEX.md](docs/INDEX.md) ⭐
- Complete documentation index
- Navigation by role (developer, DevOps, contributor)
- Quick access table
- Common questions answered

### [docs/getting-started.md](docs/getting-started.md) ⭐
- 5-minute quick start
- Prerequisites and setup
- Environment configuration
- Supabase setup
- Development commands
- Troubleshooting

### [docs/deployment.md](docs/deployment.md) ⭐
- Docker Compose deployment
- Kubernetes + Helm deployment
- GitOps with Argo CD
- DNS and TLS configuration
- Environment-specific configs
- Rollback procedures

### [docs/architecture.md](docs/architecture.md) ⭐
- High-level architecture diagram
- Technology stack details
- Project structure
- Data flow
- Design patterns
- Scalability & security
- High availability

### [docs/api.md](docs/api.md) ⭐
- Health endpoints
- tRPC procedures
- Pumps API (CRUD)
- Error handling
- React Query integration
- Testing examples

### [docs/contributing.md](docs/contributing.md)
- Development workflow
- Code style guidelines
- TypeScript best practices
- Pull request process
- Adding new features
- Testing checklist

### [docs/wsl-setup.md](docs/wsl-setup.md)
- Fix localhost:8081 access on WSL
- Network configuration
- Firewall setup
- Performance optimization
- Troubleshooting

### [docs/gitops.md](docs/gitops.md)
- GitOps workflow explanation
- Argo CD setup
- GitHub Actions CI/CD
- Application management
- Monitoring & notifications

## Benefits

### For Developers
✅ Single source of truth  
✅ Easy to find information  
✅ Clear navigation  
✅ Comprehensive examples  
✅ No duplicate/conflicting info

### For DevOps
✅ Complete deployment guide  
✅ GitOps workflow documented  
✅ Infrastructure as Code examples  
✅ Rollback procedures  
✅ Production best practices

### For Contributors
✅ Clear contribution guidelines  
✅ Code style standards  
✅ Development workflow  
✅ Testing requirements  
✅ Documentation standards

## Migration Guide

### If You Were Using Old Docs

| Old File | New Location |
|----------|--------------|
| `START_HERE.md` | [docs/INDEX.md](docs/INDEX.md) |
| `QUICK_START.md` | [docs/getting-started.md](docs/getting-started.md) |
| `Docs/WSL_SETUP.md` | [docs/wsl-setup.md](docs/wsl-setup.md) |
| `DEPLOYMENT.md` | [docs/deployment.md](docs/deployment.md) |
| `ARCHITECTURE.md` | [docs/architecture.md](docs/architecture.md) |
| `docs/GITOPS.md` | [docs/gitops.md](docs/gitops.md) |
| `README.production.md` | [docs/deployment.md](docs/deployment.md) |

### Bookmarks to Update

If you had bookmarked old documentation:
- Update to new `docs/` directory
- Start with [docs/INDEX.md](docs/INDEX.md) for navigation

## Maintaining Documentation

### When to Update Docs

Update relevant documentation when:
- Adding new features
- Changing APIs
- Updating deployment process
- Fixing bugs that need explanation
- Changing architecture

### Which File to Update

| Change Type | Update File |
|-------------|-------------|
| Setup process | [docs/getting-started.md](docs/getting-started.md) |
| Deployment process | [docs/deployment.md](docs/deployment.md) |
| API changes | [docs/api.md](docs/api.md) |
| Architecture changes | [docs/architecture.md](docs/architecture.md) |
| Contributing process | [docs/contributing.md](docs/contributing.md) |
| GitOps workflow | [docs/gitops.md](docs/gitops.md) |
| WSL issues | [docs/wsl-setup.md](docs/wsl-setup.md) |

### Documentation Standards

- **Clear and concise** - Get to the point
- **Code examples** - Show, don't just tell
- **Step-by-step** - Easy to follow
- **Screenshots** - When helpful
- **Keep updated** - Review regularly

## Quick Commands Reference

All commands are documented in detail in respective guides. Here's a quick reference:

### Development
```bash
bun run start-web          # Start development
./start-web-wsl.sh        # Start on WSL
bunx tsc --noEmit         # Type check
bun run lint              # Lint code
```

### Docker
```bash
docker-compose up          # Development
docker-compose -f docker-compose.prod.yml up -d  # Production
```

### Kubernetes
```bash
cd scripts
./deploy-helm.sh production   # Deploy
./logs.sh k8s                # View logs
```

### Health Checks
```bash
curl http://localhost:8081/api/health
curl http://localhost:8081/api/ready
```

## Getting Help

1. **Check [docs/INDEX.md](docs/INDEX.md)** - Start here
2. **Search documentation** - Use your editor's search
3. **GitHub Issues** - Report problems
4. **Email** - support@aquapump.com

## Contributing to Documentation

To improve documentation:

1. Edit files in `docs/` directory
2. Follow markdown best practices
3. Update [docs/INDEX.md](docs/INDEX.md) if needed
4. Submit pull request
5. See [docs/contributing.md](docs/contributing.md)

## Summary

✅ All documentation in one place (`docs/`)  
✅ Clear, logical organization  
✅ Easy navigation with INDEX.md  
✅ No duplication or confusion  
✅ Comprehensive and maintainable  

**Start here:** [docs/INDEX.md](docs/INDEX.md)

---

*Documentation refactored: 2025-10-17*
