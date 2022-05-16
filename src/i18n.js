import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './translation/en.json';
import viTranslation from './translation/vi.json';

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'vi',
    debug: false,
    resources: {
      'en-US': {
        translation: enTranslation,
      },
      en: {
        translation: enTranslation,
      },
      vi: {
        translation: viTranslation,
      },
    },
  });

export default i18n;
