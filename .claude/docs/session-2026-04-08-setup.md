# Session Log: 2026-04-08 — Project Setup, DB Restore, Lando Debugging

## Objectives
1. Deep-learn the SatPort Drupal 11 project
2. Create comprehensive documentation, agents, and skills
3. Restore production database to local Lando environment
4. Get local development environment working

---

## Phase 1: Project Research & Documentation

### Actions Taken
1. Launched 4 parallel research agents to explore:
   - Drupal project structure (modules, themes, config, composer)
   - Upsun/Platform.sh configuration (services, routes, hooks, cron)
   - Custom code details (theme CSS/JS/Twig, paragraph types, content model)
   - Git history, documentation, test infrastructure

### Key Findings
- **No custom modules** — all functionality via contrib + config + theme
- **314 config YAMLs** in config/sync/
- **21 Twig templates** in custom theme
- **PostCSS build system** — dist/ is gitignored, must be built locally
- **Upsun project ID**: `dg5d4fadyi72o` (region: eu-5, org: digitalist-opentech)
- **No test infrastructure** exists (no phpunit.xml, no test directories)

### Artifacts Created
- `CLAUDE.md` — comprehensive project reference
- `.claude/agents/` — 5 agents (testing, unit-tests, architecture, project-manager, developer)
- `.claude/skills/` — 4 skills (drupal-config, theme-build, upsun, health-check)
- `.claude/settings.json` — permissions for Drupal/Upsun/Git commands
- Memory files for future conversation context

---

## Phase 2: Production Database Restore

### Step 1: Download DB Dump from Upsun
- **Command**: `upsun db:dump -p dg5d4fadyi72o -e main --gzip -f /tmp/satport-prod-dump.sql.gz`
- **Result**: 12MB gzipped SQL dump downloaded successfully
- **Note**: Must use `-p dg5d4fadyi72o` flag because project directory isn't linked to Upsun

### Step 2: Start Lando
- **Command**: `lando start`
- **Error**: Port binding failures — `failed to bind host port 127.0.0.1:32794/tcp: address already in use`
- **Root Cause**: Docker ephemeral port race condition. Multiple containers starting simultaneously grab random ports that collide.

### Step 3: Debug Port Conflicts (FAILED ATTEMPTS)
1. **Attempt**: `lando destroy -y && lando start` → Same port error
2. **Attempt**: Stop and remove all satport containers → Same error
3. **Attempt**: Pin ports in .lando.yml (`0.0.0.0:8888:80`) → Port 8888 already allocated by appserver itself (appserver and appserver_nginx both try to bind port 80)
4. **Attempt**: Set `ports: []` on appserver → Containers started but proxy failed

### Step 4: Resolution — Clean Docker State
- **Command**: `docker stop $(docker ps -q) && docker network prune -f`
- Stopped ALL Docker containers (including unrelated ones: local-observability, forterroheadless)
- Pruned all Docker networks
- **Result**: `lando start` succeeded — all 5 containers came up
- **Remaining Issue**: Lando proxy URLs showed ECONNREFUSED

### Step 5: Import Database
- **Command**: `cp /tmp/satport-prod-dump.sql.gz . && lando db-import satport-prod-dump.sql.gz`
- **Critical**: `lando db-import` only sees files inside the project directory (mapped to /app in container). Files in /tmp are not accessible.
- **Result**: Import complete
- **Post-import**: `lando drush cr && lando drush updb -y && lando drush cim -y` — all clean, no pending updates, no config changes

### Step 6: Verify
- `lando drush status` → Drupal 11.1.7, database connected, bootstrap successful

---

## Phase 3: Lando Proxy Debugging

### Symptom
- All containers running, but `satport.lndo.site:8000` returned ECONNREFUSED
- Lando health checks showed all URLs as FAILED

### Investigation
- **Command**: `docker logs landoproxyhyperion5000gandalfedition_proxy_1`
- **Root Cause**: `client version 1.24 is too old. Minimum supported API version is 1.44`
- The Lando proxy (Traefik) had a Docker client using API v1.24, but Docker Engine required v1.44+
- **Lando version**: v3.25.6 — too old for Docker Engine API v1.52
- Traefik couldn't discover containers via Docker API → couldn't route traffic

### Resolution
- Updated Lando from v3.25.6 to v3.26.2
- RPM not available via GitHub releases for v3.26.2 — used `curl -fsSL https://get.lando.dev/setup-lando.sh | bash -s -- --yes`
- After update: `lando restart` — proxy no longer showed API version errors
- **Port mismatch**: Lando checked ports 8000/444 but proxy was bound to 8080/4433
- **Working URLs**: `https://satport.lndo.site:4433` and `http://satport.lndo.site:8080`

### Decision
- Port mismatch is cosmetic — Lando's health checker uses different ports than the actual proxy bindings
- `lando poweroff && lando start` would fully realign ports, but site was accessible

---

## Phase 4: Broken Styles Fix

### Symptom
- Site loaded at `https://satport.lndo.site:4433` but with no CSS styling

