---
name: lando
description: Manage the local Lando development environment. Start, stop, rebuild, troubleshoot containers and proxy issues.
user_invocable: true
---

# Lando Local Development

## Start / Stop / Restart
```bash
lando start          # Start all containers
lando stop           # Stop containers
lando restart        # Restart containers
lando poweroff       # Stop ALL Lando projects globally
lando rebuild -y     # Rebuild containers from scratch
```

## Site Access
- **HTTPS**: https://satport.lndo.site:4433
- **HTTP**: http://satport.lndo.site:8080
- **Direct fallback**: `docker port satport_appserver_nginx_1` (use if proxy broken)
- **Admin login**: `lando drush uli`

## Troubleshooting: Won't Start (Port Conflicts)
```bash
# 1. Check stale containers
docker ps -a --format '{{.Names}} {{.Ports}}'

# 2. Remove stale containers from other projects
docker rm -f <container_names>

# 3. Prune networks
docker network prune -f

# 4. Nuclear option
docker stop $(docker ps -q) && docker network prune -f && lando start
```

## Troubleshooting: Proxy ECONNREFUSED
```bash
# Check proxy logs
docker logs landoproxyhyperion5000gandalfedition_proxy_1

# If "API version too old" → update Lando
curl -fsSL https://get.lando.dev/setup-lando.sh | bash -s -- --yes

# Check actual proxy ports
docker port landoproxyhyperion5000gandalfedition_proxy_1
```

## Troubleshooting: Styles Broken
```bash
cd web/themes/custom/satport_theme && npm install && npm run build && lando drush cr
```

## Database Operations
```bash
lando db-import file.sql.gz    # Import (file MUST be in project dir)
lando db-export dump.sql.gz    # Export
lando mysql                    # MySQL CLI
```

## Useful Commands
```bash
lando info                     # Show all service info
lando logs -s appserver        # Appserver logs
lando ssh                      # Shell into appserver
lando drush <command>          # Run drush
lando composer <command>       # Run composer
lando version                  # Check version
```
