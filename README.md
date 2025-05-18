# Satport drupal site
This project has been created based on [drupal11](https://github.com/platformsh-templates/drupal11) template for platform sh

## Local env instructions
Note: This project was created and built using Fedora 42. Instructions bellow have been based on this platform. Please update code according to your local env. (Use homebrew for MacOS, yum/apt/dnf for Linux debian/alpine versions)

- Install docker ce from the official docker site. Don't use the dnf or yum version provided in linux. Example, for Fedora, see https://docs.docker.com/engine/install/fedora/
- Add user to the docker usergroup to allow access to docker without sudo permissions
```sh
$ sudo usermod -aG docker username
```
- Install php and composer from dnf
```sh
$ sudo dnf install php
$ sudo dnf install composer
```
- Install php-gd from dnf
```sh
$ sudo dnf install php-gd
```
- Run composer install
- Then run commands to configure the project for platform sh usage
```sh
$ composer require platformsh/config-reader drush/drush drupal/redis
$ composer config allow-plugins.composer/installers true --no-plugins
$ composer config allow-plugins.drupal/core-composer-scaffold true --no-plugins
$ composer config allow-plugins.drupal/core-project-message true --no-plugins
$ composer config allow-plugins.cweagans/composer-patches true --no-plugins
```
- Start the project using command ```$ lando start```
- If there are changes to .lando.yml or .platform.app.yml, rebuild the project using command ```$ lando rebuild```
- Install drupal site with command or go to the site and install from there. Make sure db url is properly specified or else it will say it cant connect to DB
- If the DB is not accessible, add flag --db-url=mysql://drupal11:drupal11@database/drupal11 to the commands. Example, to start the site with db specified, use command
```sh
$ lando start --db-url=mysql://drupal11:drupal11@database/drupal11
```
- When drupal starts for the first time, it will ask you to setup the site. Do this on the UI or use command below
```sh
$ lando drush site:install standard \  
  --account-name=admin \
  --account-pass=admin \
  --site-name="Satport"
```

## Hosting instructions
Platform hosting instructions TBD...