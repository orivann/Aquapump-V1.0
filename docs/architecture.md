# Architecture

Complete overview of AquaPump's system design and technical architecture.

## System Overview

AquaPump is a production-ready, cloud-native application built with modern web technologies and designed for scalability, maintainability, and developer experience.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Users (Web, Mobile, Desktop)               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               Load Balancer / Ingress                        │
│               (HTTPS/TLS Termination)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│             Kubernetes Service (LoadBalancer)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    ┌────────┐    ┌────────┐    ┌────────┐
    │ Pod 1  │    │ Pod 2  │    │ Pod N  │
    │        │    │        │    │        │
    │ React  │    │ React  │    │ React  │
    │ Native │    │ Native │    │ Native │
    │  Web   │    │  Web   │    │  Web   │
    │        │    │        │    │        │
    │ Hono   │    │ Hono   │    │ Hono   │
    │ tRPC   │    │ tRPC   │    │ tRPC   │
    └───┬────┘    └───┬────┘    └───┬────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
                      ▼
           ┌──────────────────────┐
           │  External Services    │
           │                       │
           │  • Supabase          │
           │  • AI Toolkit        │
           └──────────────────────┘
```

## Technology Stack

### Frontend

**Framework & Libraries:**
- React Native Web (Expo SDK 53)
- TypeScript (strict mode)
- Expo Router (file-based routing)

**State Management:**
- React Query - Server state & caching
- React Context - App-level state (theme, language)
- AsyncStorage - Persistence

**UI & Styling:**
- React Native StyleSheet
- Lucide React Native - Icons
- Custom components with theme support

**Features:**
- Cross-platform (Web, iOS, Android)
- Responsive design
- Dark/light themes
- Internationalization (EN/HE)
- Real-time updates

### Backend

**Server:**
- Hono.js - Fast web framework
- tRPC - Type-safe APIs
- Bun - JavaScript runtime

**Database:**
- Supabase (PostgreSQL)
- Real-time subscriptions
- Row-level security

**Middleware:**
- CORS handling
- Request logging
- Error handling
- Health checks

### Infrastructure

**Containerization:**
- Docker (multi-stage builds)
- Alpine Linux base
- Non-root user execution

**Orchestration:**
- Kubernetes (1.28+)
- Helm charts
- Horizontal Pod Autoscaler
- Pod Disruption Budget

**CI/CD:**
- GitHub Actions
- Argo CD (GitOps)
- Automated deployments
- Rollback capabilities

**Networking:**
- NGINX Ingress Controller
- cert-manager (TLS)
- Load balancing

## Project Structure

```
aquapump/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home page
│   └── pumps.tsx          # Pumps management
│
├── components/             # React components
│   ├── Navigation.tsx     # Top navigation
│   ├── Hero.tsx          # Hero section
│   ├── About.tsx         # About section
│   ├── Technology.tsx    # Tech showcase
│   ├── Products.tsx      # Product catalog
│   ├── Contact.tsx       # Contact form
│   ├── Chatbot.tsx       # AI chatbot
│   └── ...               # Other components
│
├── contexts/               # State management
│   ├── ThemeContext.tsx   # Theme state
│   └── LanguageContext.tsx # i18n state
│
├── constants/              # App constants
│   ├── colors.ts          # Color palette
│   ├── theme.ts           # Theme definitions
│   └── translations.ts    # i18n strings
│
├── backend/                # Backend services
│   ├── hono.ts            # Server setup
│   ├── services/          # Business logic
│   │   └── supabase.ts    # Supabase client
│   └── trpc/              # tRPC configuration
│       ├── app-router.ts  # Main router
│       ├── create-context.ts # Context factory
│       └── routes/        # API routes
│           └── pumps/     # Pump endpoints
│
├── frontend/               # Frontend utilities
│   └── lib/               # Client libraries
│       └── supabase.ts    # Supabase client
│
├── infra/                  # Infrastructure as Code
│   ├── helm/              # Helm charts
│   │   └── aquapump/     # App chart
│   ├── argocd/           # Argo CD configs
│   │   ├── application.yaml
│   │   └── appproject.yaml
│   ├── Dockerfile        # Production image
│   └── .dockerignore     # Build exclusions
│
├── scripts/                # Automation scripts
│   ├── setup-argocd.sh   # Argo CD installation
│   ├── deploy-helm.sh    # Deployment script
│   ├── rollback.sh       # Rollback automation
│   ├── local-dev.sh      # Local setup
│   └── health-check.sh   # Health verification
│
├── docs/                   # Documentation
│   ├── getting-started.md # Quick start
│   ├── deployment.md      # Deploy guide
│   ├── architecture.md    # This file
│   └── ...               # Other guides
│
├── docker-compose.yml      # Dev environment
├── docker-compose.prod.yml # Prod environment
├── .env.example           # Env template
└── package.json           # Dependencies
```

## Data Flow

### Request Flow

1. **Client Request**
   - User interacts with UI
   - Component triggers action

2. **React Query + tRPC**
   - tRPC hook called
   - React Query manages cache
   - Type-safe request sent

3. **Backend Processing**
   - Hono receives request
   - tRPC router matches procedure
   - Business logic executed

4. **Database Interaction**
   - Supabase client queries PostgreSQL
   - Row-level security enforced
   - Data returned

5. **Response Handling**
   - Data transformed
   - Response sent to client
   - React Query updates cache
   - UI re-renders

### State Management Flow

```
User Action
    ↓
