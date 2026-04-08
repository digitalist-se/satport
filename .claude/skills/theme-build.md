---
name: theme-build
description: Build, watch, and manage the satport_theme frontend assets. Use when working on CSS/JS or when styles are broken.
user_invocable: true
---

# Theme Build

## Quick Build
```bash
cd web/themes/custom/satport_theme && npm run build && lando drush cr
```

## Full Setup (after clone, rebuild, or DB restore)
```bash
cd web/themes/custom/satport_theme && npm install && npm run build && lando drush cr
```

## Watch Mode (auto-rebuild on CSS changes)
```bash
cd web/themes/custom/satport_theme && npm run dev
```

## IMPORTANT: dist/ is gitignored
The `dist/css/style.css` file is NOT in the repo. It MUST be built locally after:
- Fresh clone
- `lando rebuild`
- `lando destroy && lando start`
- Any DB restore operation
- Pulling new changes that modify `src/css/`

If the site loads without styles, this is almost certainly the cause.

## Troubleshooting

### Styles broken after DB restore
```bash
cd web/themes/custom/satport_theme && npm install && npm run build && lando drush cr
```

### PostCSS build errors
```bash
cd web/themes/custom/satport_theme
rm -rf node_modules
npm install
npm run build
```

### Browserslist warning
Not an error — can be silenced with:
```bash
cd web/themes/custom/satport_theme && npx update-browserslist-db@latest
```

## File Locations
- Source CSS: `web/themes/custom/satport_theme/src/css/` (edit these)
- Compiled CSS: `web/themes/custom/satport_theme/dist/css/style.css` (never edit)
- JS: `web/themes/custom/satport_theme/js/main.js`
- PostCSS config: `web/themes/custom/satport_theme/postcss.config.js`
- Node version: `.nvmrc` (v22.15.0)