### Root Cause
- `dist/css/` directory doesn't exist locally — it's in `.gitignore`
- Theme CSS must be compiled from `src/css/` via PostCSS build
- Production builds this in the Upsun build hook, but locally it must be done manually

### Resolution
```bash
cd web/themes/custom/satport_theme
npm install
npm run build
lando drush cr
```

### Key Learning
- **After every fresh clone or DB restore, you MUST build the theme CSS**
- The build hook in `.platform.app.yaml` handles this for Upsun deploys
- Locally, `dist/` must be built before the site renders correctly

---

## Decision Log

| # | Decision | Rationale | Alternative Considered |
|---|----------|-----------|----------------------|
| 1 | Pin Upsun project ID in skills/agents | Project dir not linked to Upsun CLI | Could run `upsun project:set` but that modifies local state |
| 2 | Use `ports: []` instead of pinned ports in .lando.yml | Appserver and nginx both claim port 80 — can't pin both | Pinning caused immediate conflicts |
| 3 | Reverted .lando.yml port changes | The original config with random ports works once Docker state is clean | Keeping pinned ports would cause predictable conflicts |
| 4 | Updated Lando via setup script | GitHub releases had no RPM assets for v3.26.2 | Could have stayed on old version and used direct container ports |
| 5 | Used direct container port as interim fix | Proxy port mismatch was cosmetic, site was accessible | Could have done full poweroff/start cycle |

---

## Troubleshooting Checklist (for future reference)

### Lando Won't Start (Port Conflicts)
1. Check for stale containers: `docker ps -a --format '{{.Names}} {{.Ports}}'`
2. Remove stale containers from OTHER projects: `docker rm -f <container_names>`
3. Prune networks: `docker network prune -f`
4. If still failing, nuclear option: `docker stop $(docker ps -q) && docker network prune -f && lando start`

### Lando Proxy ECONNREFUSED
1. Check proxy logs: `docker logs landoproxyhyperion5000gandalfedition_proxy_1`
2. If "API version too old" → update Lando
3. Check actual proxy ports: `docker port landoproxyhyperion5000gandalfedition_proxy_1`
4. Access site via direct container port: `docker port satport_appserver_nginx_1`

### Styles Broken After DB Restore
1. Build theme: `cd web/themes/custom/satport_theme && npm install && npm run build`
2. Clear cache: `lando drush cr`

### DB Restore from Production
1. Dump: `upsun db:dump -p dg5d4fadyi72o -e main --gzip -f /tmp/dump.sql.gz`
2. Copy to project: `cp /tmp/dump.sql.gz .`
3. Import: `lando db-import dump.sql.gz`
4. Post-import: `lando drush cr && lando drush updb -y && lando drush cim -y`
5. Build theme: `cd web/themes/custom/satport_theme && npm install && npm run build`
6. Clean up: `rm dump.sql.gz`

---

## Phase 4: Contact Form Testing

### Test 1 — Basic Submission (via Playwright MCP)
- **Data**: John Smith, Acme Corp, General Inquiry
- **Result**: SUCCESS — confirmation message shown, email received in Mailhog
- **Phone format**: Must use dashes (e.g. `+1 201-555-0123`), spaces-only format rejected by telephone_validation module

### Test 2 — Different Content (via Chrome DevTools MCP)
- **Data**: Maria Rodriguez, SpaceLink Technologies, VP Operations, Partnerships & Growth
- **Message**: "Interested in discussing ground infrastructure partnership for our new LEO constellation. We have 12 satellites launching Q3 2026."
- **Result**: SUCCESS — confirmation "Your message has been sent.", email received in Mailhog at 15:25

### Contact Form Technical Findings

| Finding | Detail |
|---------|--------|
| Form field name mismatch | Inquiry type `<select>` has `name="select_inquiry_type"` not `inquiry_type` — the `fill_form` MCP tool sets display text but not the actual form value for selects |
| reCAPTCHA v3 disables submit | Button becomes disabled while reCAPTCHA generates token; locally this blocks submission since keys aren't for lndo.site domain |
| JS bypass needed locally | Must use `element.disabled = false; element.click()` to submit locally |
| Post-submit state | Form shows confirmation with only a "Reset" button; AJAX reset loads fresh fields but form action remains in confirmation state — full page reload needed for clean re-test |
| Email sender | `SatPort <contact@satport.com>` → `contact@satport.com` |
| Email subject | `satport.com: Contact us submission` |
| Mailhog access | Lando exposes Mailhog on dynamic port — check: `lando info --service mailhog --format json` or `docker port satport_mailhog_1` |
| Character counter | Works correctly — 280 max, live countdown updates as user types |

### Production Bug Found
- `site.webmanifest` returns 404 on production
- File exists in repo at `web/themes/custom/satport_theme/favicon/site.webmanifest`
- Root cause: `.platform.app.yaml` static file `allow` regex doesn't include `.webmanifest` extension
- Line 101: `'\.(avif|webp|jpe?g|png|gif|svgz?|css|js|map|ico|bmp|eot|woff2?|otf|ttf)$'`
- Fix: Add `|webmanifest` to the regex
