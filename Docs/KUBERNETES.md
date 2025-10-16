# Kubernetes Deployment Guide

Complete guide for deploying AquaPump to Kubernetes.

## Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl installed and configured
- Container registry access (Docker Hub, GCR, ECR, etc.)
- Basic knowledge of Kubernetes concepts

## Architecture

```
┌─────────────────────────────────────────┐
│           Load Balancer / Ingress        │
│         (HTTPS/TLS Termination)          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        Kubernetes Service                │
│        (ClusterIP/LoadBalancer)          │
└──────────────┬──────────────────────────┘
               │
       ┌───────┼───────┐
       ▼       ▼       ▼
   ┌─────┐ ┌─────┐ ┌─────┐
   │Pod 1│ │Pod 2│ │Pod N│
   │Expo │ │Expo │ │Expo │
   │Hono │ │Hono │ │Hono │
   │tRPC │ │tRPC │ │tRPC │
   └─────┘ └─────┘ └─────┘
```

## Quick Start

### 1. Prepare Secrets

```bash
# Copy secrets template
cp kubernetes/secrets.yaml.example kubernetes/secrets.yaml

# Edit with your values
nano kubernetes/secrets.yaml
```

### 2. Deploy All Resources

```bash
# Create namespace (optional)
kubectl create namespace aquapump
kubectl config set-context --current --namespace=aquapump

# Deploy everything
kubectl apply -f kubernetes/

# Or deploy individually
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secrets.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/hpa.yaml
kubectl apply -f kubernetes/ingress.yaml
```

### 3. Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get svc

# Check ingress
kubectl get ingress

# Check logs
kubectl logs -f deployment/aquapump-app
```

## Configuration Files

### Namespace (namespace.yaml)

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: aquapump
```

Creates isolated namespace for the application.

### ConfigMap (configmap.yaml)

Stores non-sensitive configuration:
- API URLs
- Feature flags
- Application settings

```bash
# View ConfigMap
kubectl get configmap aquapump-config -o yaml

# Edit ConfigMap
kubectl edit configmap aquapump-config
```

### Secrets (secrets.yaml)

Stores sensitive data (base64 encoded):
- API keys
- Credentials
- Certificates

```bash
# Create secret
kubectl create secret generic aquapump-secrets \
  --from-literal=AI_CHAT_KEY=your-key-here

# View secrets (base64 encoded)
kubectl get secret aquapump-secrets -o yaml

# Decode secret
kubectl get secret aquapump-secrets -o jsonpath='{.data.AI_CHAT_KEY}' | base64 -d
```

### Deployment (deployment.yaml)

Main application deployment:
- **Replicas**: 3 pods by default
- **Strategy**: RollingUpdate (zero-downtime)
- **Resources**: CPU and memory limits
- **Probes**: Health checks

Key features:
```yaml
replicas: 3
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0

resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "2Gi"
    cpu: "1000m"

livenessProbe:
  httpGet:
    path: /api/health
    port: 8081

readinessProbe:
  httpGet:
    path: /api/ready
    port: 8081
```

### Service (deployment.yaml)

Exposes the application:
- **Type**: LoadBalancer (creates external IP)
- **Port**: 80 (external) → 8081 (container)

```bash
# Get service external IP
kubectl get svc aquapump-service

# Wait for external IP
kubectl get svc aquapump-service -w
```

### HPA - Horizontal Pod Autoscaler (hpa.yaml)

Auto-scales based on metrics:
- **Min replicas**: 2
- **Max replicas**: 10
- **Metrics**: CPU (70%), Memory (80%)

```bash
# Check HPA status
kubectl get hpa

# Detailed view
kubectl describe hpa aquapump-hpa

# Watch auto-scaling
watch kubectl get hpa
```

### Ingress (ingress.yaml)

Routes external traffic:
- **HTTPS/TLS**: SSL termination
- **Host**: your-domain.com
- **Path**: / → aquapump-service

```bash
# Check ingress
kubectl get ingress

# Get ingress IP
kubectl get ingress aquapump-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# Describe ingress
kubectl describe ingress aquapump-ingress
```

## Management Commands

### Scaling

```bash
# Manual scale
kubectl scale deployment aquapump-app --replicas=5

# Check current replicas
kubectl get deployment aquapump-app

# Auto-scaling is handled by HPA
kubectl get hpa
```

### Updates

```bash
# Update image
kubectl set image deployment/aquapump-app \
  aquapump-app=your-registry/aquapump:v1.0.1

# Or edit deployment
kubectl edit deployment aquapump-app

# Watch rollout
kubectl rollout status deployment/aquapump-app

# Rollout history
kubectl rollout history deployment/aquapump-app
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/aquapump-app

# Rollback to specific revision
kubectl rollout undo deployment/aquapump-app --to-revision=2

# View revision history
kubectl rollout history deployment/aquapump-app
```

### Logs

```bash
# View logs
kubectl logs -f deployment/aquapump-app

# View specific pod
kubectl logs -f <pod-name>

# Previous logs (if pod restarted)
kubectl logs -f <pod-name> --previous

# All pods
kubectl logs -f -l app=aquapump-app

# Using script
./scripts/logs.sh k8s
```

### Debugging

```bash
# Describe pod
kubectl describe pod <pod-name>

# Get events
kubectl get events --sort-by=.metadata.creationTimestamp

# Execute command in pod
kubectl exec -it <pod-name> -- /bin/sh

# Port forward for testing
kubectl port-forward svc/aquapump-service 8080:80

# Check resource usage
kubectl top pods
kubectl top nodes
```

