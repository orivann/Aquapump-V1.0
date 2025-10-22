# 🌊 AquaPump System Overview

Complete technical overview of the AquaPump production system.

---

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      PRODUCTION FLOW                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   GitHub    │─────▶│GitHub Actions│─────▶│ Docker Hub  │
│  (main)     │ push │   CI/CD      │build │  Registry   │
└─────────────┘      └──────────────┘      └──────┬──────┘
                                                   │
                                                   │pull
                                                   ▼
                     ┌──────────────────────────────────────┐
                     │     DEPLOYMENT TARGETS               │
                     ├──────────────────────────────────────┤
                     │                                      │
        ┌────────────┴──────────┐         ┌────────────────┴────┐
        │   Docker Compose      │         │    Kubernetes       │
        │   (Single Server)     │         │  (HA Cluster)       │
        └───────────────────────┘         └─────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                      RUNTIME FLOW                            │
└─────────────────────────────────────────────────────────────┘

     Internet
        │
        ▼
   ┌────────────┐
   │   Ingress  │  (HTTPS, SSL Termination)
   │ (Nginx/K8s)│
   └─────┬──────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌───────┐  ┌───────┐
│ Nginx │  │  API  │
│  App  │◄─┤  BE   │
└───┬───┘  └───┬───┘
    │          │
    │      ┌───▼────────┐
    │      │  Supabase  │
    │      │PostgreSQL  │
    │      │   Auth     │
    │      └────────────┘
    │
    ▼
 Browser/App
