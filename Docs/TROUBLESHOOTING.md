# AquaPump Troubleshooting Guide

## 🔧 Common Issues and Solutions

### Development Issues

#### Issue: Port 8081 Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::8081
```

**Solutions:**
```bash
# Find process using port 8081
lsof -ti:8081

# Kill the process
lsof -ti:8081 | xargs kill -9

# Or use fuser (Linux)
fuser -k 8081/tcp

# On Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess | Stop-Process
```

#### Issue: Can't Access localhost from WSL

**Symptoms:**
- Running `bun run start-web` in WSL
- Can't access `localhost:8081` from Windows browser
- Connection timeout or refused

**Solutions:**

See [WSL Setup Guide](./WSL_SETUP.md) for detailed instructions.

Quick fix:
```bash
# Use the provided script
./start-web-wsl.sh

# Or export environment variable
export EXPO_DEV_SERVER_HOST=0.0.0.0
bun run start-web
```

#### Issue: Dependencies Won't Install

**Symptoms:**
```
error: package not found
```

**Solutions:**
```bash
# Clear cache
rm -rf node_modules
rm bun.lock

# Reinstall
bun install

# If still failing, try with --force
bun install --force
```

#### Issue: TypeScript Errors

**Symptoms:**
```
TS2307: Cannot find module '@/components/...'
```

**Solutions:**
```bash
# Restart TypeScript server in your IDE

# Rebuild TypeScript
bunx tsc --noEmit

# Check tsconfig.json paths are correct
cat tsconfig.json
```

### Runtime Errors

#### Issue: White Screen on Web

**Symptoms:**
- App loads but shows blank white screen
- No errors in console

**Solutions:**
```bash
# Clear Expo cache
bunx expo start --clear

# Check browser console for errors
# Press F12 in browser

# Verify all components are exported correctly
# Check for circular dependencies
```

#### Issue: Navigation Not Working

**Symptoms:**
- Links don't navigate
- Back button doesn't work

**Solutions:**
```bash
# Clear Expo cache
bunx expo start --clear

# Check Expo Router version
bun list expo-router

# Verify file structure in app/ directory
ls -la app/
```

#### Issue: Theme Not Loading

**Symptoms:**
- App shows wrong colors
- Theme toggle doesn't work

**Solutions:**
```typescript
// Check ThemeContext is properly initialized
// Verify AsyncStorage is accessible

// In browser console:
localStorage.getItem('theme')

// Clear local storage if needed:
localStorage.clear()
```

### Docker Issues

#### Issue: Docker Build Fails

**Symptoms:**
```
ERROR: failed to solve: process "/bin/sh -c bun install" did not complete successfully
```

**Solutions:**
```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker build --no-cache -t aquapump:latest .

# Check Dockerfile syntax
cat Dockerfile

# Verify package.json is valid
bun run lint
```

#### Issue: Container Keeps Restarting

**Symptoms:**
```
container keeps restarting
kubectl get pods shows CrashLoopBackOff
```

**Solutions:**
```bash
# Check logs
docker logs <container_id>

# Or in Kubernetes
kubectl logs <pod-name>

# Check health endpoint
curl http://localhost:8081/api/health

# Verify environment variables
docker inspect <container_id> | grep -A 20 "Env"
```

#### Issue: Can't Connect to Container

**Symptoms:**
- Container is running but not accessible
- Connection refused errors

**Solutions:**
```bash
# Check port mapping
docker ps
# Should show 0.0.0.0:8081->8081/tcp

# Verify container is listening
docker exec <container_id> netstat -tuln | grep 8081

# Check if firewall is blocking
sudo ufw status
```

### Kubernetes Issues

#### Issue: Pods Not Starting

**Symptoms:**
```
kubectl get pods shows ImagePullBackOff or CrashLoopBackOff
```

**Solutions:**
```bash
# Describe the pod for details
kubectl describe pod <pod-name>

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp

