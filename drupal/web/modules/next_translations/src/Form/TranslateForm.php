<?php

namespace Drupal\next_translations\Form;

use Drupal\next_translations\Helper;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a Next.js Translate form.
 */
class TranslateForm extends FormBase {

  /**
   * The next_translations.helper service.
   *
   * @var \Drupal\next_translations\Helper
   */
  protected $helper;

  /**
   * Helper array of keys to form fields used in TranslateForm::prettifyField().
   *
   * @var array
   */
  protected $formFields = [];

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
    return 'next_translations_translate_form';
  }

  /**
   * Title callback for the form.
   *
   * @return \Drupal\Core\StringTranslation\TranslatableMarkup
   *   The title.
   */
  public function titleCallback() {
    return $this->t('Edit translations for @language', [
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

    $translations = $this->helper->getTranslations();
    $translations_in_default_language = $this->helper->getTranslationsInDefaultLanguage();

    foreach ($this->helper->getTranslationKeys() as $key) {
      $field_name = $this->prettifyKey($key);
      $form[$field_name] = [
        '#type' => 'textfield',
        '#title' => $key,
        '#required' => FALSE,
        '#maxlength' => 1000,
      ];

      if (empty($translations[$key])) {
        $form[$field_name]['#attributes']['placeholder'] = $translations_in_default_language[$key];
        $form[$field_name]['#description'] = $this->t('Missing translation.');
      }
      else {
        $form[$field_name]['#default_value'] = $translations[$key];
      }
    }

    $form['actions'] = [
      '#type' => 'actions',
    ];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Send'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    $values = [];
    foreach ($this->helper->getTranslationKeys() as $key) {
      $values[$key] = $form_state->getValue($this->prettifyKey($key));
    }
    $this->helper->setTranslations($values);

    $this->messenger()->addStatus($this->t('The translations have been saved.'));
  }

  /**
   * Convert a string key into a form field key.
   *
   * Having field keys like "My custom text" in Drupal forms trigger errors.
   *
   * @param string $key
   *   The string key.
   *
   * @return string
   *   The form field key.
   */
  protected function prettifyKey(string $key) {
    if (!isset($this->formFields[$key])) {
      $this->formFields[$key] = 'string_' . count($this->formFields);
    }
    return $this->formFields[$key];
  }

}