## Health Checks

### Probe Types

1. **Liveness Probe**: Checks if container is alive
2. **Readiness Probe**: Checks if container can serve traffic
3. **Startup Probe**: Checks initial startup

### Endpoints

- **/api/health**: Health check
- **/api/ready**: Readiness check
- **/api**: API information

### Test Health

```bash
# From outside cluster
curl http://<external-ip>/api/health

# From inside cluster
kubectl run test-pod --image=busybox --rm -it -- \
  wget -qO- http://aquapump-service/api/health

# Via port-forward
kubectl port-forward svc/aquapump-service 8080:80
curl http://localhost:8080/api/health
```

## Security

### Network Policies (Future)

```bash
# Create network policy
kubectl apply -f kubernetes/network-policy.yaml
```

### RBAC (Future)

```bash
# Create service account
kubectl create serviceaccount aquapump-sa

# Create role and binding
kubectl create role aquapump-role --verb=get,list --resource=pods
kubectl create rolebinding aquapump-binding \
  --role=aquapump-role --serviceaccount=aquapump:aquapump-sa
```

### Pod Security Standards

```bash
# Enable pod security
kubectl label namespace aquapump pod-security.kubernetes.io/enforce=restricted
```

## Monitoring

### Metrics Server

```bash
# Install metrics server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Verify
kubectl get deployment metrics-server -n kube-system
```

### Resource Usage

```bash
# Pod metrics
kubectl top pods

# Node metrics
kubectl top nodes

# Watch continuously
watch kubectl top pods
```

### Prometheus (Future)

```bash
# Install Prometheus
helm install prometheus prometheus-community/prometheus

# Access Prometheus
kubectl port-forward svc/prometheus-server 9090:80
```

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods

# Describe pod
kubectl describe pod <pod-name>

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp

# Common issues:
# 1. ImagePullBackOff - Wrong image name
# 2. CrashLoopBackOff - Application error
# 3. Pending - Insufficient resources
```

### Service Not Accessible

```bash
# Check service
kubectl get svc
kubectl describe svc aquapump-service

# Check endpoints
kubectl get endpoints aquapump-service

# Test from inside cluster
kubectl run test-pod --image=busybox --rm -it -- \
  wget -qO- http://aquapump-service
```

### HPA Not Working

```bash
# Check HPA
kubectl get hpa
kubectl describe hpa aquapump-hpa

# Check metrics server
kubectl get deployment metrics-server -n kube-system

# Check pod metrics
kubectl top pods
```

### Ingress Issues

```bash
# Check ingress
kubectl describe ingress aquapump-ingress

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx

# Verify DNS
nslookup your-domain.com
```

## Best Practices

### Resource Management

- Set appropriate requests and limits
- Use HPA for auto-scaling
- Monitor resource usage regularly

### High Availability

- Run multiple replicas (minimum 3)
- Use anti-affinity rules (future)
- Distribute across availability zones

### Updates

- Use RollingUpdate strategy
- Test in staging first
- Have rollback plan ready
- Monitor during updates

### Security

- Use secrets for sensitive data
- Enable RBAC
- Use network policies
- Regular security updates

### Monitoring

- Enable health checks
- Monitor resource usage
- Set up alerting
- Review logs regularly

## Advanced Configuration

### Custom Resource Limits

Edit `kubernetes/deployment.yaml`:

```yaml
resources:
  requests:
    memory: "1Gi"
    cpu: "500m"
  limits:
    memory: "4Gi"
    cpu: "2000m"
```

### Custom Auto-scaling

Edit `kubernetes/hpa.yaml`:

```yaml
spec:
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 60
```

### Multiple Environments

```bash
# Create different namespaces
kubectl create namespace aquapump-dev
kubectl create namespace aquapump-staging
kubectl create namespace aquapump-prod

# Deploy to specific namespace
kubectl apply -f kubernetes/ -n aquapump-staging
```

## Cleanup

```bash
# Delete all resources
kubectl delete -f kubernetes/

# Or delete namespace (deletes everything in it)
kubectl delete namespace aquapump

# Delete specific resources
kubectl delete deployment aquapump-app
kubectl delete service aquapump-service
kubectl delete ingress aquapump-ingress
```

## Scripts

Use provided scripts for common operations:

```bash
# Make executable
chmod +x scripts/*.sh

# Deploy
./scripts/deploy.sh production

# View logs
./scripts/logs.sh k8s

# Rollback
./scripts/rollback.sh
```

## Support

For issues:
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

## Quick Reference

| Task | Command |
|------|---------|
| Deploy | `kubectl apply -f kubernetes/` |
| Check pods | `kubectl get pods` |
| View logs | `kubectl logs -f deployment/aquapump-app` |
| Scale | `kubectl scale deployment aquapump-app --replicas=5` |
| Update image | `kubectl set image deployment/aquapump-app aquapump-app=image:tag` |
| Rollback | `kubectl rollout undo deployment/aquapump-app` |
| Port forward | `kubectl port-forward svc/aquapump-service 8080:80` |
| Execute in pod | `kubectl exec -it <pod-name> -- /bin/sh` |
| Check resources | `kubectl top pods` |
| Delete all | `kubectl delete -f kubernetes/` |

---

**Next Steps:**
- [Production Checklist](./PRODUCTION_CHECKLIST.md)
- [Monitoring Guide](./MONITORING.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
