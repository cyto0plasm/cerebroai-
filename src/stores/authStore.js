import { defineStore } from 'pinia';
import { getSupabase, isSupabaseConfigured, getSupabaseConfigStatus } from '../lib/supabase';
import { normalizeAuthEmail, mapAuthError } from '../utils/authErrors';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    mode: 'guest',
    loading: true,
    authError: null,
    authNotice: null,
  }),

  getters: {
    cloudEnabled() {
      return isSupabaseConfigured() && Boolean(getSupabase());
    },
    configHint() {
      return getSupabaseConfigStatus();
    },
    isGuest: (state) => state.mode === 'guest' || !state.user,
    isMember: (state) => state.mode === 'member' && !!state.user,
    userEmail: (state) => state.user?.email ?? null,
  },

  actions: {
    async init() {
      const sb = getSupabase();
      if (!sb) {
        this.loading = false;
        this.mode = 'guest';
        return;
      }

      try {
        const { data, error } = await sb.auth.getSession();
        if (error) console.warn('[CerebroAI] getSession:', error.message);
        this.applySession(data?.session ?? null);
      } catch (e) {
        console.warn('[CerebroAI] auth init failed', e);
      } finally {
        this.loading = false;
      }

      sb.auth.onAuthStateChange((_event, session) => {
        this.applySession(session);
      });
    },

    applySession(session) {
      this.session = session;
      this.user = session?.user ?? null;
      if (this.user) {
        this.mode = 'member';
        this.authError = null;
      } else if (this.mode === 'member') {
        this.mode = 'guest';
      }
    },

    continueAsGuest() {
      this.mode = 'guest';
      this.authError = null;
      this.authNotice = null;
    },

    async signIn(email, password) {
      this.authError = null;
      this.authNotice = null;
      const sb = getSupabase();
      if (!sb) {
        this.authError = getSupabaseConfigStatus() || 'Cloud workspace is not configured.';
        return false;
      }

      const { data, error } = await sb.auth.signInWithPassword({
        email: normalizeAuthEmail(email),
        password,
      });

      if (error) {
        this.authError = mapAuthError(error);
        return false;
      }

      if (!data.session) {
        this.authError = 'Sign-in did not complete. Confirm your email or try again.';
        return false;
      }

      this.applySession(data.session);
      return true;
    },

    async signUp(email, password) {
      this.authError = null;
      this.authNotice = null;
      const sb = getSupabase();
      if (!sb) {
        this.authError = getSupabaseConfigStatus() || 'Cloud workspace is not configured.';
        return false;
      }

      if (password.length < 8) {
        this.authError = 'Password must be at least 8 characters.';
        return false;
      }
      if (password.length > 72) {
        this.authError = 'Password must be 72 characters or fewer.';
        return false;
      }

      const { data, error } = await sb.auth.signUp({
        email: normalizeAuthEmail(email),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        this.authError = mapAuthError(error);
        return false;
      }

      if (data.session) {
        this.applySession(data.session);
        this.authNotice = 'Account created. You are signed in.';
        return true;
      }

      if (data.user) {
        this.authNotice =
          'Account created. Open the confirmation link in your email, then sign in here.';
        return false;
      }

      this.authError = 'Sign-up did not complete. Try again or use a different email.';
      return false;
    },

    async signOut() {
      const sb = getSupabase();
      if (sb) await sb.auth.signOut();
      this.user = null;
      this.session = null;
      this.mode = 'guest';
      this.authNotice = null;
      this.authError = null;
    },
  },
});
