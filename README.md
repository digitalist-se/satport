# SatPort

Drupal 11 site for [www.satport.com](https://www.satport.com), hosted on Upsun (Platform.sh).

## Prerequisites

- [Docker](https://docs.docker.com/engine/install/) (Docker Desktop or Docker CE)
- [Lando](https://docs.lando.dev/getting-started/installation.html) v3.26 or newer
- [Upsun CLI](https://docs.upsun.com/administration/cli.html) (only needed to pull the production database)

## Local development

```sh
lando start
```

That is all. `lando start` installs Composer dependencies, builds the theme CSS and brings up
the site at https://satport.lndo.site. Caught emails are at https://mail.satport.lndo.site.

The database starts empty. To load a copy of production:

```sh
upsun db:dump -p dg5d4fadyi72o -e main -f dump.sql
lando db-import dump.sql && rm dump.sql
lando drush cr
```

After changing `.lando.yml`, run `lando rebuild -y`.

## Useful commands

| Command | Purpose |
|---------|---------|
| `lando drush <cmd>` | Run Drush |
| `lando composer <cmd>` | Run Composer |
| `lando theme-build` | Rebuild theme CSS |
| `lando theme-watch` | Rebuild theme CSS on change |
