# Deployment Guide

Complete guide to deploying AquaPump to production using Docker, Kubernetes, Helm, and GitOps.

## Deployment Options

Choose your deployment method:

1. **[Docker Compose](#docker-compose)** - Simple, single-server deployment
2. **[Kubernetes + Helm](#kubernetes--helm)** - Scalable, production-ready
3. **[GitOps with Argo CD](#gitops-with-argo-cd)** - Automated, declarative

## Prerequisites

### All Deployments
- Supabase account and project configured
- Environment variables ready
- Domain name (optional but recommended)

### Docker
- Docker 24+
- Docker Compose 2+

### Kubernetes
- Kubernetes cluster (v1.28+)
- kubectl configured
- Helm 3+

### GitOps
- All Kubernetes prerequisites
- Argo CD installed
- GitHub account with repo access

## Docker Compose

### Development

```bash
# Start services
docker-compose up

# Access at http://localhost:8081
```

### Production

1. **Configure environment:**

```bash
cp .env.example .env.production
```

Edit `.env.production` with production values.

2. **Start services:**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Verify deployment:**

```bash
# Check containers
docker-compose ps

# View logs
docker-compose logs -f

# Check health
curl http://localhost:8081/api/health
```

### Docker Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build

# Update specific service
docker-compose up -d --no-deps --build aquapump
```

## Kubernetes + Helm

### 1. Prepare Cluster

```bash
# Create namespaces
kubectl create namespace aquapump-production
kubectl create namespace aquapump-staging
kubectl create namespace aquapump-dev
```

### 2. Create Secrets

```bash
# Production
kubectl create secret generic aquapump-secrets \
  --from-literal=SUPABASE_URL=https://your-project.supabase.co \
  --from-literal=SUPABASE_SERVICE_KEY=your-service-key \
  --from-literal=EXPO_PUBLIC_AI_CHAT_KEY=your-ai-key \
  -n aquapump-production

# Staging
kubectl create secret generic aquapump-secrets \
  --from-literal=SUPABASE_URL=https://your-project.supabase.co \
  --from-literal=SUPABASE_SERVICE_KEY=your-service-key \
  --from-literal=EXPO_PUBLIC_AI_CHAT_KEY=your-ai-key \
  -n aquapump-staging
```

### 3. Configure Helm Values

Edit `infra/helm/aquapump/values.yaml`:

```yaml
image:
  repository: ghcr.io/your-org/aquapump
  tag: "v1.0.0"

ingress:
  hosts:
    - host: aquapump.example.com  # Update with your domain
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: aquapump-tls
      hosts:
        - aquapump.example.com  # Update with your domain
```

### 4. Deploy with Helm

#### Using Script (Recommended)

```bash
cd scripts
chmod +x deploy-helm.sh
./deploy-helm.sh production
```

#### Manual Deployment

```bash
helm install aquapump infra/helm/aquapump \
  --namespace aquapump-production \
  --values infra/helm/aquapump/values.yaml \
  --create-namespace \
  --wait
```

### 5. Verify Deployment

```bash
# Check pods
kubectl get pods -n aquapump-production

# Check services
kubectl get svc -n aquapump-production

# Check ingress
kubectl get ingress -n aquapump-production

# View logs
kubectl logs -f deployment/aquapump -n aquapump-production

# Check health
kubectl port-forward svc/aquapump 8081:80 -n aquapump-production
curl http://localhost:8081/api/health
```

### Kubernetes Commands

```bash
# Scale deployment
kubectl scale deployment aquapump --replicas=5 -n aquapump-production

# View HPA status
kubectl get hpa -n aquapump-production

# Rollback deployment
kubectl rollout undo deployment/aquapump -n aquapump-production

# View rollout history
kubectl rollout history deployment/aquapump -n aquapump-production

# Update image
kubectl set image deployment/aquapump aquapump=ghcr.io/org/aquapump:v2.0.0 -n aquapump-production

# Delete deployment
helm uninstall aquapump -n aquapump-production
```

## GitOps with Argo CD

Full automation with Argo CD for zero-touch deployments.

### 1. Install Argo CD

```bash
cd scripts
chmod +x setup-argocd.sh
./setup-argocd.sh
```

### 2. Access Argo CD UI

```bash
# Port forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

Open https://localhost:8080
- Username: `admin`
- Password: (from command above)

### 3. Connect Git Repository

Via CLI:
```bash
argocd repo add https://github.com/your-org/aquapump.git \
  --username your-username \
  --password your-github-token
```

Via UI:
1. Settings → Repositories
2. Connect Repo → HTTPS
3. Enter repository URL and credentials

### 4. Create Applications

```bash
# Create applications for all environments
kubectl apply -f infra/argocd/appproject.yaml
kubectl apply -f infra/argocd/application-dev.yaml
kubectl apply -f infra/argocd/application-staging.yaml
kubectl apply -f infra/argocd/application.yaml
```

### 5. Configure GitHub Actions

Add secrets to GitHub repository (Settings → Secrets):

```
ARGOCD_TOKEN=<argocd-api-token>
GITOPS_PAT=<github-personal-access-token>
```

Generate Argo CD token:
```bash
argocd account generate-token --account admin
```

### 6. Deploy via GitOps

Simply push to your repository:

```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

GitHub Actions will:
1. Build Docker image
2. Push to container registry
3. Update image tag in Git
4. Argo CD auto-syncs to Kubernetes

### Argo CD Commands

```bash
# View applications
argocd app list

# Get app status
argocd app get aquapump-production

# Sync application
argocd app sync aquapump-production

# View sync history
argocd app history aquapump-production

# Rollback application
argocd app rollback aquapump-production <revision>

# View diff
argocd app diff aquapump-production
```

## DNS Configuration

### 1. Get Load Balancer IP

```bash
kubectl get svc -n ingress-nginx
```

Look for `EXTERNAL-IP` of the ingress controller.

### 2. Create DNS Records

Add A records in your DNS provider:

```
aquapump.example.com         → <EXTERNAL_IP>
staging.aquapump.example.com → <EXTERNAL_IP>
dev.aquapump.example.com     → <EXTERNAL_IP>
```

### 3. Configure TLS

Install cert-manager:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

Create ClusterIssuer:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

Cert-manager will automatically provision TLS certificates.

## Environment-Specific Deployments

### Development

```bash
./scripts/deploy-helm.sh dev
```

Features:
- 1 replica
- Minimal resources
- Debug logging
- No auto-scaling

### Staging

```bash
./scripts/deploy-helm.sh staging
```

Features:
- 2 replicas
- Moderate resources
- Auto-scaling 2-5 pods
- Production-like environment

### Production

```bash
./scripts/deploy-helm.sh production
```

Features:
- 3 replicas minimum
- Full resources
- Auto-scaling 3-10 pods
- High availability
- Monitoring enabled

## Rollback Procedures

### Docker

```bash
# Stop current version
docker-compose down

# Pull previous image
docker pull ghcr.io/org/aquapump:v1.0.0

# Update docker-compose.yml with previous tag
# Start services
docker-compose up -d
```

### Kubernetes

Using script:
```bash
cd scripts
./rollback.sh production
```

Manual:
```bash
# View history
kubectl rollout history deployment/aquapump -n aquapump-production

# Rollback to previous
kubectl rollout undo deployment/aquapump -n aquapump-production

# Rollback to specific revision
kubectl rollout undo deployment/aquapump -n aquapump-production --to-revision=3
```

### Helm

```bash
# View releases
helm history aquapump -n aquapump-production

# Rollback to previous
helm rollback aquapump -n aquapump-production

# Rollback to specific revision
helm rollback aquapump 3 -n aquapump-production
```

### Argo CD

```bash
# View history
argocd app history aquapump-production

# Rollback
argocd app rollback aquapump-production <revision>
```

## Monitoring Deployment

### Health Checks

```bash
# Application health
curl https://aquapump.example.com/api/health

# Expected response:
# {"status":"healthy","timestamp":"...","uptime":...}
```

### Logs

```bash
# Docker
docker-compose logs -f

# Kubernetes
kubectl logs -f deployment/aquapump -n aquapump-production

# All pods
kubectl logs -l app.kubernetes.io/name=aquapump -n aquapump-production --tail=100

# Using script
cd scripts
./logs.sh docker   # Docker logs
./logs.sh k8s      # Kubernetes logs
```

### Metrics

```bash
# Docker
docker stats

# Kubernetes pods
kubectl top pods -n aquapump-production

# Kubernetes nodes
kubectl top nodes

# HPA status
kubectl get hpa -n aquapump-production
```

## Troubleshooting

### Pods Not Starting

```bash
# Describe pod
kubectl describe pod <pod-name> -n aquapump-production

# Check events
kubectl get events -n aquapump-production --sort-by='.lastTimestamp'

# Check logs
kubectl logs <pod-name> -n aquapump-production
```

### Image Pull Errors

- Verify image exists in registry
- Check image pull secrets
- Verify credentials

### Database Connection Issues

- Verify Supabase credentials in secrets
- Check network connectivity
- Review Supabase dashboard for issues

### Ingress Not Working

```bash
# Check ingress
kubectl describe ingress aquapump -n aquapump-production

# Check ingress controller logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller

# Verify DNS
dig aquapump.example.com

# Check certificate
kubectl get certificate -n aquapump-production
```

## Pre-Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] Secrets created in Kubernetes
- [ ] DNS records created
- [ ] SSL/TLS configured
- [ ] Database schema migrated
- [ ] Health checks working locally
- [ ] Code reviewed and tested
- [ ] Deployment plan documented
- [ ] Rollback plan ready
- [ ] Team notified
- [ ] Monitoring configured
- [ ] Backup strategy in place

## Post-Deployment Verification

After deployment:

- [ ] All pods running
- [ ] Health checks passing
- [ ] Application accessible via domain
- [ ] HTTPS working
- [ ] Database connectivity working
- [ ] API endpoints responding
- [ ] Theme/language switching works
- [ ] Chatbot functional
- [ ] Mobile responsiveness verified
- [ ] Performance acceptable
- [ ] No errors in logs
- [ ] Monitoring data flowing

## Additional Resources

- [Architecture](architecture.md) - System design
- [GitOps Guide](gitops.md) - CI/CD details
- [Helm Charts](helm.md) - Chart customization
- [Getting Started](getting-started.md) - Local setup
- [Contributing](contributing.md) - Development workflow
