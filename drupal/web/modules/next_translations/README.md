# Next.js Translations

## Contents of this file

- Introduction
- Requirements
- Installation
- Usage in Backend
- Usage in Frontend
- Roadmap

## Introduction

Provides an interface translation tool for Next.js websites, and an API endpoint
to retrieve those translations from a Next.js application.

## Requirements

This module requires Drupal core >= 9.0.

## Installation

`drush -y en next_translations`

## Usage in Backend

### Create translation keys and defaults

- Access `/admin/content/next-translations/import` and paste your current
  Next.js translations file to add new translation strings and their default
  values.
- Export to config with normal `drush config-export`.

### Translate

- Translators can translate at `/admin/content/next-translations`.
- Use the languages links to navigate translation pages.
- Translations can be uploaded in bulk using the "Import translations" link.

### Permissions

- The module defines two new permissions: 'Administer Next.js translations'
  and 'Translate Next.js translations'.

## Manage translation keys and defaults

- Add translation keys in `/admin/content/next-translations/import` as a normal
  Next.js JSON translation file.

  OR

- Modify `next_translation.translation_keys.common.yml` in configuration
  directory and `drush config-import`

## Usage in Frontend

- Translations will be available to frontend application
  at `/[LANGCODE]/next-translations`.
- Frontend application uses `i18next-http-backend`.
- Settings in `next-i18next.config.js`:

```
const I18NextHttpBackend = require("i18next-http-backend");

module.exports = {
  i18n: {
    defaultLocale: "de",
    locales: ["de", "ch-de"],
    #localeDetection: false,
    backend: {
      loadPath: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/{{lng}}/next-translations`,
    },
  },
  debug: false,
  reloadOnPrerender: true,
  serializeConfig: false,
  use: [I18NextHttpBackend],
};
```

- Add to `_app.tsx`:

```
import NextI18nextConfig from '../next-i18next.config'

(...)

export default appWithTranslation(App, NextI18nextConfig);
```

## Roadmap

- Add a page to add / remove translation keys manually.
- Better language links. Drupal tabs would be great but could not set link per
  language.
- Decide if translations should be removed when uninstall. Currently not
  removing.
- Fix `localeDetection` in frontend.
