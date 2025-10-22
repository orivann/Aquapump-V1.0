# 🚀 START HERE - AquaPump Quick Start

Get AquaPump running in 5 minutes.

---

## 🎯 Choose Your Path

### 👨‍💻 I want to **develop locally**
```bash
# 1. Initial setup (only once)
chmod +x setup.sh && ./setup.sh

# 2. Configure environment
nano .env  # Add your Supabase credentials

# 3. Start development
./infra/scripts/deploy-local.sh

# ✅ Access: http://localhost:8080
```

### 🏭 I want to **deploy to production**
```bash
# 1. Initial setup (only once)
chmod +x setup.sh && ./setup.sh

# 2. Configure production
cp .env.production.example .env.production
nano .env.production  # Add production values

# 3. Verify setup
./infra/scripts/verify-production.sh

# 4. Build images
./infra/scripts/build-prod.sh

# 5. Test locally
cd infra && docker compose -f docker-compose.prod.yml up

# 6. If everything works, push and deploy
./infra/scripts/push-prod.sh

# See DEPLOYMENT.md for server deployment
```

### 📚 I want to **learn the system**
```bash
# Read documentation in this order:
cat QUICK_REFERENCE.md      # Command reference
cat DEPLOYMENT.md            # Deployment guide  
cat PRODUCTION_SETUP.md      # Production details
cat SYSTEM_OVERVIEW.md       # Architecture
cat CHANGES_SUMMARY.md       # What was changed
```

---

## ⚡ Ultra Quick (1 command)

```bash
chmod +x setup.sh infra/scripts/*.sh && ./infra/scripts/deploy-local.sh
```

Then visit: http://localhost:8080

---

## 🔑 Required Environment Variables

### Minimum (Development)
```env
EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
```

### Production
Add to `.env.production`:
```env
EXPO_PUBLIC_RORK_API_BASE_URL=https://api.aquapump.com
CORS_ORIGIN=https://aquapump.com,https://www.aquapump.com
```

Get these from: https://supabase.com/dashboard/project/_/settings/api

---

## 🆘 Troubleshooting

### Port already in use
```bash
# Stop existing containers
docker stop $(docker ps -q)

# Or use different ports in docker-compose.yml
```

### Docker not running
```bash
# Start Docker Desktop or
sudo systemctl start docker
```

### Permission denied
```bash
chmod +x setup.sh
chmod +x infra/scripts/*.sh
```

### Build fails
```bash
# Clean and rebuild
docker system prune -f
./infra/scripts/build-prod.sh
```

---

## 📋 Checklist

- [ ] Docker installed and running
- [ ] Git repository cloned
- [ ] Environment file configured (.env)
- [ ] Scripts made executable
- [ ] Services started
- [ ] Can access http://localhost:8080

---

## 🎓 Next Steps After Setup

1. **Verify it works**: Test all features
2. **Read docs**: Check QUICK_REFERENCE.md
3. **Deploy**: Follow DEPLOYMENT.md when ready
4. **Customize**: Modify components and styles
5. **Monitor**: Check logs and health endpoints

---

## 📞 Get Help

- Commands: `cat QUICK_REFERENCE.md`
- Issues: Check DEPLOYMENT.md troubleshooting section
- Verify: `./infra/scripts/verify-production.sh`

---

**Ready? Run: `./setup.sh` and follow the prompts!** 🚀
