import { computed, watch } from 'vue';
import { getLocale, setLocale as setI18nLocale, t as translate } from '../i18n';

export const useI18n = () => {
  const locale = computed({
    get: () => getLocale(),
    set: (newLocale) => {
      setI18nLocale(newLocale);
      window.location.reload();
    },
  });

  const t = (key) => translate(key, locale.value);

  const isRTL = computed(() => locale.value === 'ar');

  return {
    locale,
    t,
    isRTL,
    toggleLocale: () => {
      locale.value = locale.value === 'en' ? 'ar' : 'en';
    },
  };
};