# Common fixes:

# 1. ImagePullBackOff - Image not found
kubectl set image deployment/aquapump-app aquapump-app=<correct-image-name>

# 2. CrashLoopBackOff - Application error
kubectl logs <pod-name>

# 3. Pending - Insufficient resources
kubectl describe node
```

#### Issue: Service Not Accessible

**Symptoms:**
- Pods are running but service returns 503
- Can't access via LoadBalancer IP

**Solutions:**
```bash
# Check service configuration
kubectl get svc aquapump-service
kubectl describe svc aquapump-service

# Verify endpoints are registered
kubectl get endpoints aquapump-service

# Test from within cluster
kubectl run test-pod --image=busybox --rm -it -- wget -O- http://aquapump-service

# Check ingress
kubectl describe ingress aquapump-ingress
```

#### Issue: HPA Not Scaling

**Symptoms:**
- Auto-scaling not working
- Replicas stay at minimum

**Solutions:**
```bash
# Check HPA status
kubectl get hpa
kubectl describe hpa aquapump-hpa

# Verify metrics server is installed
kubectl get deployment metrics-server -n kube-system

# Check current metrics
kubectl top pods
kubectl top nodes

# Force scaling for testing
kubectl scale deployment aquapump-app --replicas=5
```

### Performance Issues

#### Issue: Slow Load Times

**Symptoms:**
- Pages take long to load
- High memory usage

**Solutions:**
```typescript
// 1. Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // component code
});

// 2. Use useMemo for expensive calculations
const result = useMemo(() => expensiveCalculation(data), [data]);

// 3. Use useCallback for functions
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);

// 4. Check for unnecessary re-renders
// Add console.log to track renders
```

```bash
# Monitor resource usage
kubectl top pods

# Check logs for errors
kubectl logs -f deployment/aquapump-app

# Profile in browser
# Open DevTools -> Performance tab
```

#### Issue: High Memory Usage

**Symptoms:**
- Pods using more memory than expected
- OOMKilled errors

**Solutions:**
```bash
# Check current usage
kubectl top pods

# Increase memory limits in deployment.yaml
# resources:
#   limits:
#     memory: "4Gi"

# Apply changes
kubectl apply -f kubernetes/deployment.yaml

# Check for memory leaks
# Use Chrome DevTools Memory profiler
```

### API Issues

#### Issue: tRPC Errors

**Symptoms:**
```
TRPCClientError: Failed to fetch
```

**Solutions:**
```typescript
// 1. Check API URL is correct
console.log(process.env.EXPO_PUBLIC_API_URL);

// 2. Verify backend is running
// curl http://localhost:8081/api/health

// 3. Check CORS configuration in backend/hono.ts
// Make sure CORS allows your origin

// 4. Check network tab in browser DevTools
// Look for failed requests
```

#### Issue: CORS Errors

**Symptoms:**
```
Access to fetch blocked by CORS policy
```

**Solutions:**
```typescript
// Update backend/hono.ts
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// Update .env with correct origins
CORS_ORIGIN=http://localhost:8081,https://yourdomain.com
```

### Environment Issues

#### Issue: Environment Variables Not Loading

**Symptoms:**
- `process.env.EXPO_PUBLIC_*` is undefined
- API calls fail

**Solutions:**
```bash
# 1. Check .env file exists
ls -la .env

# 2. Verify .env format (no quotes needed)
cat .env

# 3. Restart dev server
bunx expo start --clear

# 4. In production, check Kubernetes secrets
kubectl get secrets
kubectl describe secret aquapump-secrets
```

### Build Issues

#### Issue: Webpack Errors

**Symptoms:**
```
Module not found: Error: Can't resolve '@/...'
```

**Solutions:**
```bash
# Clear cache
bunx expo start --clear

# Check tsconfig.json paths
cat tsconfig.json

# Verify file exists
ls -la <path-to-file>

