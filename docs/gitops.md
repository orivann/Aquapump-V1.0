# GitOps Guide

Complete guide to AquaPump's GitOps workflow using Argo CD.

## Overview

GitOps is a way of implementing Continuous Deployment where:
- **Git is the single source of truth**
- **Automated deployment** based on Git changes
- **Declarative infrastructure** as code
- **Automatic synchronization** to desired state

## Architecture

```
Developer
    ↓
  Push Code
    ↓
GitHub Repository
    ↓
GitHub Actions
    ├── Build Image
    ├── Push to Registry
    └── Update Git (Image Tag)
         ↓
    Argo CD (Detects Change)
         ↓
    Kubernetes (Auto-Deploy)
         ↓
    Running Application
```

## Prerequisites

- Kubernetes cluster configured
- kubectl access
- Helm 3+ installed
- GitHub repository access
- Container registry (GHCR, Docker Hub, ECR)

## Setup Argo CD

### 1. Install Argo CD

```bash
cd scripts
chmod +x setup-argocd.sh
./setup-argocd.sh
```

This script:
- Creates `argocd` namespace
- Installs Argo CD
- Patches server for LoadBalancer
- Displays admin password

### 2. Access Argo CD UI

```bash
# Port forward
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Open https://localhost:8080

**Login:**
- Username: `admin`
- Password: (from setup script)

### 3. Change Admin Password

```bash
argocd account update-password
```

## Configure Git Repository

### Option 1: Public Repository

```bash
argocd repo add https://github.com/your-org/aquapump.git
```

### Option 2: Private Repository (HTTPS)

```bash
argocd repo add https://github.com/your-org/aquapump.git \
  --username your-username \
  --password your-github-pat
```

### Option 3: Private Repository (SSH)

```bash
argocd repo add git@github.com:your-org/aquapump.git \
  --ssh-private-key-path ~/.ssh/id_rsa
```

## Create Applications

### Using Manifests

```bash
# Create AppProject
kubectl apply -f infra/argocd/appproject.yaml

# Create Applications
kubectl apply -f infra/argocd/application-dev.yaml
kubectl apply -f infra/argocd/application-staging.yaml
kubectl apply -f infra/argocd/application.yaml
```

### Using Argo CD CLI

```bash
argocd app create aquapump-production \
  --repo https://github.com/your-org/aquapump.git \
  --path infra/helm/aquapump \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace aquapump-production \
  --values values.yaml \
  --sync-policy automated \
  --auto-prune \
  --self-heal
```

## Application Configuration

### Application Manifest

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: aquapump-production
  namespace: argocd
spec:
  project: aquapump
  
  source:
    repoURL: https://github.com/your-org/aquapump.git
    targetRevision: main
    path: infra/helm/aquapump
    helm:
      valueFiles:
        - values.yaml
  
  destination:
    server: https://kubernetes.default.svc
    namespace: aquapump-production
  
  syncPolicy:
    automated:
      prune: true      # Remove deleted resources
      selfHeal: true   # Auto-correct drift
    syncOptions:
      - CreateNamespace=true
      - Validate=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### Sync Policy Options

**Automated Sync:**
- `prune: true` - Delete resources removed from Git
- `selfHeal: true` - Revert manual changes
- `allowEmpty: false` - Prevent accidental deletion

**Sync Options:**
- `CreateNamespace=true` - Auto-create namespace
- `Validate=true` - Validate resources before apply
- `PruneLast=true` - Prune after other resources

## GitHub Actions CI/CD

### Workflow Configuration

Located at `.github/workflows/gitops-deploy.yaml`

**Triggers:**
- Push to `main` (production)
- Push to `staging` (staging)
- Push to `dev` (development)

**Steps:**
1. Checkout code
2. Build multi-arch Docker image
3. Scan image with Trivy
4. Push to container registry
5. Update image tag in Git
6. Trigger Argo CD sync

### Required GitHub Secrets

Add in repository settings → Secrets:

```
GITOPS_PAT          # GitHub Personal Access Token
ARGOCD_TOKEN        # Argo CD API token (optional)
GITHUB_TOKEN        # Automatically provided
```

**Generate Argo CD token:**
```bash
argocd account generate-token --account admin
```

**Generate GitHub PAT:**
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `write:packages`

### Workflow Example

```yaml
name: GitOps Deploy

on:
  push:
    branches: [main, staging, dev]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build and Push Docker Image
        run: |
          docker build -f infra/Dockerfile -t ghcr.io/org/aquapump:${{ github.sha }} .
          docker push ghcr.io/org/aquapump:${{ github.sha }}
      
      - name: Update Helm Values
        run: |
          sed -i "s/tag: .*/tag: ${{ github.sha }}/" infra/helm/aquapump/values.yaml
          git commit -am "chore: update image tag"
          git push
```

## Deployment Workflow

### 1. Make Changes

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ... edit files ...

# Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### 2. Create Pull Request

- Review changes
- Get approval
- Merge to main/staging/dev

### 3. Automated Deployment

GitHub Actions automatically:
1. Builds Docker image
2. Pushes to registry
3. Updates image tag in Git
4. Argo CD detects change (within 3 minutes)
5. Syncs to Kubernetes
6. Performs rolling update

### 4. Monitor Deployment

```bash
# Watch Argo CD sync
argocd app get aquapump-production --watch

