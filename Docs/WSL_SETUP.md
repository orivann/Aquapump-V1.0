# WSL Setup Guide for AquaPump

## Problem: Can't Access localhost:8081 from Windows Browser

When running the Expo web server from WSL, it might not be accessible from your Windows browser at `localhost:8081` due to network binding issues.

## Solution

### Option 1: Use the Provided Script (Recommended)

We've created a bash script that properly configures the network binding:

```bash
# Make the script executable
chmod +x start-web-wsl.sh

# Run the script
./start-web-wsl.sh
```

The script:
- Sets `EXPO_DEV_SERVER_HOST=0.0.0.0` to bind to all network interfaces
- Starts the Expo web server on port 8081
- Makes it accessible from Windows browser

### Option 2: Manual Configuration

If you prefer to run commands manually:

```bash
# Export environment variable
export EXPO_DEV_SERVER_HOST=0.0.0.0

# Start the web server
bun run start-web
```

### Option 3: Find WSL IP Address

If localhost doesn't work, access via WSL IP:

```bash
# Get WSL IP address
ip addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'
```

Then access in Windows browser: `http://<WSL_IP>:8081`

## Troubleshooting

### Issue: Still Can't Access

**Check Windows Firewall:**
```powershell
# Run in PowerShell as Administrator
New-NetFirewallRule -DisplayName "WSL Expo" -Direction Inbound -LocalPort 8081 -Protocol TCP -Action Allow
```

**Check if port is listening:**
```bash
# In WSL
netstat -tuln | grep 8081
```

### Issue: Connection Refused

**Verify Expo is running:**
```bash
# Should show process on port 8081
ps aux | grep expo
```

**Check if .env file exists:**
```bash
# Should exist in project root
ls -la .env
```

### Issue: EADDRINUSE (Port in Use)

**Kill process using port 8081:**
```bash
# Find process
lsof -ti:8081

# Kill it
lsof -ti:8081 | xargs kill -9

# Or use fuser
fuser -k 8081/tcp
```

## WSL2 Networking Notes

### How WSL2 Networking Works
- WSL2 uses a virtual network adapter
- By default, binds to localhost only
- Need to bind to 0.0.0.0 for Windows access
- Firewall rules may block connections

### Alternative: WSL2 Port Forwarding (Windows 11 22H2+)

Recent Windows versions have better WSL2 networking:

```powershell
# In PowerShell as Administrator
netsh interface portproxy add v4tov4 listenport=8081 listenaddress=0.0.0.0 connectport=8081 connectaddress=<WSL_IP>
```

To remove:
```powershell
netsh interface portproxy delete v4tov4 listenport=8081 listenaddress=0.0.0.0
```

## Environment Configuration

The `.env` file should contain:

```bash
# Expo Public Variables
EXPO_PUBLIC_API_URL=http://localhost:8081/api
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com
EXPO_PUBLIC_AI_CHAT_KEY=sk-abcdijkl1234uvwxabcdijkl1234uvwxabcdijkl

# Backend Variables
NODE_ENV=development
PORT=8081
CORS_ORIGIN=*
```

## Quick Commands Reference

```bash
# Start web server (recommended)
./start-web-wsl.sh

# Or manually
export EXPO_DEV_SERVER_HOST=0.0.0.0
bun run start-web

# Get WSL IP
hostname -I | awk '{print $1}'

# Check if port is open
curl http://localhost:8081/api/health

# View logs
tail -f ~/.expo/Metro-*.log
```

## Performance Tips

### Enable WSL2 DNS Tunneling (Windows 11)

Edit `%UserProfile%\.wslconfig`:

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
```

Then restart WSL:
```powershell
wsl --shutdown
```

### Increase WSL2 Memory (Optional)

Edit `%UserProfile%\.wslconfig`:

```ini
[wsl2]
memory=4GB
processors=2
swap=2GB
```

## Docker in WSL

If using Docker:

```bash
# Start with Docker Compose
docker-compose up

# Access at localhost:8081 (Docker handles port mapping)
```

Docker usually handles port forwarding better than direct Expo binding.

## Best Practices

1. **Always use the script** - `./start-web-wsl.sh`
2. **Check firewall** - Allow port 8081
3. **Use .env file** - Keep configuration consistent
4. **Test with curl** - Verify server is running
5. **Check WSL IP** - Know your WSL network address

## Common Error Messages

### "EXPO_DEV_SERVER_HOST not set"
→ Run the provided script or export the variable manually

### "Failed to bind to address"
→ Port is already in use, kill the process

### "Network request failed"
→ Firewall is blocking, check Windows Firewall

### "Connection timed out"
→ Wrong IP address or firewall issue

## Quick Fix Checklist

- [ ] `.env` file exists in project root
- [ ] Ran `./start-web-wsl.sh` or exported `EXPO_DEV_SERVER_HOST=0.0.0.0`
- [ ] Port 8081 is not in use by another process
- [ ] Windows Firewall allows port 8081
- [ ] Can curl `http://localhost:8081/api/health` from WSL
- [ ] Tried accessing via WSL IP instead of localhost

## Support

If issues persist:
1. Check WSL version: `wsl --version`
2. Update WSL: `wsl --update`
3. Restart WSL: `wsl --shutdown` then reopen
4. Try Docker instead: `docker-compose up`

## Additional Resources

- [WSL Networking Documentation](https://docs.microsoft.com/en-us/windows/wsl/networking)
- [Expo Web Documentation](https://docs.expo.dev/guides/customizing-webpack/)
- [WSL2 Port Forwarding](https://github.com/microsoft/WSL/issues/4150)
