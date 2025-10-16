# Architecture Overview

AquaPump is a modern, cloud-native application built with React Native, Expo, and Kubernetes.

## System Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        Load Balancer                         │
│                    (Ingress Controller)                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐              ┌───────▼────────┐
│   AquaPump     │              │   AquaPump     │
│   Pod 1        │◄────HPA────► │   Pod N        │
│                │              │                │
│  React Native  │              │  React Native  │
│  Expo Web      │              │  Expo Web      │
│  Hono Backend  │              │  Hono Backend  │
│  tRPC API      │              │  tRPC API      │
└────────┬───────┘              └────────┬───────┘
         │                               │
         └───────────────┬───────────────┘
                         │
                 ┌───────▼────────┐
                 │   Supabase     │
                 │                │
                 │  PostgreSQL    │
                 │  Auth          │
                 │  Storage       │
                 └────────────────┘
\`\`\`

## Technology Stack

### Frontend
- **React Native** 0.79 - Cross-platform mobile framework
- **Expo** 53 - Development platform
- **React Native Web** - Web compatibility
- **TypeScript** - Type safety
- **React Query** - Server state management

### Backend
- **Hono** - Fast web framework
- **tRPC** - End-to-end typesafe APIs
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage

### Infrastructure
- **Kubernetes** - Container orchestration
- **Helm** - Package management
- **Argo CD** - GitOps continuous delivery
- **Docker** - Containerization
- **GitHub Actions** - CI/CD automation

## Project Structure

\`\`\`
aquapump/
├── frontend/           # Frontend-specific code
│   └── lib/           # Frontend utilities and Supabase client
├── backend/           # Backend services
│   ├── hono.ts       # Hono server setup
│   ├── services/     # Business logic
│   └── trpc/         # tRPC routers and procedures
├── app/              # Expo Router pages
├── components/       # React components
├── contexts/         # React context providers
├── constants/        # App constants
├── assets/          # Static assets
├── infra/           # Infrastructure as Code
│   ├── helm/        # Helm charts
│   ├── argocd/      # Argo CD applications
│   ├── Dockerfile   # Production container
│   └── .dockerignore
├── scripts/         # Deployment and utility scripts
└── docs/           # Documentation
\`\`\`

## Data Flow

### 1. User Request
\`\`\`
User → Load Balancer → Kubernetes Service → Pod
\`\`\`

### 2. API Call
\`\`\`
Frontend → tRPC Client → tRPC Server → Supabase → PostgreSQL
\`\`\`

### 3. Real-time Updates
\`\`\`
Supabase Realtime → WebSocket → Frontend → UI Update
\`\`\`

## Deployment Flow (GitOps)

\`\`\`
Code Push → GitHub Actions → Build Image → Push to Registry
                ↓
         Update GitOps Repo
                ↓
         Argo CD Detects Change
                ↓
         Sync to Kubernetes
                ↓
         Rolling Update Pods
\`\`\`

## Security

- **Pod Security**: Non-root containers, read-only filesystem
- **Network Policies**: Restricted ingress/egress
- **Secrets Management**: Kubernetes secrets, not in code
- **Image Scanning**: Trivy vulnerability scanning
- **HTTPS Only**: TLS termination at ingress
- **RBAC**: Kubernetes role-based access control

## Scalability

- **Horizontal Pod Autoscaling**: CPU/Memory-based scaling
- **Load Balancing**: Automatic traffic distribution
- **Database Connection Pooling**: Supabase manages connections
- **Caching**: React Query caching on frontend
- **CDN Ready**: Static assets can be CDN-served

## Monitoring

- **Health Checks**: Liveness, readiness, startup probes
- **Metrics**: Prometheus-compatible endpoints
- **Logging**: Structured JSON logs to stdout
- **Tracing**: OpenTelemetry ready

## High Availability

- **Multi-replica Deployment**: 3+ pods in production
- **Pod Anti-affinity**: Spread across nodes
- **Pod Disruption Budget**: Minimum 2 pods available
- **Rolling Updates**: Zero-downtime deployments
- **Automated Rollback**: On deployment failure
