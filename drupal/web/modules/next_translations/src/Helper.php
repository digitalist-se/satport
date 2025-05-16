<?php

namespace Drupal\next_translations;

use Drupal\Core\Cache\Cache;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\KeyValueStore\KeyValueFactoryInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Url;

/**
 * Service description.
 */
class Helper {

  use StringTranslationTrait;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * The translation keys config.
   *
   * @var \Drupal\Core\Config\Config
   */
  protected $translationKeysConfig;

  /**
   * The keyvalue service.
   *
   * @var \Drupal\Core\KeyValueStore\KeyValueStoreInterface
   */
  protected $keyValue;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * The Next.js translation namespace.
   *
   * @var string
   */
  protected $namespace = 'common';

  /**
   * Constructs a Helper object.
   *
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory.
   * @param \Drupal\Core\KeyValueStore\KeyValueFactoryInterface $key_value_factory
   *   The key-value factory.
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   */
  public function __construct(LanguageManagerInterface $language_manager, ConfigFactoryInterface $config_factory, KeyValueFactoryInterface $key_value_factory, AccountInterface $current_user) {
    $this->languageManager = $language_manager;
    $this->translationKeysConfig = $config_factory->getEditable('next_translations.translation_keys.' . $this->namespace);
    $this->keyValue = $key_value_factory->get('next_translations.translation_values');
    $this->currentUser = $current_user;
  }

  /**
   * Returns current language.
   *
   * @return \Drupal\Core\Language\LanguageInterface
   *   The current UI language.
   */
  public function getCurrentLanguage() {
    return $this->languageManager->getCurrentLanguage();
  }

  /**
   * Returns a list of the translation keys stored in config.
   *
   * @return array
   *   The list of translation keys.
   */
  public function getTranslationKeys() {
    return $this->translationKeysConfig->get('translation_keys');
  }

  /**
   * Returns a list of the translation default values stored in config.
   *
   * @return array
   *   The list of translation default values.
   */
  public function getTranslationDefaults() {
    return $this->translationKeysConfig->get('translation_defaults') ?? [];
  }

  /**
   * Updates the translation keys and defaults in config.
   *
   * @param array $keys
   *   The list of translation keys.
   * @param array $defaults
   *   The list of translation defaults.
   */
  public function setTranslationKeysAndDefaults(array $keys, array $defaults) {
    $this->translationKeysConfig->set('translation_keys', $keys)
      ->set('translation_defaults', $defaults)
      ->save();
  }

  /**
   * Returns a list of translations in default language from storage.
   *
   * @return array
   *   The translations array.
   */
  public function getTranslationsInDefaultLanguage() {
    return $this->getTranslations($this->languageManager->getDefaultLanguage()->getId());
  }

  /**
   * Returns a list of translations in passed language from storage.
   *
   * @param string|null $langcode
   *   The language we want the translations. Defaults to current UI language.
   *
   * @return array
   *   The translations array.
   */
  public function getTranslations(string $langcode = NULL) {
    if (!$langcode) {
      $langcode = $this->languageManager->getCurrentLanguage()->getId();
    }
    return $this->keyValue->get($langcode . '.' . $this->namespace) ?? [];
  }

  /**
   * Stores a list of translations in the default language.
   *
   * @param array $values
   *   The translations array.
   */
  public function setTranslationsInDefaultLanguage(array $values) {
    $this->setTranslations($values, $this->languageManager->getDefaultLanguage()->getId());
  }

  /**
   * Stores a list of translations.
   *
   * @param array $values
   *   The translations array.
   * @param string $langcode
   *   The language we set the translations. Defaults to current UI language.
   */
  public function setTranslations(array $values, string $langcode = NULL) {
    if (is_null($langcode)) {
      $langcode = $this->languageManager->getCurrentLanguage()->getId();
    }
    $this->keyValue->set($langcode . '.' . $this->namespace, $values);
    Cache::invalidateTags($this->getTranslationsCacheTags());
  }

  /**
   * Cache tags for next translations.
   *
   * @return string[]
   *   The list of cache tags involved in next translations.
   */
  public function getTranslationsCacheTags() {
    return ['next_translations'];
  }

  /**
   * Returns a list of links to be rendered as a menu.
   *
   * @return array
   *   The list of links.
   */
  public function getAdminLinks() {

    $links = [];
    foreach ($this->languageManager->getLanguages() as $language) {
      $links[] = [
        'title' => $language->getName(),
        'url' => Url::fromRoute('next_translations.admin_translations', [], [
          'language' => $language,
        ]),
        'attributes' => ['class' => ['local-actions__item']],
      ];
    }

    if ($this->currentUser->hasPermission('administer translation settings')) {
      $current_language = $this->languageManager->getCurrentLanguage();
      $default_language = $this->languageManager->getDefaultLanguage();
      if ($current_language != $default_language) {
        $links[] = [
          'title' => $this->t('Import translations in default language (@language)', [
            '@language' => $default_language->getName(),
          ]),
          'url' => Url::fromRoute('next_translations.translations_import', [], [
            'language' => $default_language,
          ]),
        ];
      }
      $links[] = [
        'title' => $this->t('Import translations (@language)', [
          '@language' => $current_language->getName(),
        ]),
        'url' => Url::fromRoute('next_translations.translations_import'),
      ];
    }

    return $links;
  }

}
