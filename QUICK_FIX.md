# 🚨 QUICK FIX: Stop Seeing Expo Dev Page

## The Problem
You're seeing the default Expo development page instead of your AquaPump app.

## The Solution

### ✅ Option 1: Use Production Docker Build (RECOMMENDED)

This serves your actual app, not the Expo dev server:

```bash
# 1. Make script executable
chmod +x scripts/docker-rebuild.sh

# 2. Clean rebuild everything
./scripts/docker-rebuild.sh

# 3. Wait ~2 minutes for build, then open:
# http://localhost:8080
```

**This will show your ACTUAL app** - the AquaPump landing page with Hero, Technology, Products sections, and the pump management interface.

---

### ✅ Option 2: Local Development (with Expo dev server)

If you want hot reload during development:

```bash
# Terminal 1: Start backend
bun run backend/server.ts

# Terminal 2: Start frontend
npx expo start --web
```

Then press `w` to open web browser. You'll see your app at `http://localhost:19006`

---

## What Was Fixed

1. **Dockerfile.frontend**: Now properly copies all frontend files and builds static web export
2. **Dockerfile.backend**: Ready to run Bun server
3. **docker-compose.yml**: Correct port mapping (8080→frontend, 8081→backend)

## Verify It Works

After Docker build completes:

```bash
# Check containers are running
docker compose -f infra/docker-compose.yml ps

# Check frontend logs
docker compose -f infra/docker-compose.yml logs frontend

# Check backend logs  
docker compose -f infra/docker-compose.yml logs backend

# Open in browser
open http://localhost:8080
```

You should see:
- ✅ AquaPump branded landing page
- ✅ Navigation menu
- ✅ Hero section with animations
- ✅ Technology, Products, About sections
- ✅ NO Expo dev landing page

---

## Still Not Working?

### Kill port conflicts:
```bash
lsof -ti:8080 | xargs kill -9
lsof -ti:8081 | xargs kill -9
```

### Full cleanup:
```bash
docker compose -f infra/docker-compose.yml down -v
docker system prune -af
docker volume prune -f
./scripts/docker-rebuild.sh
```

### Check your browser cache:
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
- Or open in incognito mode

---

## Why This Happens

The Expo dev page appears when you run `expo start --web` because Expo starts a development server that shows:
1. QR code for mobile testing
2. Links to open in different platforms
3. Dev tools

**The Docker build fixes this** by:
1. Running `expo export:web` → Creates static production build
2. Serving with `serve` → No dev server, just your app
3. Your actual AquaPump landing page loads instantly

---

**Need help?** Check logs: `docker compose -f infra/docker-compose.yml logs -f`
