# AquaPump Documentation Index

Complete, organized documentation for the AquaPump project.

## 📖 Documentation Structure

### 🚀 Getting Started (New Developers)
1. **[Getting Started](getting-started.md)** ⭐
   - 5-minute quick start
   - Prerequisites and setup
   - Environment configuration
   - First run instructions
   - Supabase setup
   - Troubleshooting basics

2. **[WSL Setup](wsl-setup.md)**
   - Fix localhost:8081 access on WSL
   - Network configuration
   - Firewall setup
   - Performance optimization
   - Alternative solutions

### 📦 Deployment (DevOps)
3. **[Deployment Guide](deployment.md)** ⭐
   - Docker Compose deployment
   - Kubernetes + Helm deployment
   - GitOps with Argo CD
   - DNS configuration
   - TLS/SSL setup
   - Environment-specific configs
   - Rollback procedures

4. **[GitOps Guide](gitops.md)**
   - Argo CD setup
   - GitHub Actions CI/CD
   - Automated deployment flow
   - Application management
   - Monitoring & notifications
   - Best practices

### 📚 Reference (Technical Details)
5. **[Architecture](architecture.md)** ⭐
   - System overview
   - Technology stack
   - Project structure
   - Data flow
   - Design patterns
   - Scalability
   - Security
   - High availability

6. **[API Reference](api.md)** ⭐
   - Health endpoints
   - tRPC procedures
   - Pumps API
   - Error handling
   - React Query integration
   - Testing APIs

7. **[Contributing](contributing.md)**
   - Development workflow
   - Code style guidelines
   - Pull request process
   - Adding new features
   - Documentation updates
   - Testing checklist

## 🎯 Quick Access by Role

### For New Developers

Start here:
1. [Getting Started](getting-started.md) - Set up your environment
2. [Architecture](architecture.md) - Understand the system
3. [API Reference](api.md) - Learn the APIs
4. [Contributing](contributing.md) - Start contributing

**Using WSL?** → [WSL Setup](wsl-setup.md)

### For DevOps Engineers

Start here:
1. [Deployment Guide](deployment.md) - Deploy the application
2. [GitOps Guide](gitops.md) - Set up CI/CD
3. [Architecture](architecture.md) - Understand infrastructure

### For Contributors

Start here:
1. [Contributing](contributing.md) - Development workflow
2. [Getting Started](getting-started.md) - Local setup
3. [API Reference](api.md) - Backend APIs
4. [Architecture](architecture.md) - System design

## 🔍 Find What You Need

### I want to...

| Task | Documentation |
|------|---------------|
| **Set up locally** | [Getting Started](getting-started.md) |
| **Fix WSL localhost issue** | [WSL Setup](wsl-setup.md) |
| **Deploy to production** | [Deployment Guide](deployment.md) |
| **Set up GitOps** | [GitOps Guide](gitops.md) |
| **Understand the system** | [Architecture](architecture.md) |
| **Use the API** | [API Reference](api.md) |
| **Contribute code** | [Contributing](contributing.md) |

### Common Questions

**Q: How do I start development?**
→ [Getting Started](getting-started.md)

**Q: Can't access localhost:8081 on WSL?**
→ [WSL Setup](wsl-setup.md)

**Q: How do I deploy to production?**
→ [Deployment Guide](deployment.md)

**Q: What APIs are available?**
→ [API Reference](api.md)

**Q: How do I contribute?**
→ [Contributing](contributing.md)

**Q: What's the system architecture?**
→ [Architecture](architecture.md)

## 📋 Documentation Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| [Getting Started](getting-started.md) | ✅ Complete | 2025-10-17 |
| [WSL Setup](wsl-setup.md) | ✅ Complete | 2025-10-17 |
| [Deployment Guide](deployment.md) | ✅ Complete | 2025-10-17 |
| [GitOps Guide](gitops.md) | ✅ Complete | 2025-10-17 |
| [Architecture](architecture.md) | ✅ Complete | 2025-10-17 |
| [API Reference](api.md) | ✅ Complete | 2025-10-17 |
| [Contributing](contributing.md) | ✅ Complete | 2025-10-17 |

