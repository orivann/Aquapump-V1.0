# AquaPump Deployment Guide

Complete step-by-step guide to deploy AquaPump to production using GitOps.

## 📋 Prerequisites

### Required Tools
- **Kubernetes cluster** (v1.28+)
- **kubectl** (configured)
- **Helm** 3+
- **Docker**
- **Git**
- **Bun** or Node.js 20+

### Required Accounts
- **GitHub** account with repository access
- **Supabase** account (free tier works)
- **Container registry** (GitHub Container Registry, Docker Hub, or AWS ECR)
- **DNS** provider (for custom domain)

## 🚀 Step-by-Step Deployment

### Phase 1: Supabase Setup

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com
   # Click "New Project"
   # Copy your project URL and keys
   ```

2. **Run Database Migrations**
   
   Open Supabase SQL Editor and run:
   ```sql
   -- See docs/SUPABASE.md for complete schema
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   
   CREATE TABLE pumps (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     model TEXT NOT NULL,
     status TEXT NOT NULL,
     pressure NUMERIC NOT NULL,
     flow_rate NUMERIC NOT NULL,
     power_consumption NUMERIC NOT NULL,
     location TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Add more tables as needed (see docs/SUPABASE.md)
   ```

3. **Configure Row Level Security**
   ```sql
   ALTER TABLE pumps ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Service role full access" ON pumps
   FOR ALL USING (auth.role() = 'service_role');
   ```

4. **Save Credentials**
   ```bash
   # Note these values for later:
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_KEY=eyJhbGc...
   ```

### Phase 2: Kubernetes Setup

1. **Create Namespaces**
   ```bash
   kubectl create namespace aquapump-production
   kubectl create namespace aquapump-staging
   kubectl create namespace aquapump-dev
   kubectl create namespace argocd
   ```

2. **Create Secrets**
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
   
   # Dev
   kubectl create secret generic aquapump-secrets \
     --from-literal=SUPABASE_URL=https://your-project.supabase.co \
     --from-literal=SUPABASE_SERVICE_KEY=your-service-key \
     --from-literal=EXPO_PUBLIC_AI_CHAT_KEY=your-ai-key \
     -n aquapump-dev
   ```

3. **Install Ingress Controller** (if not already installed)
   ```bash
   helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
   helm repo update
   
   helm install ingress-nginx ingress-nginx/ingress-nginx \
     --namespace ingress-nginx \
     --create-namespace \
     --set controller.service.type=LoadBalancer
   ```

4. **Install cert-manager** (for TLS)
   ```bash
   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
   
   # Create Let's Encrypt issuer
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

### Phase 3: Argo CD Installation

1. **Install Argo CD**
   ```bash
   cd scripts
   chmod +x setup-argocd.sh
   ./setup-argocd.sh
   ```

2. **Access Argo CD UI**
   ```bash
   kubectl port-forward svc/argocd-server -n argocd 8080:443
   ```
   
   Open https://localhost:8080
   
   Login:
   - Username: `admin`
   - Password: (from setup script output)

3. **Add Git Repository**
   
   Via UI:
   - Settings → Repositories → Connect Repo
   - Choose HTTPS
   - Enter: https://github.com/your-org/aquapump.git
   - Add credentials (if private repo)

   Via CLI:
   ```bash
   argocd repo add https://github.com/your-org/aquapump.git \
     --username your-username \
     --password your-github-pat
   ```

4. **Create Applications**
   ```bash
   kubectl apply -f infra/argocd/appproject.yaml
   kubectl apply -f infra/argocd/application-dev.yaml
   kubectl apply -f infra/argocd/application-staging.yaml
   kubectl apply -f infra/argocd/application.yaml
   ```

### Phase 4: Configure GitHub Actions

1. **Add GitHub Secrets**
   
   Go to: Settings → Secrets and variables → Actions
   
   Add:
   - `ARGOCD_TOKEN`: Argo CD API token
   - `GITOPS_PAT`: Personal Access Token for GitOps repo
   
   Generate Argo CD token:
   ```bash
   argocd account generate-token --account admin
   ```

2. **Update Workflow File**
   
   Edit `.github/workflows/gitops-deploy.yaml`:
   - Update `REGISTRY` to your container registry
   - Update Argo CD URL
   - Update GitOps repo URL

### Phase 5: Configure DNS

1. **Get Ingress IP**
   ```bash
   kubectl get svc -n ingress-nginx
   ```

2. **Create DNS Records**
   
   Add A records:
   ```
   aquapump.example.com         → <INGRESS_IP>
   staging.aquapump.example.com → <INGRESS_IP>
   dev.aquapump.example.com     → <INGRESS_IP>
   ```

3. **Update Helm Values**
   
   Edit `infra/helm/aquapump/values.yaml`:
   ```yaml
   ingress:
     hosts:
       - host: aquapump.example.com  # Update this
         paths:
           - path: /
             pathType: Prefix
     tls:
       - secretName: aquapump-tls
         hosts:
           - aquapump.example.com  # Update this
   ```

### Phase 6: Deploy!

1. **Build and Push Initial Image**
   ```bash
   # Build
   docker build -f infra/Dockerfile -t ghcr.io/your-org/aquapump:v1.0.0 .
   
   # Login to registry
   echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
   
   # Push
   docker push ghcr.io/your-org/aquapump:v1.0.0
   ```

2. **Deploy via Helm (Manual First Time)**
   ```bash
   cd scripts
   ./deploy-helm.sh production
   ```

3. **Verify Deployment**
   ```bash
   # Check pods
   kubectl get pods -n aquapump-production
   
   # Check logs
   kubectl logs -f deployment/aquapump -n aquapump-production
   
   # Check health
   curl https://aquapump.example.com/api/health
   ```

4. **Sync with Argo CD**
   ```bash
   argocd app sync aquapump-production
   ```

### Phase 7: Enable GitOps (Automated Deployments)

1. **Push to Repository**
   ```bash
   git add .
   git commit -m "chore: production deployment"
   git push origin main
   ```

2. **GitHub Actions Triggers**
   - Builds Docker image
   - Pushes to registry
   - Updates image tag in Git
   - Argo CD automatically syncs

3. **Monitor Deployment**
   ```bash
   # Watch Argo CD
   argocd app get aquapump-production --watch
   
   # Watch pods
   kubectl get pods -n aquapump-production -w
   ```

## ✅ Post-Deployment Verification

### Health Checks

```bash
# API health
curl https://aquapump.example.com/api/health

# Expected response:
# {"status":"healthy","timestamp":"...","uptime":...}
```

### Functional Tests

```bash
# Test frontend
open https://aquapump.example.com

# Test tRPC endpoints
curl https://aquapump.example.com/api/trpc/example.hi
```

### Performance Tests

```bash
# Load testing with k6 (optional)
k6 run --vus 10 --duration 30s \
  -e BASE_URL=https://aquapump.example.com \
  load-test.js
```

### Security Checks

```bash
# SSL Labs test
# Go to: https://www.ssllabs.com/ssltest/
# Enter: aquapump.example.com

# Security headers
curl -I https://aquapump.example.com
```

## 🔄 Day 2 Operations

### Making Updates

```bash
# Make changes locally
git add .
git commit -m "feat: add new feature"
git push origin main

# GitHub Actions automatically:
# 1. Builds new image
# 2. Pushes to registry
# 3. Updates Helm values
# 4. Argo CD syncs to cluster
```

### Viewing Logs

```bash
# Recent logs
kubectl logs -f deployment/aquapump -n aquapump-production

# All pods
kubectl logs -l app.kubernetes.io/name=aquapump -n aquapump-production --tail=100
```

### Scaling

```bash
# Manual scaling
kubectl scale deployment aquapump --replicas=5 -n aquapump-production

# HPA is configured, so it will auto-scale based on CPU/Memory
kubectl get hpa -n aquapump-production
```

### Rollback

```bash
# Via script
cd scripts
./rollback.sh production

# Via Helm
helm rollback aquapump -n aquapump-production

# Via Argo CD
argocd app rollback aquapump-production
```

## 🚨 Troubleshooting

### Pods Not Starting

```bash
# Describe pod
kubectl describe pod <pod-name> -n aquapump-production

# Check events
kubectl get events -n aquapump-production --sort-by='.lastTimestamp'

# Check image pull
kubectl get pods -n aquapump-production -o jsonpath='{.items[*].status.containerStatuses[*].state}'
```

### Ingress Not Working

```bash
# Check ingress
kubectl describe ingress aquapump -n aquapump-production

# Check cert-manager
kubectl get certificate -n aquapump-production
kubectl describe certificate aquapump-tls -n aquapump-production

# Check ingress controller logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```

### Database Connection Issues

```bash
# Test from pod
kubectl exec -it deployment/aquapump -n aquapump-production -- curl http://localhost:8081/api/health

# Check secrets
kubectl get secret aquapump-secrets -n aquapump-production -o yaml
```

### Argo CD Out of Sync

```bash
# View diff
argocd app diff aquapump-production

# Force sync
argocd app sync aquapump-production --force

# Refresh
argocd app get aquapump-production --refresh
```

## 📊 Monitoring Setup (Optional)

### Prometheus + Grafana

```bash
# Install kube-prometheus-stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Access Grafana
kubectl port-forward svc/prometheus-grafana -n monitoring 3000:80
```

### Application Metrics

```bash
# View service monitors
kubectl get servicemonitor -n aquapump-production

# Query metrics
kubectl port-forward svc/prometheus-kube-prometheus-prometheus -n monitoring 9090:9090
# Open: http://localhost:9090
```

## 🎯 Production Checklist

Before going live, complete: [docs/PRODUCTION_CHECKLIST.md](./docs/PRODUCTION_CHECKLIST.md)

## 📚 Additional Resources

- [Architecture](./docs/ARCHITECTURE.md)
- [GitOps Guide](./docs/GITOPS.md)
- [Helm Charts](./docs/HELM.md)
- [Supabase Setup](./docs/SUPABASE.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## 🆘 Getting Help

- **Documentation**: [./docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/your-org/aquapump/issues)
- **Email**: support@aquapump.com

---

**Congratulations!** 🎉 Your AquaPump platform is now production-ready with full GitOps automation!
