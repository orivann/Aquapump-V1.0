# AquaPump Architecture

## System Overview

AquaPump is a modern, production-ready web application built with React Native Web and Expo, designed for cross-platform compatibility (web, iOS, Android) with a focus on web and desktop deployment.

## Technology Stack

### Frontend
- **Framework**: React Native Web (Expo SDK 53)
- **Language**: TypeScript (strict mode)
- **Routing**: Expo Router (file-based)
- **State Management**:
  - React Query (server state)
  - Context API with @nkzw/create-context-hook (app state)
  - AsyncStorage (persistence)
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native
- **UI Components**: Custom components with theme support

### Backend
- **Framework**: Hono.js
- **API**: tRPC (type-safe API)
- **Runtime**: Bun
- **Middleware**: CORS, Logger, Error handling

### Infrastructure
- **Containerization**: Docker (multi-stage builds)
- **Orchestration**: Kubernetes
- **Load Balancing**: Kubernetes Service (LoadBalancer)
- **Auto-scaling**: Horizontal Pod Autoscaler
- **Ingress**: NGINX Ingress Controller

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                                │
│                    (Web, Mobile, Desktop)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer / Ingress                   │
│                    (HTTPS/TLS Termination)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Kubernetes Service                          │
│                  (ClusterIP/LoadBalancer)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌────────┐      ┌────────┐      ┌────────┐
    │  Pod 1 │      │  Pod 2 │      │  Pod N │
    │        │      │        │      │        │
    │ Expo   │      │ Expo   │      │ Expo   │
    │ Server │      │ Server │      │ Server │
    │        │      │        │      │        │
    │ Hono   │      │ Hono   │      │ Hono   │
    │ tRPC   │      │ tRPC   │      │ tRPC   │
    └────────┘      └────────┘      └────────┘
         │               │               │
         └───────────────┼───────────────┘
                         ▼
              ┌──────────────────────┐
              │  External Services   │
              │  - AI Toolkit        │
              │  - Analytics         │
              └──────────────────────┘
```

## Application Structure

```
aquapump/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Home page
│   ├── pumps.tsx                # Pumps page
│   └── +not-found.tsx           # 404 page
├── components/                   # React components
│   ├── Navigation.tsx           # Top navigation
│   ├── Hero.tsx                 # Hero section
│   ├── About.tsx                # About section
│   ├── Technology.tsx           # Technology section
│   ├── Products.tsx             # Products section
│   ├── Contact.tsx              # Contact section
│   ├── Chatbot.tsx              # AI chatbot
│   ├── CursorTrail.tsx          # Visual effects
│   └── WaterRipple.tsx          # Visual effects
├── contexts/                     # React contexts
│   ├── LanguageContext.tsx      # i18n state
│   └── ThemeContext.tsx         # Theme state
├── constants/                    # Constants
│   ├── colors.ts                # Color palette
│   ├── theme.ts                 # Theme definitions
│   └── translations.ts          # i18n strings
├── backend/                      # Backend code
│   ├── hono.ts                  # Hono server
│   └── trpc/                    # tRPC routes
│       ├── app-router.ts        # Main router
│       ├── create-context.ts    # Context creator
│       └── routes/              # API routes
├── kubernetes/                   # K8s manifests
│   ├── deployment.yaml          # Deployment & Service
│   ├── configmap.yaml           # Configuration
│   ├── secrets.yaml.example     # Secrets template
│   ├── hpa.yaml                 # Auto-scaling
│   ├── ingress.yaml             # Ingress rules
│   └── namespace.yaml           # Namespace
├── scripts/                      # Deployment scripts
│   ├── deploy.sh                # Deployment script
│   ├── rollback.sh              # Rollback script
│   └── logs.sh                  # Logs viewer
├── Dockerfile                    # Multi-stage build
├── docker-compose.yml           # Dev compose
├── docker-compose.prod.yml      # Prod compose
└── package.json                 # Dependencies
```

## Data Flow

### Client-Side Rendering
1. User accesses application
2. Expo serves React Native Web bundle
3. React hydrates the application
4. Context providers initialize (Theme, Language)
5. Components render with initial state
6. User interactions trigger state updates

### API Communication
1. Component calls tRPC hook
2. React Query manages request lifecycle
3. tRPC client sends typed request to backend
4. Hono server routes to appropriate handler
5. tRPC procedure executes business logic
6. Response sent back to client
7. React Query updates cache
8. Component re-renders with new data

### State Management Flow
```
User Action
    ↓
