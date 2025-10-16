# Helm Charts Guide

Complete guide to AquaPump Helm charts.

## Overview

Helm charts provide:
- **Templated Kubernetes manifests**
- **Environment-specific values**
- **Version management**
- **Easy upgrades and rollbacks**

## Chart Structure

\`\`\`
infra/helm/aquapump/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Default values (production)
├── values-dev.yaml         # Development overrides
├── values-staging.yaml     # Staging overrides
└── templates/
    ├── _helpers.tpl        # Template helpers
    ├── deployment.yaml     # Pod deployment
    ├── service.yaml        # Kubernetes service
    ├── ingress.yaml        # Ingress rules
    ├── configmap.yaml      # Configuration
    ├── hpa.yaml           # Auto-scaling
    ├── pdb.yaml           # Pod disruption budget
    ├── networkpolicy.yaml  # Network rules
    └── serviceaccount.yaml # Service account
\`\`\`

## Installation

### Using Script (Recommended)

\`\`\`bash
cd scripts
./deploy-helm.sh dev        # Development
./deploy-helm.sh staging    # Staging
./deploy-helm.sh production # Production
\`\`\`

### Manual Installation

\`\`\`bash
helm install aquapump infra/helm/aquapump \\
  --namespace aquapump-production \\
  --values infra/helm/aquapump/values.yaml \\
  --create-namespace \\
  --wait
\`\`\`

## Configuration

### Key Values

#### Image Configuration

\`\`\`yaml
image:
  repository: ghcr.io/your-org/aquapump
  tag: "v1.0.0"
  pullPolicy: IfNotPresent
\`\`\`

#### Scaling

\`\`\`yaml
replicaCount: 3

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80
\`\`\`

#### Resources

\`\`\`yaml
resources:
  requests:
    cpu: 250m
    memory: 512Mi
  limits:
    cpu: 1000m
    memory: 2Gi
\`\`\`

#### Ingress

\`\`\`yaml
ingress:
  enabled: true
  className: "nginx"
  hosts:
    - host: aquapump.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: aquapump-tls
      hosts:
        - aquapump.example.com
\`\`\`

#### Environment Variables

\`\`\`yaml
env:
  NODE_ENV: production
  PORT: "8081"
  LOG_LEVEL: info

configMap:
  EXPO_PUBLIC_API_URL: "https://aquapump.example.com/api"
  CORS_ORIGIN: "https://aquapump.example.com"
\`\`\`

## Customization

### Override Values

Create custom values file:

\`\`\`yaml
# custom-values.yaml
replicaCount: 5

image:
  tag: "v2.0.0"

resources:
  limits:
    memory: 4Gi
\`\`\`

Install with custom values:

\`\`\`bash
helm install aquapump infra/helm/aquapump \\
  -f infra/helm/aquapump/values.yaml \\
  -f custom-values.yaml \\
  -n aquapump-production
\`\`\`

### Command-line Overrides

\`\`\`bash
helm install aquapump infra/helm/aquapump \\
  --set replicaCount=5 \\
  --set image.tag=v2.0.0 \\
  -n aquapump-production
\`\`\`

## Upgrades

### Upgrade Release

\`\`\`bash
helm upgrade aquapump infra/helm/aquapump \\
  -f infra/helm/aquapump/values.yaml \\
  -n aquapump-production \\
  --wait
\`\`\`

### Upgrade with Rollback on Failure

\`\`\`bash
helm upgrade aquapump infra/helm/aquapump \\
  -f infra/helm/aquapump/values.yaml \\
  -n aquapump-production \\
  --atomic \\
  --timeout 5m
\`\`\`

## Rollback

### View Release History

\`\`\`bash
helm history aquapump -n aquapump-production
\`\`\`

### Rollback to Previous

\`\`\`bash
helm rollback aquapump -n aquapump-production
\`\`\`

### Rollback to Specific Revision

\`\`\`bash
helm rollback aquapump 3 -n aquapump-production
\`\`\`

### Using Script

\`\`\`bash
cd scripts
./rollback.sh production     # Previous revision
./rollback.sh production 3   # Specific revision
\`\`\`

## Testing

### Lint Chart

\`\`\`bash
helm lint infra/helm/aquapump
\`\`\`

### Dry Run

\`\`\`bash
helm install aquapump infra/helm/aquapump \\
  --dry-run --debug \\
  -n aquapump-production
\`\`\`

### Template Output

\`\`\`bash
helm template aquapump infra/helm/aquapump \\
  -f infra/helm/aquapump/values.yaml
\`\`\`

## Environment-Specific Configurations

### Development

\`\`\`yaml
# values-dev.yaml
replicaCount: 1
autoscaling:
  enabled: false
resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 1Gi
env:
  NODE_ENV: development
  LOG_LEVEL: debug
\`\`\`

### Staging

\`\`\`yaml
# values-staging.yaml
replicaCount: 2
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 5
resources:
  requests:
    cpu: 200m
    memory: 384Mi
env:
  NODE_ENV: staging
\`\`\`

### Production

\`\`\`yaml
# values.yaml
replicaCount: 3
autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
resources:
  requests:
    cpu: 250m
    memory: 512Mi
  limits:
    cpu: 1000m
    memory: 2Gi
env:
  NODE_ENV: production
  LOG_LEVEL: info
\`\`\`

## Troubleshooting

### Check Release Status

\`\`\`bash
helm status aquapump -n aquapump-production
\`\`\`

### View Release Values

\`\`\`bash
helm get values aquapump -n aquapump-production
\`\`\`

### View All Resources

\`\`\`bash
helm get manifest aquapump -n aquapump-production
\`\`\`

### Uninstall Release

\`\`\`bash
helm uninstall aquapump -n aquapump-production
\`\`\`

## Best Practices

1. **Always use values files**: Avoid \`--set\` for production
2. **Version your charts**: Update \`Chart.yaml\` version
3. **Test before production**: Use dev/staging first
4. **Atomic upgrades**: Use \`--atomic\` flag
5. **Keep history**: Don't delete old releases
6. **Document changes**: Update CHANGELOG.md

## Advanced Features

### Hooks

Add pre/post install hooks:

\`\`\`yaml
apiVersion: batch/v1
kind: Job
metadata:
  annotations:
    "helm.sh/hook": pre-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": before-hook-creation
spec:
  template:
    spec:
      containers:
      - name: db-migrate
        image: migrate/migrate
        command: ["migrate", "-database", "postgres://...", "up"]
      restartPolicy: Never
\`\`\`

### Dependencies

\`\`\`yaml
# Chart.yaml
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: "https://charts.bitnami.com/bitnami"
    condition: postgresql.enabled
\`\`\`

### Named Templates

\`\`\`yaml
{{- define "aquapump.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}
\`\`\`
