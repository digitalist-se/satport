<?php

/**
 * @file
 * Views hooks for NextJS Site Group module.
 */

use Drupal\user\Entity\User;
use Drupal\views\Plugin\views\query\QueryPluginBase;
use Drupal\views\ViewExecutable;

/**
 * Implements hook_views_query_alter().
 *
 * Only list contents that belongs to the user's site.
 */
function nextjs_site_group_views_query_alter(ViewExecutable $view, QueryPluginBase $query) {
  if ($view->id() == 'content') {

    $account = \Drupal::currentUser();

    if ($account->isAuthenticated() && !$account->hasPermission('access any site content')) {
      $user = User::load($account->id());

      $query->addField('node__field_site', 'field_site_target_id');
      $query->addWhere('', 'node__field_site.field_site_target_id', $user->get('field_site')->entity->id(), '=');
    }
  }
}
