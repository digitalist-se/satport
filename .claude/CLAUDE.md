# SatPort - Drupal 11 on Upsun/Platform.sh

## Project Overview

SatPort is a Drupal 11 corporate website for satellite port infrastructure. Hosted on Upsun (Platform.sh), local development via Lando. The site is content-driven using Paragraphs for flexible page building, with a custom PostCSS-based theme.

- **Repo**: digitalist-se/satport (GitHub)
- **Branches**: `main` (production), `stage` (staging)
- **Domain**: www.satport.com (satportinfrastructure.com redirects)
- **Upsun Project ID**: `dg5d4fadyi72o` (region: eu-5, org: digitalist-opentech)

## Tech Stack

| Component | Version |
|-----------|---------|
| Drupal | 11.1.7 (core-recommended ^11.0) |
| PHP | 8.3 |
| Node.js | 22.15.0 (.nvmrc) |
| MariaDB | 10.11 (prod) / 10.6 (lando) |
| Redis | 7.2 (prod) / 7 (lando) |
| Drush | 13.6 |
| Lando | 3.26.2+ (must stay updated for Docker API compatibility) |
| Web Server | Nginx |

## Architecture

```
satport/
├── .claude/
│   ├── CLAUDE.md                      # This file — project reference
│   ├── agents/                        # 7 specialized agents
│   ├── skills/                        # 5 invocable skills
│   ├── docs/                          # Session logs and documentation
│   └── settings.json                  # Permissions and plugin config
├── web/themes/custom/satport_theme/   # Only custom code lives here
│   ├── src/css/                       # PostCSS source (main.css imports all)
│   ├── dist/css/                      # Compiled output (GITIGNORED — must build locally)
│   ├── js/main.js                     # All JS behaviors
│   ├── templates/                     # 21 Twig templates
│   ├── assets/                        # SVGs, Aptos fonts, logos
│   └── package.json                   # PostCSS build system
├── config/sync/                       # 314 exported config YAMLs
├── drush/                             # Deploy scripts
├── .platform/                         # Upsun services + routes
├── .platform.app.yaml                 # Upsun app config
└── composer.json                      # PHP dependencies
```

**No custom modules exist.** All functionality uses contrib modules + config + theme.

## CRITICAL: After Clone / DB Restore / Rebuild

The `dist/` directory is gitignored. You MUST build the theme locally:
```bash
cd web/themes/custom/satport_theme && npm install && npm run build && lando drush cr
```
Without this, the site loads with completely broken styles.

## Content Model

**Node Types**: page, text_block, webform

**Paragraph Types** (used in page sections):
- hero, title_and_text, title_and_image, simple_text_and_image
- full_width_image, key_figures (contains name_and_value sub-paragraphs)

## Key Contrib Modules

paragraphs, webform, metatag, pathauto, image_widget_crop, imagemagick, recaptcha_v3, config_ignore, redis, admin_toolbar, twig_tweak, telephone_validation

## Config Ignore (not synced between environments)

- imagemagick.settings
- recaptcha_v3.settings
- system.site
- webform.webform.contact_us

## Agents

| Agent | Purpose |
|-------|---------|
| **lando-expert** | Local dev environment, Docker, container/proxy troubleshooting |
| **upsun-expert** | Production hosting, deployments, DB operations, SSH, logs |
| **developer** | Feature implementation, bug fixes, theme/config/module work |
| **architecture** | Design decisions, module selection, content modeling, performance |
| **testing** | Functional validation, health checks, site status |
| **unit-tests** | PHPUnit test creation and maintenance |
| **project-manager** | Task tracking, coordination, release planning |

## Skills (invoke with /skill-name)

| Skill | Purpose |
|-------|---------|
| `/lando` | Start, stop, rebuild, troubleshoot Lando |
| `/upsun` | DB dumps, SSH, logs, deployments |
| `/theme-build` | Build/watch satport_theme CSS |
| `/drupal-config` | Config export/import/status |
| `/health-check` | Full site health audit |

## Common Commands

### Local Development (Lando)
```bash
lando start                    # Start containers
lando drush cr                 # Clear cache
lando drush cim -y             # Import config
lando drush cex -y             # Export config
lando drush updb -y            # Run DB updates
lando composer install         # Install PHP deps
lando composer require drupal/MODULE  # Add module
```

### Theme Development
```bash
cd web/themes/custom/satport_theme
npm install                    # Install deps (required after clone)
npm run build                  # Compile CSS (PostCSS)
npm run dev                    # Watch mode
```