# Watch Kubernetes pods
kubectl get pods -n aquapump-production -w

# View logs
kubectl logs -f deployment/aquapump -n aquapump-production
```

## Managing Applications

### View Application Status

```bash
# List applications
argocd app list

# Get detailed status
argocd app get aquapump-production

# View sync history
argocd app history aquapump-production
```

### Manual Sync

```bash
# Sync application
argocd app sync aquapump-production

# Sync with prune
argocd app sync aquapump-production --prune

# Force sync
argocd app sync aquapump-production --force
```

### View Diff

```bash
# Show difference between Git and cluster
argocd app diff aquapump-production

# Show manifests
argocd app manifests aquapump-production
```

### Rollback

```bash
# View history
argocd app history aquapump-production

# Rollback to previous
argocd app rollback aquapump-production

# Rollback to specific revision
argocd app rollback aquapump-production 5
```

### Pause/Resume Sync

```bash
# Disable auto-sync
argocd app set aquapump-production --sync-policy none

# Enable auto-sync
argocd app set aquapump-production --sync-policy automated
```

## Environment Strategy

### Development (dev branch)

```yaml
# infra/argocd/application-dev.yaml
spec:
  source:
    targetRevision: dev  # Track dev branch
    helm:
      valueFiles:
        - values-dev.yaml
  destination:
    namespace: aquapump-dev
  syncPolicy:
    automated:
      prune: true
      selfHeal: true  # Auto-heal in dev
```

### Staging (staging branch)

```yaml
# infra/argocd/application-staging.yaml
spec:
  source:
    targetRevision: staging  # Track staging branch
    helm:
      valueFiles:
        - values-staging.yaml
  destination:
    namespace: aquapump-staging
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### Production (main branch)

```yaml
# infra/argocd/application.yaml
spec:
  source:
    targetRevision: main  # Track main branch
    helm:
      valueFiles:
        - values.yaml
  destination:
    namespace: aquapump-production
  syncPolicy:
    automated:
      prune: true
      selfHeal: false  # Manual intervention in prod
```

## Best Practices

### Git Workflow

1. **Feature branches** for development
2. **Pull requests** for code review
3. **Merge to dev** for testing
4. **Merge to staging** for pre-production
5. **Merge to main** for production

### Deployment Strategy

1. **Immutable tags** - Use commit SHA, not `latest`
2. **Gradual rollout** - Dev → Staging → Production
3. **Health checks** - Ensure health probes configured
4. **Monitoring** - Watch metrics during deployment
5. **Rollback plan** - Know how to rollback quickly

### Security

1. **Secrets in Kubernetes** - Never in Git
2. **RBAC** - Limit Argo CD permissions
3. **Image scanning** - Scan for vulnerabilities
4. **Network policies** - Restrict pod communication
5. **Audit logging** - Track all changes

## Monitoring & Notifications

### Prometheus Metrics

Argo CD exposes metrics:
- `argocd_app_info` - Application info
- `argocd_app_sync_total` - Sync count
- `argocd_app_health_status` - Health status

### Slack Notifications

Configure in `argocd-notifications-cm` ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-notifications-cm
  namespace: argocd
data:
  service.slack: |
    token: $slack-token
  
  template.app-deployed: |
    message: |
      Application {{.app.metadata.name}} deployed!
      Revision: {{.app.status.sync.revision}}
      
  template.app-health-degraded: |
    message: |
      Application {{.app.metadata.name}} health degraded!
      
  trigger.on-deployed: |
    - when: app.status.operationState.phase in ['Succeeded']
      send: [app-deployed]
      
  trigger.on-health-degraded: |
    - when: app.status.health.status == 'Degraded'
      send: [app-health-degraded]
```

## Troubleshooting

### Application OutOfSync

```bash
# View diff
argocd app diff aquapump-production

# Force sync
argocd app sync aquapump-production --force

# Refresh cache
argocd app get aquapump-production --refresh
```

### Sync Failed

```bash
# View operation details
argocd app get aquapump-production --show-operation

# View application events
kubectl get events -n aquapump-production

# Check Argo CD logs
kubectl logs -n argocd deployment/argocd-application-controller
```

### Manual Changes Detected

```bash
# If selfHeal is disabled, Argo CD shows OutOfSync
# Option 1: Sync to revert manual changes
argocd app sync aquapump-production

# Option 2: Update Git to match manual changes
# (not recommended)
```

### Image Pull Errors

- Verify image exists in registry
- Check image pull secrets
- Verify registry credentials in Kubernetes

## Advanced Features

### App of Apps Pattern

Deploy multiple applications:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: aquapump-apps
spec:
  source:
    path: infra/argocd
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### Multi-Cluster Deployment

Register additional clusters:

```bash
# Login to cluster
kubectl config use-context other-cluster

# Register with Argo CD
argocd cluster add other-cluster
```

### Sync Waves

Control deployment order:

```yaml
metadata:
  annotations:
    argocd.argoproj.io/sync-wave: "1"  # Deploy in order
```

## Additional Resources

- [Argo CD Documentation](https://argo-cd.readthedocs.io/)
- [GitOps Principles](https://opengitops.dev/)
- [Deployment Guide](deployment.md)
- [Helm Guide](helm.md)
- [Architecture](architecture.md)