# Rebuild
rm -rf .expo .cache node_modules
bun install
bunx expo start
```

#### Issue: React Native Web Compatibility

**Symptoms:**
- Component works on mobile but not web
- Web-specific errors

**Solutions:**
```typescript
// Use Platform checks
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Web-specific code
} else {
  // Mobile-specific code
}

// Or use Platform.select
const styles = Platform.select({
  web: { /* web styles */ },
  default: { /* mobile styles */ }
});
```

## 🆘 Emergency Procedures

### Complete Reset

```bash
# 1. Stop all services
docker-compose down
kubectl delete -f kubernetes/

# 2. Clean everything
rm -rf node_modules .expo .cache
docker system prune -a

# 3. Reinstall
bun install

# 4. Restart
bun run start-web
```

### Database Recovery (Future)

```bash
# When database is added
# 1. Stop application
# 2. Restore from backup
# 3. Verify data integrity
# 4. Restart application
```

### Rollback Production

```bash
# Using scripts
./scripts/rollback.sh

# Or manually with Kubernetes
kubectl rollout undo deployment/aquapump-app

# To specific revision
kubectl rollout undo deployment/aquapump-app --to-revision=2
```

## 📊 Debugging Tools

### Check Application Health

```bash
# Local
curl http://localhost:8081/api/health

# Docker
docker exec <container-id> wget -qO- http://localhost:8081/api/health

# Kubernetes
kubectl exec <pod-name> -- wget -qO- http://localhost:8081/api/health
```

### View Logs

```bash
# Local - Check terminal

# Docker
docker-compose logs -f
docker logs -f <container-id>

# Kubernetes
kubectl logs -f deployment/aquapump-app
kubectl logs -f <pod-name>
./scripts/logs.sh k8s
```

### Monitor Resources

```bash
# Docker
docker stats

# Kubernetes
kubectl top pods
kubectl top nodes
watch -n 1 kubectl get pods
```

## 🔍 Advanced Debugging

### Enable Debug Mode

```bash
# Set environment variable
export DEBUG=expo*,react-native*

# Start with debug
bun run start-web-dev
```

### Chrome DevTools

```javascript
// Add breakpoints in browser
debugger;

// Console commands
console.trace(); // Stack trace
console.time('operation'); // Start timer
console.timeEnd('operation'); // End timer
```

### React DevTools

```bash
# Install extension
# Chrome: React Developer Tools
# Firefox: React DevTools

# Inspect component tree
# Check props and state
# Profile performance
```

## 📞 Getting Help

### Check Documentation
- [Quick Start Guide](./QUICK_START.md)
- [WSL Setup Guide](./WSL_SETUP.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)

### Collect Information

When asking for help, provide:
```bash
# System info
uname -a
node --version
bun --version
docker --version
kubectl version

# Application logs
kubectl logs <pod-name> --tail=100

# Resource usage
kubectl top pods

# Events
kubectl get events --sort-by=.metadata.creationTimestamp
```

## ✅ Prevention Checklist

- [ ] Keep dependencies updated
- [ ] Run tests before deploying
- [ ] Monitor resource usage
- [ ] Review logs regularly
- [ ] Keep documentation updated
- [ ] Have rollback plan ready
- [ ] Test in staging first
- [ ] Monitor health endpoints

## 🎯 Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Port in use | `lsof -ti:8081 \| xargs kill -9` |
| WSL localhost | `./start-web-wsl.sh` |
| Clear cache | `bunx expo start --clear` |
| Docker rebuild | `docker-compose up --build` |
| K8s redeploy | `kubectl rollout restart deployment/aquapump-app` |
| View logs | `./scripts/logs.sh k8s` |
| Health check | `curl localhost:8081/api/health` |

---

**Remember:** Most issues can be solved by:
1. Checking logs first
2. Clearing cache/restarting
3. Verifying configuration
4. Testing in isolation