Event Handler
    ↓
Context Update (Theme/Language)
    ↓
State Change
    ↓
Optional: AsyncStorage Persistence
    ↓
Component Re-render
```

### Real-time Updates

```
Database Change (Supabase)
    ↓
WebSocket Notification
    ↓
Supabase Client (Frontend)
    ↓
Callback Handler
    ↓
React Query Invalidation
    ↓
UI Update
```

## Design Patterns

### Frontend Patterns

**Component Architecture:**
- Functional components with hooks
- React.memo for performance
- useMemo/useCallback for optimization
- Custom hooks for reusable logic

**State Management:**
- Server state: React Query
- App state: Context API
- Local state: useState
- Persistent state: AsyncStorage

**Routing:**
- File-based (Expo Router)
- Type-safe navigation
- Deep linking support

### Backend Patterns

**API Design:**
- tRPC procedures (type-safe)
- RESTful principles
- Error handling middleware
- Request/response logging

**Database Access:**
- Repository pattern (Supabase service)
- Query builder (Supabase)
- Transaction support
- Connection pooling

**Security:**
- Row-level security (RLS)
- Environment-based config
- Secrets management
- CORS configuration

## Scalability

### Horizontal Scaling

**Application Layer:**
- Stateless design
- No local storage dependencies
- Session-less architecture
- Load balancer distribution

**Auto-scaling:**
- Horizontal Pod Autoscaler
- CPU-based scaling (70% threshold)
- Memory-based scaling (80% threshold)
- Min: 2-3 pods, Max: 10 pods

**Database:**
- Supabase handles scaling
- Connection pooling
- Read replicas (via Supabase)

### Performance Optimizations

**Frontend:**
- Component memoization
- Lazy loading
- Code splitting
- Image optimization
- Request caching

**Backend:**
- Efficient queries
- Proper indexing
- Caching strategy
- Connection reuse

**Infrastructure:**
- CDN-ready static assets
- HTTP/2 support
- Gzip compression
- Resource limits

## Security

### Application Security

**Authentication & Authorization:**
- Supabase Auth (ready for future)
- Row-level security (RLS)
- Service role vs anon key
- API key management

**Network Security:**
- HTTPS/TLS only
- CORS restrictions
- Rate limiting (via Ingress)
- Network policies

**Container Security:**
- Non-root user
- Minimal base image
- No unnecessary packages
- Security scanning (Trivy)

**Secrets Management:**
- Kubernetes secrets
- Environment variables
- No hardcoded credentials
- Secure transmission

### Infrastructure Security

**Kubernetes:**
- RBAC enabled
- Network policies
- Pod security policies
- Resource quotas

**Monitoring:**
- Health check endpoints
- Audit logging
- Error tracking
- Security scanning

## High Availability

### Redundancy

**Application:**
- Multiple pod replicas (3+)
- Load balancing
- Health checks
- Auto-restart on failure

**Database:**
- Supabase managed HA
- Automated backups
- Point-in-time recovery

### Disaster Recovery

**Backup Strategy:**
- Database: Supabase automated backups
- Configuration: Git repository
- Secrets: Secure backup location

**Recovery:**
- Helm rollback capability
- Argo CD rollback
- Database restore procedures
- Infrastructure as Code

**Monitoring:**
- Health endpoints
- Liveness probes
- Readiness probes
- Startup probes

## Monitoring & Observability

### Health Checks

**Endpoints:**
- `/api/health` - Application health
- `/api/ready` - Readiness status
- `/api` - API information

**Kubernetes Probes:**
- Liveness: Detects broken state
- Readiness: Traffic routing
- Startup: Initial boot

### Logging

**Application:**
- Structured JSON logs
- Request/response logging
- Error logging
- Performance logging

**Infrastructure:**
- Pod logs (stdout/stderr)
- Ingress logs
- System logs

### Metrics

**Application Metrics:**
- Request rate
- Response time
- Error rate
- Cache hit rate

**Infrastructure Metrics:**
- CPU usage
- Memory usage
- Network I/O
- Disk I/O

**Auto-scaling Metrics:**
- Pod count
- HPA status
- Resource utilization

## Deployment Architecture

### Container Structure

**Multi-stage Build:**
1. **deps**: Install dependencies
2. **builder**: Build application
3. **runner**: Production runtime

**Optimizations:**
- Layer caching
- Minimal final image
- Non-root user
- Health checks included

### Kubernetes Resources

**Deployment:**
- Rolling update strategy
- 3 replicas (production)
- Resource limits
- Health probes

**Service:**
- LoadBalancer type
- Session affinity (optional)
- Internal DNS

**Ingress:**
- NGINX controller
- TLS termination
- Path-based routing
- Rate limiting

**HPA:**
- Min: 2-3 replicas
- Max: 10 replicas
- CPU: 70% target
- Memory: 80% target

**ConfigMap:**
- Non-sensitive config
- Environment variables
- Application settings

**Secrets:**
- Sensitive data
- API keys
- Database credentials

## Future Enhancements

### Planned Features

**Application:**
- User authentication
- Real-time collaboration
- Advanced analytics
- Mobile app (native)

**Infrastructure:**
- Multi-region deployment
- CDN integration
- Advanced monitoring (Prometheus/Grafana)
- Distributed tracing (OpenTelemetry)
- Service mesh (Istio/Linkerd)

**Database:**
- Redis caching layer
- Read replicas
- Advanced indexing
- Query optimization

**DevOps:**
- Automated testing in CI/CD
- Canary deployments
- Blue-green deployments
- Automated performance testing

## Best Practices

### Development

- Strict TypeScript checking
- Comprehensive error handling
- Extensive logging
- Code reviews
- Documentation

### Deployment

- Infrastructure as Code
- GitOps workflow
- Immutable infrastructure
- Automated testing
- Gradual rollouts

### Operations

- Monitor everything
- Alert on anomalies
- Regular backups
- Disaster recovery drills
- Capacity planning

## Performance Benchmarks

### Target Metrics

- Response time: < 200ms (p95)
- Availability: 99.9%
- Error rate: < 0.1%
- Build time: < 5 min
- Deploy time: < 2 min

### Resource Usage

**Per Pod:**
- CPU: 250m request, 1000m limit
- Memory: 512Mi request, 2Gi limit

**Auto-scaling:**
- Scale up: gradual
- Scale down: conservative
- Metrics: CPU + Memory

## Additional Resources

- [Getting Started](getting-started.md)
- [Deployment Guide](deployment.md)
- [API Reference](api.md)
- [GitOps Guide](gitops.md)
- [Contributing](contributing.md)
