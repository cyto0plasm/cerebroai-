import { defineStore } from 'pinia';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    mode: 'guest',
    loading: true,
    authError: null,
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
      this.session = data.session;
      this.user = data.session?.user ?? null;
      this.mode = this.user ? 'member' : 'guest';
      this.loading = false;

      supabase.auth.onAuthStateChange((_event, session) => {
        this.session = session;
        this.user = session?.user ?? null;
        if (!session) {
          this.mode = 'guest';
        } else if (this.mode !== 'guest') {
          this.mode = 'member';
        }
      });
    },

    continueAsGuest() {
      this.mode = 'guest';
      this.authError = null;
    },

    async signIn(email, password) {
      this.authError = null;
      if (!supabase) {
        this.authError = 'Cloud workspace is not configured.';
        return false;
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        this.authError = error.message;
        return false;
      }
      this.session = data.session;
      this.user = data.user;
      this.mode = 'member';
      return true;
    },

    async signUp(email, password) {
      this.authError = null;
      if (!supabase) {
        this.authError = 'Cloud workspace is not configured.';
        return false;
      }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        this.authError = error.message;
        return false;
      }
      if (data.session) {
        this.session = data.session;
        this.user = data.user;
        this.mode = 'member';
      }
      return true;
    },

    async signOut() {
      if (supabase) await supabase.auth.signOut();
      this.user = null;
      this.session = null;
      this.mode = 'guest';
    },
  },
});
