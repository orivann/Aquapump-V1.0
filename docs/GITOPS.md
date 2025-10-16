# GitOps with Argo CD

Complete guide to the GitOps workflow for AquaPump.

## Overview

AquaPump uses **GitOps** for declarative, automated deployments:

- **Source of Truth**: Git repository
- **Automation**: Argo CD continuously syncs
- **Environments**: Dev, Staging, Production
- **Zero Manual kubectl**: Everything via Git

## Architecture

\`\`\`
┌──────────────┐    Push     ┌──────────────┐
│  Developer   │───────────► │   GitHub     │
└──────────────┘             └──────┬───────┘
                                    │
                              GitHub Actions
                                    │
                            ┌───────▼────────┐
                            │  Build & Push  │
                            │  Docker Image  │
                            └───────┬────────┘
                                    │
                            ┌───────▼────────┐
                            │  Update Image  │
                            │  Tag in Git    │
                            └───────┬────────┘
                                    │
                            ┌───────▼────────┐
                            │   Argo CD      │
                            │  Detects       │
                            │  Difference    │
                            └───────┬────────┘
                                    │
                            ┌───────▼────────┐
                            │  Kubernetes    │
                            │  Auto Deploy   │
                            └────────────────┘
\`\`\`

## Setup Argo CD

### 1. Install Argo CD

\`\`\`bash
cd scripts
chmod +x setup-argocd.sh
./setup-argocd.sh
\`\`\`

### 2. Access Argo CD UI

\`\`\`bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
\`\`\`

Open: https://localhost:8080

**Login**:
- Username: \`admin\`
- Password: (from setup script output)

### 3. Connect Git Repository

Via UI or CLI:

\`\`\`bash
argocd repo add https://github.com/your-org/aquapump.git \\
  --username your-username \\
  --password your-pat
\`\`\`

## Deployment Workflow

### Automatic Deployment (Recommended)

1. **Push code** to branch:
   - \`main\` → production
   - \`staging\` → staging
   - \`dev\` → dev

2. **GitHub Actions**:
   - Builds Docker image
   - Pushes to registry
   - Updates image tag in Helm values

3. **Argo CD**:
   - Detects change (30s poll)
   - Syncs to Kubernetes
   - Rolling update

### Manual Deployment

\`\`\`bash
cd scripts
./deploy-helm.sh production
\`\`\`

## Environments

### Development
- **Branch**: \`dev\`
- **Namespace**: \`aquapump-dev\`
- **Replicas**: 1
- **Auto-sync**: Enabled
- **URL**: https://dev.aquapump.example.com

### Staging
- **Branch**: \`staging\`
- **Namespace**: \`aquapump-staging\`
- **Replicas**: 2
- **Auto-sync**: Enabled
- **URL**: https://staging.aquapump.example.com

### Production
- **Branch**: \`main\`
- **Namespace**: \`aquapump-production\`
- **Replicas**: 3+
- **Auto-sync**: Enabled
- **URL**: https://aquapump.example.com

## Managing Deployments

### Sync Application

\`\`\`bash
argocd app sync aquapump-production
\`\`\`

### View Application Status

\`\`\`bash
argocd app get aquapump-production
\`\`\`

### View Deployment History

\`\`\`bash
argocd app history aquapump-production
\`\`\`

### Rollback

\`\`\`bash
argocd app rollback aquapump-production <revision>
\`\`\`

Or use script:

\`\`\`bash
cd scripts
./rollback.sh production 3
\`\`\`

## Argo CD Configuration

### Application Manifest

Located at: \`infra/argocd/application.yaml\`

Key settings:
- \`automated.prune\`: Remove deleted resources
- \`automated.selfHeal\`: Auto-correct drift
- \`syncOptions.CreateNamespace\`: Auto-create namespace

### Sync Policy

\`\`\`yaml
syncPolicy:
  automated:
    prune: true        # Remove old resources
    selfHeal: true     # Fix manual changes
  syncOptions:
    - Validate=true    # Validate YAML
    - CreateNamespace=true
  retry:
    limit: 5
    backoff:
      duration: 5s
      maxDuration: 3m
\`\`\`

## Secrets Management

**Never commit secrets to Git!**

### Create Secrets

\`\`\`bash
kubectl create secret generic aquapump-secrets \\
  --from-literal=SUPABASE_URL=your-url \\
  --from-literal=SUPABASE_SERVICE_KEY=your-key \\
  --from-literal=EXPO_PUBLIC_AI_CHAT_KEY=your-chat-key \\
  -n aquapump-production
\`\`\`

### Using External Secrets Operator (Recommended)

\`\`\`yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: aquapump-secrets
spec:
  secretStoreRef:
    name: aws-secrets-manager
  target:
    name: aquapump-secrets
  data:
    - secretKey: SUPABASE_URL
      remoteRef:
        key: aquapump/supabase-url
\`\`\`

## CI/CD Pipeline

### GitHub Actions Workflow

Located at: \`.github/workflows/gitops-deploy.yaml\`

**Triggers**:
- Push to \`main\`, \`staging\`, \`dev\`
- Pull requests to \`main\`, \`staging\`
- Manual trigger

**Steps**:
1. Build multi-arch Docker image
2. Scan for vulnerabilities (Trivy)
3. Push to registry
4. Update image tag in Git
5. Trigger Argo CD sync

### Required Secrets

Add to GitHub repository settings:

- \`GITOPS_PAT\`: Personal access token for GitOps repo
- \`ARGOCD_TOKEN\`: Argo CD API token
- \`GITHUB_TOKEN\`: Auto-provided

## Best Practices

1. **Always use GitOps**: Never \`kubectl apply\` manually
2. **PR-based changes**: Review before merge
3. **Environment promotion**: dev → staging → production
4. **Immutable tags**: Use commit SHA, not \`latest\`
5. **Monitor Argo CD**: Check sync status regularly
6. **Automated rollback**: On health check failure

## Troubleshooting

### App Out of Sync

\`\`\`bash
argocd app diff aquapump-production
argocd app sync aquapump-production --force
\`\`\`

### Sync Failed

\`\`\`bash
argocd app get aquapump-production --show-operation
kubectl logs -n argocd deployment/argocd-application-controller
\`\`\`

### Manual Override Required

\`\`\`bash
argocd app set aquapump-production --sync-policy none
# Make manual changes
kubectl apply -f ...
# Re-enable GitOps
argocd app set aquapump-production --sync-policy automated
\`\`\`

## Monitoring

### Argo CD Metrics

Prometheus endpoints available at:
- \`argocd-metrics:8082/metrics\`
- \`argocd-server-metrics:8083/metrics\`

### Notifications

Configure notifications via:
- Slack
- Email
- Webhook
- MS Teams

Example:

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-notifications-cm
data:
  service.slack: |
    token: $slack-token
  template.app-deployed: |
    message: Application {{.app.metadata.name}} deployed!
  trigger.on-deployed: |
    - when: app.status.operationState.phase in ['Succeeded']
      send: [app-deployed]
\`\`\`

## Resources

- [Argo CD Docs](https://argo-cd.readthedocs.io/)
- [GitOps Principles](https://opengitops.dev/)
- [Helm Best Practices](https://helm.sh/docs/chart_best_practices/)
