# Incident Report: Email Delivery Failure — 2026-04-08

## Summary
Contact form submissions on www.satport.com were not being received by the client. Some emails were landing in spam. Investigation revealed three root causes: a misconfigured From address, broken DKIM DNS records, and a failing cron job.

## Timeline (all times UTC)

| Time | Event |
|------|-------|
| Pre-existing | Client reports contact form emails not being received; some go to spam |
| ~12:30 | Investigation begins. SSH into Upsun production to check logs and config |
| ~12:40 | Root cause #1 identified: `system.site.mail` set to `noreply@stage-y77w3ti-dg5d4fadyi72o.eu-5.platformsh.site` (stage domain) instead of `@satport.com`. Upsun docs state mismatched From domains are "flagged as spoofing and not sent" |
| ~12:40 | Root cause #2 identified: Cron failing with `drush: not found` — bare `drush` not in PATH at runtime. Should be `../vendor/bin/drush` |
| ~12:45 | Root cause #3 identified: DKIM CNAME records on Gandi DNS have `.satport.com` incorrectly appended to values, making DKIM validation fail. Combined with DMARC `p=quarantine`, this sends mail to spam |
| ~12:55 | Fix applied: `system.site.mail` set to `noreply@satport.com` via drush on production |
| ~12:55 | Fix applied: webform recipient temporarily changed for testing |
| ~12:55 | **Incident**: Incorrect drush eval command used wrong webform handler key (`email_handler` instead of `email`), creating bogus plugin entry. Drupal crashes with `PluginNotFoundException: Plugin ID 'email_handler' was not found` on every page load. Site returns HTTP 500 |
| ~13:07 | Fix applied: Bogus `handlers.email_handler` entry removed, correct `handlers.email` entry updated. Cache cleared. Site returns HTTP 200 |
| ~13:10 | Contact form submitted on production. Email received by test recipient — but in spam folder |
| ~13:15 | Webform recipient set to `contact@satport.com` (final production value) |
| ~13:20 | Cron path fix committed to `.platform.app.yaml` (pending deploy) |

## Root Causes

### 1. Wrong From address (PRIMARY — emails not delivered)
- `system.site.mail` was `noreply@stage-y77w3ti-dg5d4fadyi72o.eu-5.platformsh.site`
- Upsun's SendGrid relay blocks or flags emails with From domains that don't match the project's actual domain
- This setting is in `config_ignore` so it was never updated when the site moved from staging setup to production

### 2. Broken DKIM DNS records (emails go to spam)
- Upsun support provided DKIM CNAME records in support ticket #398656 (June 30, 2025): https://support.platform.sh/hc/en-us/requests/398656
- The ticket provided the following correct values for production:
  - `e4075._domainkey.satport.com` CNAME → `e4075.domainkey.u53943450.wl201.sendgrid.net`
  - `e40752._domainkey.satport.com` CNAME → `e40752.domainkey.u53943450.wl201.sendgrid.net`
  - `em965.satport.com` CNAME → `u53943450.wl201.sendgrid.net`
- However, when these were entered in Gandi DNS, the values were added without a trailing dot, causing Gandi to append `.satport.com` to each value:
  - `e4075._domainkey.satport.com` → `e4075.domainkey.u53943450.wl201.sendgrid.net.satport.com` (WRONG)
  - `e40752._domainkey.satport.com` → `e40752.domainkey.u53943450.wl201.sendgrid.net.satport.com` (WRONG)
  - `em965.satport.com` → `u53943450.wl201.sendgrid.net.satport.com` (WRONG)
- This makes DKIM validation fail because the CNAME targets resolve to non-existent domains
- DMARC policy is `p=quarantine`, so without valid DKIM, emails are quarantined (spam)

### 3. Cron failing (operational impact)
- `.platform.app.yaml` cron used bare `drush` command, which is not in PATH at runtime
- Every cron run (every 19 minutes) failed with `/bin/dash: 1: drush: not found`
- This prevented Drupal cron tasks from running (queue processing, cache cleanup, etc.)

## Self-Inflicted Incident: Site Down (HTTP 500)
During the fix, a drush eval command used `handlers.email_handler` as the config key instead of the correct `handlers.email`. This created a phantom webform handler entry. Drupal attempted to load a plugin with ID `email_handler` on every page load, throwing `PluginNotFoundException` and returning HTTP 500.

- **Duration**: ~12 minutes (12:55 → 13:07 UTC)
- **Impact**: Complete site outage (all pages returned HTTP 500)
- **Resolution**: Removed bogus config entry via `$config->clear('handlers.email_handler')`, rebuilt cache

## Current Status

| Item | Status |
|------|--------|
| From address (`noreply@satport.com`) | FIXED — live on production |
| Webform recipient (`contact@satport.com`) | FIXED — live on production |
| Email delivery | WORKING — emails send, but land in spam due to DKIM |
| DKIM DNS records | PENDING — client notified to fix CNAME values in Gandi |
| Cron path fix | COMMITTED — awaiting deploy (next push to main) |
| Site availability | UP — HTTP 200, fully operational |

## Next Steps

1. **Client action required**: Fix 3 DKIM CNAME records in Gandi DNS by adding trailing dot to values:
   - `e4075._domainkey` → `e4075.domainkey.u53943450.wl201.sendgrid.net.`
   - `e40752._domainkey` → `e40752.domainkey.u53943450.wl201.sendgrid.net.`
   - `em965` → `u53943450.wl201.sendgrid.net.`

2. **Deploy pending**: Push commit `ddeed01` to main to deploy cron fix

3. **Verify after DKIM fix**: Once client updates DNS, SendGrid validates within 15 minutes. Re-test email delivery to confirm inbox placement

4. **Optional**: Consider setting up DKIM for staging environment as well (records provided in ticket #398656)

## Lessons Learned

1. **Always verify webform handler IDs** before writing drush eval commands — check the actual config YAML first. The handler ID is the key under `handlers:` (in this case `email`), not a descriptive name.

2. **Config-ignored settings require direct database changes** on each environment. Code deploys don't update them. Document which settings are config-ignored and what their production values should be.

3. **DNS CNAME records in Gandi** need a trailing dot for fully-qualified domain names, otherwise Gandi appends the zone name to the value.
