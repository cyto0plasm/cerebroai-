import { defineStore } from 'pinia';
import { fetchBackendHealth } from '../services/healthService';

const THEME_KEY = 'cerebro_theme';
const CONTRAST_KEY = 'cerebro_high_contrast';
const ONBOARDING_KEY = 'cerebro_onboarding_done';

function applyDocumentTheme(theme, highContrast) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('high-contrast', highContrast);
}

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: localStorage.getItem(THEME_KEY) || 'light',
    highContrast: localStorage.getItem(CONTRAST_KEY) === 'true',
    onboardingDone: localStorage.getItem(ONBOARDING_KEY) === 'true',
    backend: {
      online: null,
      modelLoaded: null,
      threshold: null,
      architecture: null,
      modelRepo: null,
      loadError: null,
      checking: false,
    },
    compareA: null,
    compareB: null,
  }),

  actions: {
    init() {
      applyDocumentTheme(this.theme, this.highContrast);
      this.refreshBackendHealth();
      setInterval(() => this.refreshBackendHealth(), 60000);
    },

    setTheme(theme) {
      this.theme = theme;
      localStorage.setItem(THEME_KEY, theme);
      applyDocumentTheme(this.theme, this.highContrast);
    },

    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    },

    setHighContrast(on) {
      this.highContrast = on;
      localStorage.setItem(CONTRAST_KEY, String(on));
      applyDocumentTheme(this.theme, this.highContrast);
    },

    completeOnboarding() {
      this.onboardingDone = true;
      localStorage.setItem(ONBOARDING_KEY, 'true');
    },

    resetOnboarding() {
      this.onboardingDone = false;
      localStorage.removeItem(ONBOARDING_KEY);
    },

    async refreshBackendHealth() {
      this.backend.checking = true;
      const h = await fetchBackendHealth();
      this.backend = { ...h, checking: false };
    },

    setCompareSelection(slot, id) {
      if (slot === 'a') this.compareA = id;
      else this.compareB = id;
    },
  },
});