Component Event Handler
    ↓
Context Hook (useTheme, useLanguage)
    ↓
State Update (useState)
    ↓
AsyncStorage (persistence)
    ↓
Component Re-render
```

## Deployment Architecture

### Docker Container
- **Base Image**: node:20-slim
- **User**: Non-root (expouser)
- **Port**: 8081
- **Health Check**: HTTP GET /api/health
- **Stages**: deps → builder → runner

### Kubernetes Deployment
- **Replicas**: 3 (configurable)
- **Strategy**: RollingUpdate
- **Resources**:
  - Requests: 512Mi memory, 250m CPU
  - Limits: 2Gi memory, 1000m CPU
- **Probes**:
  - Liveness: /api/health
  - Readiness: /api/ready
  - Startup: /api/health

### Auto-scaling
- **Min Replicas**: 2
- **Max Replicas**: 10
- **Metrics**:
  - CPU: 70% target
  - Memory: 80% target
- **Behavior**: Gradual scale-up, conservative scale-down

## Security Architecture

### Network Security
- HTTPS/TLS via Ingress
- CORS configured for specific origins
- Rate limiting via Ingress annotations

### Container Security
- Non-root user execution
- Minimal base image
- No unnecessary packages
- Security scanning ready

### Secrets Management
- Kubernetes Secrets for sensitive data
- Environment variables for configuration
- No hardcoded credentials
- .gitignore for local secrets

## Performance Optimizations

### Frontend
- React.memo for expensive components
- useMemo for computed values
- useCallback for event handlers
- Lazy loading where applicable
- Optimized re-renders

### Backend
- Efficient request handling
- Proper error handling
- Request logging for monitoring
- Health check endpoints

### Infrastructure
- Horizontal scaling
- Load balancing
- Resource limits
- Auto-scaling policies
- CDN-ready (static assets)

## Monitoring & Observability

### Health Checks
- `/api/health` - Application health
- `/api/ready` - Readiness status
- `/api` - API information

### Logging
- Application logs via console
- Hono logger middleware
- Kubernetes pod logs
- Centralized logging ready

### Metrics
- Kubernetes metrics
- Resource usage
- Request rates
- Error rates
- Auto-scaling metrics

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- No local state dependencies
- Session-less architecture
- Load balancer distribution

### Vertical Scaling
- Resource limits configurable
- Memory and CPU adjustable
- Container resources tunable

### Database Scaling (Future)
- Connection pooling ready
- Read replicas support
- Caching layer ready

## High Availability

### Redundancy
- Multiple pod replicas
- Load balancer distribution
- Health check monitoring
- Auto-restart on failure

### Disaster Recovery
- Rollback capability
- Version history
- Configuration backups
- Infrastructure as Code

## Future Enhancements

### Planned Features
- [ ] Database integration
- [ ] Redis caching
- [ ] Message queue
- [ ] WebSocket support
- [ ] Advanced analytics
- [ ] A/B testing framework

### Infrastructure Improvements
- [ ] Multi-region deployment
- [ ] CDN integration
- [ ] Advanced monitoring (Prometheus/Grafana)
- [ ] Distributed tracing
- [ ] Service mesh (Istio)
- [ ] GitOps (ArgoCD)

## Development Workflow

### Local Development
```bash
bun install
bun run start-web
```

### Docker Development
```bash
docker-compose up
```

### Production Deployment
```bash
./scripts/deploy.sh production
```

## Testing Strategy

### Unit Tests (Future)
- Component testing
- Hook testing
- Utility function testing

### Integration Tests (Future)
- API endpoint testing
- E2E user flows
- Cross-browser testing

### Load Tests (Future)
- Performance benchmarking
- Stress testing
- Auto-scaling verification

## Maintenance

### Regular Tasks
- Dependency updates
- Security patches
- Performance monitoring
- Log review
- Backup verification

### Monitoring Checklist
- [ ] Check pod health
- [ ] Review error logs
- [ ] Monitor resource usage
- [ ] Verify auto-scaling
- [ ] Check response times

## Support & Documentation

- **Production Guide**: README.production.md
- **Deployment Guide**: DEPLOYMENT.md
- **Checklist**: PRODUCTION_CHECKLIST.md
- **This Document**: ARCHITECTURE.md
