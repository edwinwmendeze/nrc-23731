import i18next from 'i18next';

const resources = {
  es: {
    common: await import('./locales/es/common.json'),
  },
  en: {
    common: await import('./locales/en/common.json'),
  },
};

i18next.init({
  lng: 'es',
  fallbackLng: 'en',
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
