# Production Deployment Checklist

Complete checklist before deploying AquaPump to production.

## ☑️ Pre-Deployment

### Environment Setup
- [ ] Supabase project created and configured
- [ ] Database schema created and tested
- [ ] RLS policies configured correctly
- [ ] All environment variables set in Kubernetes secrets
- [ ] API keys rotated and secured
- [ ] TLS certificates issued (Let's Encrypt)

### Infrastructure
- [ ] Kubernetes cluster provisioned (v1.28+)
- [ ] Helm 3 installed
- [ ] Argo CD installed and configured
- [ ] Ingress controller deployed (nginx)
- [ ] cert-manager configured for TLS
- [ ] Namespaces created
- [ ] Resource quotas set

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] Linting passes (\`bun run lint\`)
- [ ] No console.errors in production code
- [ ] Sensitive data removed from code
- [ ] \`.env\` not committed to Git
- [ ] Dependencies updated and audited

### Docker
- [ ] Production Dockerfile optimized
- [ ] Multi-stage build working
- [ ] Image size < 500MB
- [ ] Non-root user configured
- [ ] Health checks working
- [ ] Image scanned for vulnerabilities (Trivy)

### Helm Charts
- [ ] Chart linted (\`helm lint\`)
- [ ] Values files for all environments
- [ ] Resource limits set appropriately
- [ ] HPA configured
- [ ] PDB configured
- [ ] Network policies created
- [ ] Probes configured correctly

### CI/CD
- [ ] GitHub Actions workflow tested
- [ ] Argo CD applications created
- [ ] GitOps repository configured
- [ ] Secrets configured in GitHub/Argo
- [ ] Automated rollback working
- [ ] Build notifications set up

## ☑️ Security

### Authentication & Authorization
- [ ] Supabase RLS enabled
- [ ] Service keys secured (backend only)
- [ ] Anon keys restricted properly
- [ ] CORS configured correctly
- [ ] Rate limiting implemented

### Network Security
- [ ] HTTPS only (no HTTP)
- [ ] TLS 1.2+ enforced
- [ ] Security headers configured
- [ ] Network policies applied
- [ ] Firewall rules configured
- [ ] DDoS protection enabled

### Container Security
- [ ] Non-root containers
- [ ] Read-only root filesystem
- [ ] Drop all capabilities
- [ ] No privilege escalation
- [ ] Security context configured
- [ ] Image scanning enabled

### Secrets Management
- [ ] No secrets in Git
- [ ] Kubernetes secrets encrypted at rest
- [ ] External secrets operator (optional)
- [ ] Secrets rotated regularly
- [ ] Access audited

## ☑️ Performance

### Scaling
- [ ] HPA tested under load
- [ ] Resource requests/limits tuned
- [ ] Pod anti-affinity configured
- [ ] Multi-replica deployment (3+)
- [ ] Load testing completed

### Optimization
- [ ] Docker image optimized
- [ ] Bundle size minimized
- [ ] Lazy loading implemented
- [ ] Caching configured (React Query)
- [ ] Database queries optimized
- [ ] Indexes created

### CDN & Caching
- [ ] Static assets CDN-ready
- [ ] Cache headers configured
- [ ] Image optimization enabled
- [ ] Compression enabled (gzip/brotli)

## ☑️ Monitoring & Observability

### Logging
- [ ] Structured logging implemented
- [ ] Log levels configured
- [ ] Sensitive data not logged
- [ ] Log aggregation set up
- [ ] Log retention configured

### Metrics
- [ ] Prometheus metrics exposed
- [ ] Service monitors created
- [ ] Grafana dashboards created
- [ ] Alert rules configured
- [ ] Uptime monitoring enabled

### Tracing
- [ ] OpenTelemetry configured (optional)
- [ ] Trace sampling configured
- [ ] Distributed tracing enabled

### Health Checks
- [ ] Liveness probe working
- [ ] Readiness probe working
- [ ] Startup probe working
- [ ] Health endpoints returning correctly

## ☑️ Backup & Recovery

### Database
- [ ] Automated backups enabled (Supabase)
- [ ] Backup retention configured
- [ ] Point-in-time recovery tested
- [ ] Backup restore tested

### Application
- [ ] Helm release history retained
- [ ] GitOps history available
- [ ] Rollback procedure documented
- [ ] Rollback tested successfully

### Disaster Recovery
- [ ] DR plan documented
- [ ] RTO/RPO defined
- [ ] Multi-region setup (optional)
- [ ] Failover tested

## ☑️ Documentation

- [ ] Architecture documented
- [ ] API reference complete
- [ ] Deployment guide updated
- [ ] Runbooks created
- [ ] Troubleshooting guide written
- [ ] Environment variables documented
- [ ] Change log maintained

## ☑️ Compliance

- [ ] Data privacy reviewed (GDPR, etc.)
- [ ] Security audit completed
- [ ] Compliance requirements met
- [ ] Terms of service updated
- [ ] Privacy policy updated
- [ ] Cookie consent implemented (if applicable)

## ☑️ Testing

### Functional Testing
- [ ] All features tested in staging
- [ ] User acceptance testing completed
- [ ] Cross-browser testing done
- [ ] Mobile responsiveness verified
- [ ] Accessibility tested (WCAG 2.1)

### Performance Testing
- [ ] Load testing completed
- [ ] Stress testing done
- [ ] Soak testing performed
- [ ] Performance benchmarks met

### Security Testing
- [ ] Penetration testing done (optional)
- [ ] Vulnerability scanning completed
- [ ] Security headers verified
- [ ] OWASP Top 10 addressed

## ☑️ Go-Live

### Communication
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled
- [ ] Support team briefed
- [ ] Status page prepared

### Deployment
- [ ] Staging deployment successful
- [ ] Production deployment plan reviewed
- [ ] Rollback plan ready
- [ ] Support team on standby

### Post-Deployment
- [ ] Health checks passing
- [ ] Logs monitored for errors
- [ ] Metrics within normal range
- [ ] User feedback collected
- [ ] Post-mortem scheduled

## 📝 Approval

- [ ] Technical Lead: _______________ Date: ___________
- [ ] DevOps Lead: _________________ Date: ___________
- [ ] Product Owner: _______________ Date: ___________
- [ ] Security Officer: _____________ Date: ___________

## 🚨 Emergency Contacts

- **On-call Engineer**: +1-XXX-XXX-XXXX
- **DevOps Lead**: devops@aquapump.com
- **Support Team**: support@aquapump.com
- **Slack**: #aquapump-production

## 🔗 Quick Links

- [Argo CD](https://argocd.example.com)
- [Grafana](https://grafana.example.com)
- [Supabase](https://app.supabase.com)
- [Status Page](https://status.aquapump.com)

---

**Remember**: Production deployments are serious. Take your time, follow this checklist, and don't skip steps!
