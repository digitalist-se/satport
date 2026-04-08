---
name: drupal-config
description: Export, import, and manage Drupal configuration sync. Use when working with config changes.
user_invocable: true
---

# Drupal Config Management

## Check Config Status
```bash
lando drush config:status
```
- "No differences" = config is in sync
- Listed items = config drift between DB and sync directory

## Export Config (DB → files)
```bash
lando drush cex -y
git diff config/
```
Always review the diff before committing.

## Import Config (files → DB)
```bash
lando drush cim -y
```

## Config Ignore (these are NOT synced)
Defined in `config/sync/config_ignore.settings.yml`:
- `imagemagick.settings` — different binary paths per environment
- `recaptcha_v3.settings` — different API keys per environment
- `system.site` — environment-specific site name/email
- `webform.webform.contact_us` — environment-specific form config

## After any config change:
1. `lando drush cr` — clear cache
2. `lando drush config:status` — verify sync
3. `git diff config/` — review what changed
4. Commit config/sync/ changes

## Common Pitfall
If `drush cim` fails on deploy, it usually means config was exported from a different DB state than production. Fix: pull production DB locally, make changes, export config, push.
