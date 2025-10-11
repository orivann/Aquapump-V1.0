# Quick Deployment Guide

## Docker Deployment

### Development
```bash
docker-compose up
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Kubernetes Deployment

### Prerequisites
1. Have a Kubernetes cluster running
2. Install kubectl
3. Configure kubectl to connect to your cluster

### Steps

1. **Create namespace (optional)**
```bash
kubectl create namespace aquapump
kubectl config set-context --current --namespace=aquapump
```

2. **Create secrets**
```bash
cp kubernetes/secrets.yaml.example kubernetes/secrets.yaml
# Edit kubernetes/secrets.yaml with your values
kubectl apply -f kubernetes/secrets.yaml
```

3. **Deploy everything**
```bash
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/hpa.yaml
kubectl apply -f kubernetes/ingress.yaml
```

4. **Verify deployment**
```bash
kubectl get pods
kubectl get svc
kubectl get ingress
```

5. **Access your application**
```bash
# Get the external IP
kubectl get svc aquapump-service

# Or use port-forward for testing
kubectl port-forward svc/aquapump-service 8080:80
```

## Update Deployment

### Update image
```bash
# Build new image
docker build -t aquapump:v1.0.1 .

# Push to registry
docker push aquapump:v1.0.1

# Update deployment
kubectl set image deployment/aquapump-app aquapump-app=aquapump:v1.0.1

# Or edit deployment.yaml and apply
kubectl apply -f kubernetes/deployment.yaml
```

## Rollback

```bash
# View rollout history
kubectl rollout history deployment/aquapump-app

# Rollback to previous version
kubectl rollout undo deployment/aquapump-app

# Rollback to specific revision
kubectl rollout undo deployment/aquapump-app --to-revision=2
```

## Monitoring

```bash
# Watch pods
kubectl get pods -w

# View logs
kubectl logs -f deployment/aquapump-app

# View events
kubectl get events --sort-by=.metadata.creationTimestamp

# Check resource usage
kubectl top pods
kubectl top nodes
```

## Scaling

```bash
# Manual scaling
kubectl scale deployment aquapump-app --replicas=5

# Auto-scaling is configured via HPA
kubectl get hpa
```

## Cleanup

```bash
# Delete all resources
kubectl delete -f kubernetes/

# Or delete namespace
kubectl delete namespace aquapump
```
