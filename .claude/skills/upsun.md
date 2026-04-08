---
name: upsun
description: Manage Upsun/Platform.sh environments, deployments, database, and SSH. Use for any hosting operations.
user_invocable: true
---

# Upsun Management

**Project ID**: `dg5d4fadyi72o` — always use `-p dg5d4fadyi72o` (project dir is not linked to CLI)

## DB Restore to Local (most common operation)
```bash
# 1. Dump from production
upsun db:dump -p dg5d4fadyi72o -e main --gzip -f /tmp/satport-dump.sql.gz

# 2. Copy to project dir (Lando can't see /tmp)
cp /tmp/satport-dump.sql.gz .

# 3. Import into Lando
lando db-import satport-dump.sql.gz

# 4. Post-import
lando drush cr && lando drush updb -y && lando drush cim -y

# 5. Build theme (dist/ not in DB or repo)
cd web/themes/custom/satport_theme && npm install && npm run build

# 6. Cleanup
rm satport-dump.sql.gz /tmp/satport-dump.sql.gz
```

## Environment Info
```bash
upsun environment:list -p dg5d4fadyi72o
upsun environment:info -p dg5d4fadyi72o -e main
```

## SSH & Remote Commands
```bash
upsun ssh -p dg5d4fadyi72o -e main
upsun ssh -p dg5d4fadyi72o -e main -- "cd web && drush cr"
upsun ssh -p dg5d4fadyi72o -e main -- "cd web && drush status"
upsun ssh -p dg5d4fadyi72o -e main -- "cd web && drush watchdog:show --count=20"
```

## Logs
```bash
upsun log -p dg5d4fadyi72o -e main access
upsun log -p dg5d4fadyi72o -e main error
upsun log -p dg5d4fadyi72o -e main deploy
```

## Activity / Deployments
```bash
upsun activity:list -p dg5d4fadyi72o --limit=10
upsun activity:log -p dg5d4fadyi72o <activity-id>
```

## Files
```bash
upsun mount:download -p dg5d4fadyi72o -e main --mount web/sites/default/files --target ./files/
```

## Email Config (config-ignored — must set directly on each environment)
```bash
# Check current From address
upsun ssh -p dg5d4fadyi72o -e main -- 'cd web && ../vendor/bin/drush config:get system.site mail'

# Set From address
upsun ssh -p dg5d4fadyi72o -e main -- 'cd web && ../vendor/bin/drush config:set system.site mail noreply@satport.com -y && ../vendor/bin/drush cr'

# Check webform recipient
upsun ssh -p dg5d4fadyi72o -e main -- 'cd web && ../vendor/bin/drush config:get webform.webform.contact_us handlers.email.settings.to_mail'
```
**WARNING**: Webform handler ID is `email`, NOT `email_handler`. Wrong key crashes the site.

## Known Issue
If `upsun` commands fail with "Could not determine the current project", you forgot the `-p dg5d4fadyi72o` flag.