## 🏗️ Project Overview

### What is AquaPump?

A production-ready, cross-platform application featuring:
- Modern React Native Web UI
- Type-safe tRPC APIs
- Supabase PostgreSQL database
- Kubernetes orchestration
- GitOps deployment with Argo CD
- Auto-scaling infrastructure

### Key Features

- ✨ Responsive design (web, iOS, Android)
- 🌓 Dark/light themes
- 🌍 Internationalization (EN/HE)
- 🤖 AI-powered chatbot
- 🚀 Production-ready infrastructure
- 🔄 Automated GitOps deployment
- 📊 Monitoring and observability

### Technology Stack

**Frontend:**
- React Native Web (Expo SDK 53)
- TypeScript (strict mode)
- React Query (server state)
- Context API (app state)

**Backend:**
- Hono.js (web framework)
- tRPC (type-safe APIs)
- Supabase (PostgreSQL)

**Infrastructure:**
- Docker (containers)
- Kubernetes (orchestration)
- Helm (package management)
- Argo CD (GitOps)
- NGINX Ingress (load balancing)

## 🚀 Quick Start

### 1. Development Setup

```bash
# Clone and install
git clone <repository-url>
cd aquapump
bun install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start development
bun run start-web
# Or on WSL: ./start-web-wsl.sh
```

### 2. Docker Development

```bash
docker-compose up
```

### 3. Production Deployment

```bash
cd scripts
./deploy-helm.sh production
```

See [Getting Started](getting-started.md) for detailed instructions.

## 📁 Project Structure

```
aquapump/
├── app/              # Expo Router pages
├── components/       # React components
├── contexts/         # State management
├── backend/          # Backend API
│   ├── services/     # Business logic
│   └── trpc/         # API routes
├── frontend/         # Frontend utilities
│   └── lib/          # Client libraries
├── infra/            # Infrastructure
│   ├── helm/         # Helm charts
│   ├── argocd/       # Argo CD configs
│   └── Dockerfile    # Container
├── scripts/          # Automation
└── docs/             # This documentation
```

## 🔗 External Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [tRPC Documentation](https://trpc.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Argo CD Documentation](https://argo-cd.readthedocs.io/)

## 💡 Tips

- **Start simple**: Begin with [Getting Started](getting-started.md)
- **Learn architecture**: Read [Architecture](architecture.md) early
- **Follow conventions**: Check [Contributing](contributing.md) before coding
- **Use GitOps**: Set up [Argo CD](gitops.md) for automated deployments
- **Monitor everything**: Use health checks and logging

## 🆘 Getting Help

1. **Check documentation** - You're in the right place!
2. **Search issues** - Look for similar problems
3. **Ask questions** - GitHub Discussions or Issues
4. **Contact support** - support@aquapump.com

## 📝 Contributing to Docs

Found an issue or want to improve docs?

1. Edit the relevant `.md` file
2. Follow markdown best practices
3. Submit a pull request
4. See [Contributing Guide](contributing.md)

## 📦 What's Included

### Core Documentation
- Getting Started Guide
- WSL Setup Guide
- Deployment Guide
- GitOps Guide
- Architecture Documentation
- API Reference
- Contributing Guide

### Additional Files
- Environment templates (`.env.example`)
- Docker configurations
- Kubernetes manifests
- Helm charts
- Argo CD applications
- Deployment scripts
- CI/CD workflows

## ✅ Documentation Checklist

When adding new features, update:
- [ ] [Getting Started](getting-started.md) - If setup changes
- [ ] [Deployment Guide](deployment.md) - If deployment changes
- [ ] [Architecture](architecture.md) - If design changes
- [ ] [API Reference](api.md) - If APIs change
- [ ] [Contributing](contributing.md) - If workflow changes

## 🎯 Next Steps

1. **New here?** → Start with [Getting Started](getting-started.md)
2. **Want to deploy?** → Read [Deployment Guide](deployment.md)
3. **Ready to contribute?** → Check [Contributing](contributing.md)
4. **Need help?** → Ask questions or contact support

---

**Documentation maintained by the AquaPump team**

*Last updated: 2025-10-17*
