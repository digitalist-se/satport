<?php

namespace Drupal\next_translations\Form;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\next_translations\Helper;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a Next.js Translations form.
 */
class ImportForm extends FormBase {

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
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'next_translations_import';
  }

  /**
   * Title callback for the form.
   *
   * @return \Drupal\Core\StringTranslation\TranslatableMarkup
   *   The title.
   */
  public function titleCallback() {
    return $this->t('Import Next.js translations for @language', [
      '@language' => $this->helper->getCurrentLanguage()->getName(),
    ]);
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['links'] = [
      '#theme' => 'links',
      '#links' => $this->helper->getAdminLinks(),
    ];

    $form['language_file_contents'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Language file contents'),
      '#required' => TRUE,
      '#description' => 'Add JSON in the form<br /><em>{ "newKey": "New Default Value" }</em><br />Can be used to update translations or create new ones. When creating new ones, don\'t forget to export configuration.<br />Keys can\'t contain dot character',
    ];

    $form['actions'] = [
      '#type' => 'actions',
    ];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Send'),
    ];
    $form['actions']['export'] = [
      '#type' => 'link',
      '#title' => $this->t('Export current'),
      '#url' => Url::fromRoute('next_translations.get_translations'),
      '#attributes' => ['class' => ['action-link']],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $data = Json::decode($form_state->getValue('language_file_contents'));

    if (!$data || !is_array($data)) {
      $form_state->setErrorByName('language_file_contents', $this->t('The content has errors.'));
      return;
    }

    $default_language_translations = $this->helper->getTranslationsInDefaultLanguage();
    $is_default_language = $this->helper->getCurrentLanguage()->isDefault();

    $keys_with_errors = [];
    $not_in_default_language = [];
    foreach ($data as $key => $value) {
      if (!is_scalar($value) || stristr($key, '.')) {
        $keys_with_errors[] = $key;
      };
      if (!$is_default_language && !array_key_exists($key, $default_language_translations)) {
        $not_in_default_language[] = $key;
      }
    }

    if (!empty($keys_with_errors)) {
      $form_state->setErrorByName('language_file_contents', $this->t('The content has errors at positions @keys.', [
        '@keys' => implode(', ', $keys_with_errors),
      ]));
    }

    if (!empty($not_in_default_language)) {
      $form_state->setErrorByName('language_file_contents', $this->t('The following keys do not exist in default language: @keys. Please import them in default language first.', [
        '@keys' => implode(', ', $not_in_default_language),
      ]));
    }

    if (empty($keys_with_errors) && empty($not_in_default_language)) {
      $form_state->set('translations', $data);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    $translations = $form_state->get('translations');

    // Append new keys to those already in config.
    $keys = array_merge($this->helper->getTranslationKeys(), array_keys($translations));

    // Append new defaults at the end of existing ones.
    $defaults = $this->helper->getTranslationDefaults();
    foreach ($translations as $key => $translation) {
      if (!isset($defaults[$key])) {
        $defaults[$key] = $translation;
      }
    }

    // Save translations and defaults in config.
    $this->helper->setTranslationKeysAndDefaults(array_unique($keys), $defaults);

    // Save translations in storage.
    $storage = $this->helper->getTranslations();
    $this->helper->setTranslations(array_merge($storage, $translations));

    $this->messenger()->addStatus($this->t('The translations and translation keys have been saved.'));
    $form_state->setRedirect('next_translations.admin_translations');
  }

}
