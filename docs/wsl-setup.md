# WSL Setup Guide

Fix localhost access issues when running AquaPump from WSL.

## The Problem

When running `bun run start-web` from WSL, the server starts but is not accessible from Windows browser at `localhost:8081`.

This happens because Expo binds to `127.0.0.1` by default, which is not accessible from Windows when running in WSL.

## Quick Solution

Use the provided startup script:

```bash
chmod +x start-web-wsl.sh
./start-web-wsl.sh
```

This script properly binds Expo to `0.0.0.0`, making it accessible from Windows.

## Manual Configuration

If you prefer to configure manually:

### Option 1: Environment Variable

Add to `.env`:

```env
EXPO_HOST=0.0.0.0
```

Then start normally:

```bash
bun run start-web
```

### Option 2: Command Line

```bash
EXPO_HOST=0.0.0.0 bun run start-web
```

### Option 3: Modify package.json

Update your `package.json` scripts:

```json
{
  "scripts": {
    "start-web": "EXPO_HOST=0.0.0.0 expo start --web --port 8081"
  }
}
```

## Verify It Works

1. Start the server:
   ```bash
   ./start-web-wsl.sh
   ```

2. Look for this in the output:
   ```
   Metro waiting on exp://0.0.0.0:8081
   ```

3. Open Windows browser:
   ```
   http://localhost:8081
   ```

4. The app should load successfully.

## Troubleshooting

### Still Can't Access

**Check firewall:**

```bash
# Allow port 8081 through Windows Firewall
# Run in PowerShell as Administrator:
New-NetFirewallRule -DisplayName "WSL Expo" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8081
```

**Check WSL networking:**

```bash
# Get WSL IP
ip addr show eth0 | grep inet

# Access via WSL IP from Windows
http://172.x.x.x:8081
```

### Port Already in Use

```bash
# Find and kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Or use different port
EXPO_HOST=0.0.0.0 expo start --web --port 3000
```

### Slow Loading

WSL2 networking can be slower than native. To improve performance:

1. **Use WSL distro close to Windows filesystem**
   - Keep project in WSL filesystem (`~/projects/`)
   - Not in `/mnt/c/` (Windows filesystem)

2. **Configure WSL memory**
   
   Create/edit `%USERPROFILE%\.wslconfig`:
   
   ```ini
   [wsl2]
   memory=8GB
   processors=4
   ```

3. **Restart WSL:**
   ```bash
   wsl --shutdown
   ```

### DNS Issues

If external APIs fail:

Edit `/etc/resolv.conf` in WSL:

```bash
sudo nano /etc/resolv.conf
```

Add:

```
nameserver 8.8.8.8
nameserver 8.8.4.4
```

## Understanding the Issue

### Why Does This Happen?

WSL2 uses a virtualized network with its own IP address. When you bind to `127.0.0.1` (localhost):

- ✅ WSL can access it
- ❌ Windows cannot access it

When you bind to `0.0.0.0` (all interfaces):

- ✅ WSL can access it
- ✅ Windows can access it via `localhost`
- ✅ Other devices on network can access it

### What is 0.0.0.0?

`0.0.0.0` means "bind to all available network interfaces":
- Loopback (127.0.0.1)
- WSL network interface
- Any other network interfaces

This allows connections from:
- WSL itself
- Windows host
- Other devices on your network (if firewall allows)

## Security Considerations

### Development

Binding to `0.0.0.0` in development is safe:
- Only accessible on your local network
- Firewall provides additional protection
- Development server is not production-ready

### Production

Never bind production servers to `0.0.0.0` without:
- Proper authentication
- HTTPS/TLS encryption
- Rate limiting
- Network security rules
- Firewall configuration

## Alternative Solutions

### 1. Use WSLg (WSL with GUI)

Run browser inside WSL:

```bash
# Install browser in WSL
sudo apt update
sudo apt install firefox

# Access via localhost in WSL
firefox http://localhost:8081
```

### 2. Port Forwarding

Forward WSL port to Windows:

```powershell
# Run in PowerShell as Administrator
netsh interface portproxy add v4tov4 listenport=8081 listenaddress=0.0.0.0 connectport=8081 connectaddress=<WSL_IP>
```

Get WSL IP:
```bash
ip addr show eth0 | grep inet | awk '{print $2}' | cut -d/ -f1
```

### 3. Use Docker Desktop

Run the app in Docker Desktop (which handles WSL networking):

```bash
docker-compose up
```

Access at `http://localhost:8081` from Windows.

## Recommended Approach

For best developer experience with WSL:

1. **Use the provided script:**
   ```bash
   ./start-web-wsl.sh
   ```

2. **Add to your shell config** (`~/.bashrc` or `~/.zshrc`):
   ```bash
   alias start-web="./start-web-wsl.sh"
   ```

3. **Configure firewall once** (as Administrator in PowerShell):
   ```powershell
   New-NetFirewallRule -DisplayName "WSL Dev" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8081
   ```

4. **Work in WSL filesystem** for better performance:
   ```bash
   # Good: fast
   ~/projects/aquapump/

   # Bad: slow
   /mnt/c/Users/YourName/projects/aquapump/
   ```

## Common WSL Commands

```bash
# Check WSL version
wsl --list --verbose

# Restart WSL (from PowerShell)
wsl --shutdown

# Update WSL
wsl --update

# Get WSL IP
hostname -I

# Check network interfaces
ip addr show
```

## Additional Resources

- [WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [WSL Networking](https://docs.microsoft.com/en-us/windows/wsl/networking)
- [Expo Documentation](https://docs.expo.dev/)
- [Troubleshooting Guide](troubleshooting.md)
