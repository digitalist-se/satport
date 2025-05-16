<?php

namespace Drupal\next_translations\Controller;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Cache\CacheableJsonResponse;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Controller\ControllerBase;
use Drupal\next_translations\Helper;

/**
 * Returns responses for Next.js Translations routes.
 */
class NextTranslationsController extends ControllerBase {

  /**
   * The next_translations.helper service.
   *
   * @var \Drupal\next_translations\Helper
   */
  protected $helper;

  /**
   * Constructs a new TranslateForm.
   */
  public function __construct(Helper $next_translations_helper) {
    $this->helper = $next_translations_helper;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('next_translations.helper')
    );
  }

  /**
   * Builds a json response containing all translations in current language.
   */
  public function getTranslations() {

    $cacheability = (new CacheableMetadata())
      ->addCacheTags($this->helper->getTranslationsCacheTags())
      ->addCacheContexts(['url.path'])
      ->setCacheMaxAge(-1);

    // Merge current and default language translations.
    $translations = $this->helper->getTranslations();
    $default_translations = $this->helper->getTranslationsInDefaultLanguage();
    foreach ($default_translations as $key => $string) {
      if (empty($translations[$key])) {
        $translations[$key] = $string;
      }
    }

    $response = new CacheableJsonResponse($translations);
    $response->addCacheableDependency($cacheability);
    return $response;
  }

}
