<?php

namespace Drupal\next_translations\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\Core\Config\ConfigCrudEvent;
use Drupal\Core\Config\ConfigEvents;
use Drupal\next_translations\Helper;

/**
 * Next.js Translations event subscriber.
 */
class EventSubscriber implements EventSubscriberInterface {

  /**
   * The next_translations.helper service.
   *
   * @var \Drupal\next_translations\Helper
   */
  protected $helper;

  /**
   * Constructs an EventSubscriber object.
   *
   * @param \Drupal\next_translations\Helper $helper
   *   The next_translations.helper service.
   */
  public function __construct(Helper $helper) {
    $this->helper = $helper;
  }

  /**
   * Config save event handler.
   *
   * If there are new translations, add the default value to storage for
   * default language.
   *
   * @param \Drupal\Core\Config\ConfigCrudEvent $event
   *   The config crud event.
   */
  public function onConfigSave(ConfigCrudEvent $event) {
    $config = $event->getConfig();

    // Not our business.
    if ($config->getName() !== 'next_translations.translation_keys.common') {
      return;
    }

    $storage = $this->helper->getTranslationsInDefaultLanguage();
    $config = $config->get('translation_defaults');

    $missing = array_diff_key($config, $storage);

    if (!empty($missing)) {
      $this->helper->setTranslationsInDefaultLanguage(array_merge($storage, $missing));
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      ConfigEvents::SAVE => ['onConfigSave'],
    ];
  }

}
