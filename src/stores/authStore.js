import { defineStore } from 'pinia';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    mode: 'guest',
    loading: true,
    authError: null,
    authNotice: null,
    cloudEnabled: isSupabaseConfigured,
  }),

  getters: {
    isGuest: (state) => state.mode === 'guest' || !state.user,
    isMember: (state) => state.mode === 'member' && !!state.user,
    userEmail: (state) => state.user?.email ?? null,
  },

  actions: {
    async init() {
      if (!isSupabaseConfigured || !supabase) {
        this.loading = false;
        this.mode = 'guest';
        return;
      }

      const { data } = await supabase.auth.getSession();
      this.applySession(data.session);
      this.loading = false;

      supabase.auth.onAuthStateChange((_event, session) => {
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
      if (!supabase) {
        this.authError = 'Cloud workspace is not configured.';
        return false;
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        this.authError = error.message;
        return false;
      }
      this.applySession(data.session);
      return Boolean(data.session);
    },

    async signUp(email, password) {
      this.authError = null;
      this.authNotice = null;
      if (!supabase) {
        this.authError = 'Cloud workspace is not configured.';
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        this.authError = error.message;
        return false;
      }

      if (data.session) {
        this.applySession(data.session);
        this.authNotice = 'Account created. You are signed in.';
        return true;
      }

      // Supabase email confirmation enabled — user exists but no session yet
      if (data.user) {
        this.authNotice =
          'Account created. Open the confirmation link in your email, then sign in here.';
        return false;
      }

      this.authError = 'Sign-up did not complete. Try again or use a different email.';
      return false;
    },

    async signOut() {
      if (supabase) await supabase.auth.signOut();
      this.user = null;
      this.session = null;
      this.mode = 'guest';
      this.authNotice = null;
    },
  },
});
