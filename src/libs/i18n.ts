/* eslint-disable no-console */
import i18next, { type Resource } from 'i18next';

import de from '@/locales/de-DE.json';
import en from '@/locales/en-US.json';
import fr from '@/locales/fr-FR.json';
import nl from '@/locales/nl-NL.json';

type Locales = Record<string, object>;

const sharedLocales: Locales = { en, nl, de, fr };

/**
 * Initialize internationalization with objects containing the locale strings per language.
 *
 * @example
 * import en from '@/locales/en-US.json';
 * import nl from '@/locales/nl-NL.json';
 *
 * i18n.init({ en, nl });
 */
export async function init(locales: Locales) {
  const resources: Resource = {};

  // Add the language locale' JSON to the default 'translation' namespace.
  for (const key in locales) {
    resources[key] = {
      translation: { ...sharedLocales[key], ...locales[key] },
    };
  }

  return await i18next.init({
    resources,

    lng: 'en',
    fallbackLng: 'en',

    // Log a warning when a translation is missing.
    saveMissing: true,
    missingKeyHandler: (languages, _, key) => {
      console.warn(`Missing translation for key '${key}' in languages '${languages.join(', ')}'`);
    },
  });
}

export { t } from 'i18next';
