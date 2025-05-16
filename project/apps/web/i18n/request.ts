import {getRequestConfig} from 'next-intl/server';
import deepmerge from 'deepmerge';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/next-translations`);
  const data = await res.json();
  const userMessages = { "Default": data };
  const defaultMessages = (await import(`@/messages/en.json`)).default;
  const messages = deepmerge(defaultMessages, userMessages);

  return {
    locale,
    messages,
  };
});
