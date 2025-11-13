import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Lazy load translation files on-demand (reduces initial bundle size)
// Only the default language (fa) is loaded upfront, other languages load when switched
const loadResources = async (language: string) => {
  switch (language) {
    case 'en':
      return (await import('./locales/en/translation.json')).default;
    case 'fa':
      return (await import('./locales/fa/translation.json')).default;
    default:
      return (await import('./locales/en/translation.json')).default;
  }
};

// Initialize with minimal config, load resources dynamically
i18n.use(initReactI18next).init({
  lng: 'fa', // Default to Persian (Farsi)
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already does escaping
  },
  react: {
    useSuspense: false,
  },
  resources: {}, // Start with empty resources, load on-demand
});

// Load default language immediately
loadResources('fa').then((translation) => {
  i18n.addResourceBundle('fa', 'translation', translation);
});

// Add language change listener to load resources dynamically
i18n.on('languageChanged', async (lng) => {
  if (!i18n.hasResourceBundle(lng, 'translation')) {
    const translation = await loadResources(lng);
    i18n.addResourceBundle(lng, 'translation', translation);
  }
});

export default i18n;
