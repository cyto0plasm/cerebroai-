import en from './locales/en.json';
import ar from './locales/ar.json';

export const messages = { en, ar };

export const defaultLocale = localStorage.getItem('locale') || 'en';

export const setLocale = (locale) => {
  localStorage.setItem('locale', locale);
  document.documentElement.lang = locale;
  if (locale === 'ar') {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }
};

export const getLocale = () => localStorage.getItem('locale') || 'en';

export const t = (key, locale = getLocale()) => {
  const keys = key.split('.');
  let value = locale === 'ar' ? ar : en;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};