### Upsun / Platform.sh (always use -p flag)
```bash
upsun ssh -p dg5d4fadyi72o -e main
upsun db:dump -p dg5d4fadyi72o -e main --gzip -f /tmp/dump.sql.gz
upsun log -p dg5d4fadyi72o -e main error
upsun activity:list -p dg5d4fadyi72o --limit=10
```

### DB Restore from Production
```bash
upsun db:dump -p dg5d4fadyi72o -e main --gzip -f /tmp/dump.sql.gz
cp /tmp/dump.sql.gz .                          # Lando can't see /tmp
lando db-import dump.sql.gz
lando drush cr && lando drush updb -y && lando drush cim -y
cd web/themes/custom/satport_theme && npm install && npm run build
rm dump.sql.gz
```

### Deployment Flow
Build hook: installs Node.js, runs `npm install && npm run build` on theme
Deploy hook: `drush cache-rebuild && drush updatedb && drush config-import`

## Development Conventions

- **CSS**: PostCSS with nesting (stage 1), imports via `postcss-import`. Edit files in `src/css/`, never edit `dist/`.
- **JS**: Drupal.behaviors pattern, jQuery + once. All in single `main.js`.
- **Templates**: Twig in `templates/` organized by type (layout, content, fields, paragraphs, block).
- **Config**: Always export after changes (`drush cex`). Config sync dir is `config/sync/`.
- **Commits**: Short descriptive messages. No conventional commits enforced.
- **No tests currently exist.** No phpunit.xml, no test directories.

## Color Palette (CSS Custom Properties)

- Space Gray: #3f4752, #505968
- Sky Blue: #63aeff, #a9dbff
- Dawn Yellow: #ffffa8
- Earth Gray Light: #fafaf5
- Earth Gray: #e9e6e1
- Earth Brown: #ab9079

## Performance

- Redis caching in production (cache.backend.redis)
- Page cache and dynamic page cache enabled
- Blackfire monitoring configured (.blackfire.yml)
- Homepage target: <=250ms
- Drupal cron: every 19 minutes

## Platform.sh / Upsun Config

- **PHP extensions**: redis, sodium, apcu, blackfire
- **Mounts**: web/sites/default/files, tmp, private, .drush, drush-backups
- **Routes**: www.{default} upstream, non-www redirects
- **Cron**: `*/19 * * * * cd web ; ../vendor/bin/drush core-cron`

## Known Issues & Resolutions

### Lando port conflicts on start
Stale containers from other projects hold ephemeral ports. Fix: `docker stop $(docker ps -q) && docker network prune -f && lando start`

### Lando proxy ECONNREFUSED
If proxy logs show "API version too old", Lando needs updating. Minimum v3.26.0 for Docker API v1.44+. Update: `curl -fsSL https://get.lando.dev/setup-lando.sh | bash -s -- --yes`

### Lando proxy port mismatch
Displayed URLs may show wrong ports (8000/444 vs actual 8080/4433). Check actual: `docker port landoproxyhyperion5000gandalfedition_proxy_1`

### Styles broken after DB restore
`dist/` is gitignored. Build theme: `cd web/themes/custom/satport_theme && npm install && npm run build && lando drush cr`

### lando db-import can't find file
Lando only sees files in the project directory. Copy files from /tmp to project root first.

### Upsun CLI "Could not determine the current project"
Always use `-p dg5d4fadyi72o` flag. Project dir is not linked to Upsun CLI.

### Email delivery issues
- From address MUST be `@satport.com` — Upsun blocks mismatched domains as spoofing
- `system.site` and `webform.webform.contact_us` are config-ignored — change via `drush config:set` on prod directly
- DKIM CNAME records must be correctly configured on Gandi DNS (no trailing `.satport.com` in values)
- Webform handler ID is `email` (NOT `email_handler`) — wrong key crashes entire site

## Important Files

| File | Purpose |
|------|---------|
| `.platform.app.yaml` | Upsun app config (build/deploy hooks, cron, mounts) |
| `.platform/services.yaml` | MariaDB + Redis service definitions |
| `.platform/routes.yaml` | Domain routing and caching |
| `web/sites/default/settings.php` | Main Drupal settings |
| `web/sites/default/settings.platformsh.php` | Upsun-specific settings (DB, Redis, config sync) |
| `drush/platformsh_deploy_drupal.sh` | Deploy hook script |
| `.blackfire.yml` | Performance test assertions |
| `.lando.yml` | Local dev container config |
| `config/sync/core.extension.yml` | Master module/theme enable list |

## Session Logs

Detailed session documentation lives in `.claude/docs/`. Each log records objectives, actions, errors, resolutions, decisions, and learnings.
