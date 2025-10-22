# 🚀 AquaPump Production Deployment Guide

> Complete guide for deploying AquaPump to production with Docker, Kubernetes, and CI/CD.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [CI/CD Setup](#cicd-setup)
6. [Monitoring & Logging](#monitoring--logging)
7. [Security Hardening](#security-hardening)
8. [Backup & Recovery](#backup--recovery)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Docker** 24+ with Docker Compose
- **Kubernetes** 1.28+ cluster
- **Helm** 3.12+
- **kubectl** configured with cluster access
- **Git** for version control
- **Bun** or **Node.js** 22+ (for local development)

### Required Services

- **Container Registry** (Docker Hub, AWS ECR, GCR, etc.)
- **Domain Name** with DNS control
- **SSL Certificate** (or cert-manager for auto-provisioning)
- **Supabase** project (or PostgreSQL database)
- **Optional**: Monitoring stack (Prometheus, Grafana)

---

## Environment Setup

### 1. Production Environment Variables

Create `.env.production` file:

```env
# ===============================================
# Production Environment Configuration
# ===============================================

# Frontend (client-accessible)
EXPO_PUBLIC_RORK_API_BASE_URL=https://api.aquapump.com
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com
EXPO_PUBLIC_AI_CHAT_KEY=your-production-ai-key

# Backend (server-side only)
NODE_ENV=production
PORT=8081
HOST=0.0.0.0
CORS_ORIGIN=https://aquapump.com,https://www.aquapump.com

# Supabase Backend
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-production-service-key

# Logging
LOG_LEVEL=warn
```

### 2. Kubernetes Secrets

Create secrets file (DO NOT COMMIT):

```bash
# Create namespace
kubectl create namespace aquapump

# Create secret from env file
kubectl create secret generic aquapump-secrets \
  --from-env-file=.env.production \
  --namespace=aquapump

# Verify secret
kubectl get secret aquapump-secrets -n aquapump
```

---

## Docker Deployment

### 1. Build Images

```bash
# Navigate to infra directory
cd infra

# Build backend image
docker build -f Dockerfile.backend -t aquapump-backend:latest ..

# Build frontend image  
docker build -f Dockerfile.frontend -t aquapump-frontend:latest ..

# Verify images
docker images | grep aquapump
```

### 2. Tag & Push to Registry

```bash
# Login to registry
docker login your-registry.com

# Tag images
docker tag aquapump-backend:latest your-registry.com/aquapump-backend:latest
docker tag aquapump-frontend:latest your-registry.com/aquapump-frontend:latest

# Push images
docker push your-registry.com/aquapump-backend:latest
docker push your-registry.com/aquapump-frontend:latest
```

### 3. Deploy with Docker Compose

```bash
# Start services
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose ps

# View logs
docker compose logs -f

# Access application
# Frontend: http://localhost:8080
# Backend: http://localhost:8081
```

### 4. Health Checks

```bash
# Backend health
curl http://localhost:8081/health

# Frontend health
curl http://localhost:8080
```

---

## Kubernetes Deployment

### 1. Update Helm Values

Edit `infra/helm/aquapump/values.yaml`:

```yaml
# Update image repository
image:
  repository: your-registry.com/aquapump
  tag: "v1.0.0"

# Update ingress
ingress:
  enabled: true
  hosts:
    - host: aquapump.com
      paths:
        - path: /
  tls:
    - secretName: aquapump-tls
      hosts:
        - aquapump.com

# Update resources for production
resources:
  limits:
    cpu: 2000m
    memory: 4Gi
  requests:
    cpu: 500m
    memory: 1Gi

# Enable autoscaling
autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
```

### 2. Install Helm Chart

```bash
# Add namespace
kubectl create namespace aquapump

# Install chart
helm install aquapump ./infra/helm/aquapump \
  --namespace aquapump \
  --values ./infra/helm/aquapump/values.yaml

# Check deployment
kubectl get pods -n aquapump
kubectl get svc -n aquapump
kubectl get ingress -n aquapump
```

### 3. Verify Deployment

```bash
# Check pod status
kubectl get pods -n aquapump

# Check logs
kubectl logs -f deployment/aquapump -n aquapump

# Check service
kubectl get svc aquapump -n aquapump

# Check ingress
kubectl describe ingress aquapump -n aquapump
```

### 4. Upgrade Deployment

```bash
# Update values or image
helm upgrade aquapump ./infra/helm/aquapump \
  --namespace aquapump \
  --values ./infra/helm/aquapump/values.yaml

# Rollback if needed
helm rollback aquapump -n aquapump
```

---

## CI/CD Setup

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ secrets.REGISTRY_URL }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}
      
      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./infra/Dockerfile
          push: true
          tags: ${{ secrets.REGISTRY_URL }}/aquapump:${{ github.sha }}
      
      - name: Deploy to Kubernetes
        uses: azure/k8s-deploy@v4
        with:
          manifests: |
            infra/kubernetes/deployment.yaml
            infra/kubernetes/service.yaml
          images: |
            ${{ secrets.REGISTRY_URL }}/aquapump:${{ github.sha }}
```

### Argo CD Setup

```bash
# Install Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Apply application
kubectl apply -f infra/argocd/application.yaml

# Access Argo CD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

---

## Monitoring & Logging

### Prometheus + Grafana

```bash
# Add Prometheus Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Access Grafana
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring

# Default credentials: admin/prom-operator
```

### Application Logs

```bash
# View application logs
kubectl logs -f deployment/aquapump -n aquapump

# Stream logs
kubectl logs -f deployment/aquapump -n aquapump --tail=100

# Export logs
kubectl logs deployment/aquapump -n aquapump > app.log
```

---

## Security Hardening

### 1. Network Policies

```yaml
# Apply network policy
kubectl apply -f infra/helm/aquapump/templates/networkpolicy.yaml
```

### 2. Pod Security

```yaml
# Set security context
podSecurityContext:
  runAsNonRoot: true
  runAsUser: 1001
  fsGroup: 1001

securityContext:
  capabilities:
    drop:
      - ALL
  readOnlyRootFilesystem: false
  allowPrivilegeEscalation: false
```

### 3. Secrets Management

```bash
# Use Sealed Secrets (recommended)
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Seal a secret
kubeseal --format=yaml < secret.yaml > sealed-secret.yaml

# Apply sealed secret (safe to commit)
kubectl apply -f sealed-secret.yaml
```

### 4. SSL/TLS with cert-manager

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@aquapump.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

---

## Backup & Recovery

### Database Backup

```bash
# Backup Supabase (PostgreSQL)
pg_dump -h your-db-host -U postgres -d aquapump > backup.sql

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h your-db-host -U postgres -d aquapump | gzip > backup_$DATE.sql.gz
```

### Kubernetes Backup

```bash
# Backup using Velero
velero install --provider aws --bucket aquapump-backups

# Create backup
velero backup create aquapump-backup --include-namespaces aquapump

# Restore from backup
velero restore create --from-backup aquapump-backup
```

---

## Troubleshooting

### Common Issues

#### Pods not starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n aquapump

# Check events
kubectl get events -n aquapump --sort-by='.lastTimestamp'

# Check logs
kubectl logs <pod-name> -n aquapump --previous
```

#### Ingress not working

```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Check ingress resource
kubectl describe ingress aquapump -n aquapump

# Check service
kubectl get svc aquapump -n aquapump
```

#### Database connection issues

```bash
# Test connection from pod
kubectl exec -it <pod-name> -n aquapump -- sh
curl http://your-db-host:5432
```

### Performance Issues

```bash
# Check resource usage
kubectl top pods -n aquapump
kubectl top nodes

# Scale up replicas
kubectl scale deployment aquapump --replicas=5 -n aquapump

# Update HPA
kubectl autoscale deployment aquapump --cpu-percent=50 --min=3 --max=10 -n aquapump
```

---

## Production Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] Secrets created in Kubernetes
- [ ] SSL certificates provisioned
- [ ] Domain DNS configured
- [ ] Images built and pushed to registry
- [ ] Helm values updated for production
- [ ] Database migrations completed
- [ ] Monitoring stack installed
- [ ] Backup solution configured

### Post-Deployment

- [ ] Health checks passing
- [ ] Application accessible via domain
- [ ] SSL/TLS working correctly
- [ ] Monitoring dashboards configured
- [ ] Log aggregation working
- [ ] Alerts configured
- [ ] Performance testing completed
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team trained on operations

### Ongoing Maintenance

- [ ] Regular security updates
- [ ] Database backup verification
- [ ] Monitoring review
- [ ] Capacity planning
- [ ] Incident response plan
- [ ] Disaster recovery testing

---

## Support

For production issues:

1. Check logs: `kubectl logs -f deployment/aquapump -n aquapump`
2. Check monitoring: Grafana dashboards
3. Review documentation: `./docs/`
4. Contact support: support@aquapump.com

---

**Last Updated**: 2025-01-22
