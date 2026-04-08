---
name: health-check
description: Run a comprehensive health check on the SatPort site — environment, config, security, theme, and database.
user_invocable: true
---

# Site Health Check

Run all checks and report results in pass/fail format.

## 0. Environment (check first — everything else depends on this)
```bash
docker ps --filter "name=satport_appserver" --format '{{.Status}}'
ls web/themes/custom/satport_theme/dist/css/style.css
```
If Lando not running → `lando start`
If theme not built → `cd web/themes/custom/satport_theme && npm install && npm run build`

## 1. Drupal Status
```bash
lando drush status
```

## 2. Pending Updates
```bash
lando drush updatedb:status
composer outdated --direct
```

## 3. Config Sync
```bash
lando drush config:status
```

## 4. Security Audit
```bash
composer audit
```

## 5. Watchdog Errors
```bash
lando drush watchdog:show --severity=error --count=10
```

## 6. Theme Build
```bash
cd web/themes/custom/satport_theme && npm run build
```

## 7. Git Status
```bash
git status
git log --oneline -5
```

## Report Format
```
## Health Check — [DATE]

| Check | Status | Details |
|-------|--------|---------|
| Lando Running | PASS/FAIL | ... |
| Theme Built | PASS/FAIL | ... |
| Drupal Bootstrap | PASS/FAIL | ... |
| DB Connected | PASS/FAIL | ... |
| Config Sync | PASS/FAIL | ... |
| DB Updates | PASS/FAIL | ... |
| Security | PASS/WARN/FAIL | ... |
| Watchdog | PASS/WARN | ... |
| Theme Build | PASS/FAIL | ... |
| Git Clean | PASS/WARN | ... |
```
