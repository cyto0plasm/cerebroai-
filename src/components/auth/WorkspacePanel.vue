<template>
  <div
    v-if="showGate"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-sm animate-fade-in"
  >
    <div class="panel w-full max-w-md p-6 sm:p-8 flex flex-col gap-5 shadow-card-lg">
      <div>
        <AppLogo :link="false" size="lg" show-tagline />
        <p class="text-sm text-surface-500 dark:text-surface-400 mt-4 leading-relaxed">
          Choose how you want to work. Members get a private cloud workspace. Guests can screen slices in a temporary session only.
        </p>
      </div>

      <form v-if="view === 'signin' && auth.cloudEnabled" class="flex flex-col gap-3" @submit.prevent="handleSignIn">
        <input v-model="email" type="email" required placeholder="Email" class="input-field" autocomplete="email" />
        <input v-model="password" type="password" required minlength="8" maxlength="72" placeholder="Password" class="input-field" autocomplete="current-password" />
        <p v-if="auth.authError" class="text-xs text-danger-600" role="alert">{{ auth.authError }}</p>
        <p v-if="auth.authNotice" class="text-xs text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 rounded-lg px-3 py-2" role="status">{{ auth.authNotice }}</p>
        <BaseButton type="submit" variant="primary" class="w-full" :loading="busy">Sign in</BaseButton>
        <button type="button" class="text-xs text-brand-600 font-semibold" @click="view = 'signup'; auth.authError = null">Create account</button>
      </form>

      <form v-else-if="view === 'signup' && auth.cloudEnabled" class="flex flex-col gap-3" @submit.prevent="handleSignUp">
        <input v-model="email" type="email" required placeholder="Email" class="input-field" autocomplete="email" />
        <input v-model="password" type="password" required minlength="8" maxlength="72" placeholder="Password (8+ chars)" class="input-field" autocomplete="new-password" />
        <p v-if="auth.authError" class="text-xs text-danger-600" role="alert">{{ auth.authError }}</p>
        <p v-if="auth.authNotice" class="text-xs text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 rounded-lg px-3 py-2" role="status">{{ auth.authNotice }}</p>
        <BaseButton type="submit" variant="primary" class="w-full" :loading="busy">Create account</BaseButton>
        <button type="button" class="text-xs text-brand-600 font-semibold" @click="view = 'signin'; auth.authError = null">Already have an account</button>
      </form>

      <div class="flex flex-col gap-2 pt-2 border-t border-surface-100 dark:border-surface-700">
        <BaseButton variant="outline" class="w-full" @click="enterGuest">
          Continue as guest
        </BaseButton>
        <p class="text-[11px] text-surface-400 text-center leading-relaxed">
          Guest: analyze slices now. History clears when you leave. No rename cloud save, import, or compare archive.
        </p>
      </div>

      <p
        v-if="!auth.loading && !auth.cloudEnabled"
        class="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 rounded-lg px-3 py-2 leading-relaxed"
      >
        {{ auth.configHint || 'Cloud workspace is not configured. Use Continue as guest, or add Supabase keys and restart.' }}
      </p>
      <p v-else-if="auth.loading" class="text-xs text-surface-400 text-center">Checking cloud workspace…</p>
    </div>
  </div>

  <template v-if="showToolbar">
    <div
      v-if="auth.isGuest"
      :class="inline ? 'flex items-center gap-2 text-xs text-surface-500' : 'chip bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20 w-fit'"
    >
      <UserRound class="w-3.5 h-3.5 shrink-0" />
      <span>{{ inline ? 'Guest' : 'Guest session — not saved to cloud' }}</span>
    </div>

    <div
      v-else-if="auth.isMember"
      :class="inline ? 'flex items-center gap-3 text-sm shrink-0' : 'flex items-center gap-3 flex-wrap'"
    >
    <span
      v-if="inline"
      class="text-surface-600 dark:text-surface-400 truncate max-w-[200px] sm:max-w-xs"
      :title="auth.userEmail"
    >
      {{ auth.userEmail }}
    </span>
    <div
      v-else
      class="chip bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-200 border border-brand-200 dark:border-brand-800"
    >
      <ShieldCheck class="w-3.5 h-3.5" />
      {{ auth.userEmail }}
    </div>
    <button
      v-if="inline"
      type="button"
      class="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline shrink-0"
      @click="handleSignOut"
    >
      Sign out
    </button>
    <BaseButton v-else variant="ghost" size="sm" @click="handleSignOut">Sign out</BaseButton>
    </div>
  </template>
</template>

<script setup>
import { ref, computed } from 'vue';
import { UserRound, ShieldCheck } from 'lucide-vue-next';
import {
  isGuestSessionChosen,
  markGuestSessionChosen,
  clearGuestSessionChoice,
} from '../../utils/guestSession';
import { useAuthStore } from '../../stores/authStore';
import { usePredictionStore } from '../../stores/predictionStore';
import AppLogo from '../ui/AppLogo.vue';
import BaseButton from '../ui/BaseButton.vue';

const props = defineProps({
  gate: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
});

const auth = useAuthStore();
const store = usePredictionStore();

const view = ref('signin');
const email = ref('');
const password = ref('');
const busy = ref(false);
const guestChosen = ref(isGuestSessionChosen());

const showGate = computed(
  () => props.gate && !auth.loading && auth.isGuest && !guestChosen.value
);

/** Gate-only instance must not render account UI (dashboard uses a separate inline bar). */
const showToolbar = computed(() => props.inline || !props.gate);

async function enterGuest() {
  auth.continueAsGuest();
  markGuestSessionChosen();
  guestChosen.value = true;
  store.resetGuestSession();
}

async function handleSignIn() {
  busy.value = true;
  auth.authNotice = null;
  const ok = await auth.signIn(email.value, password.value);
  busy.value = false;
  if (ok) {
    guestChosen.value = true;
    markGuestSessionChosen();
    await store.hydrateWorkspace();
  }
}

async function handleSignUp() {
  busy.value = true;
  const ok = await auth.signUp(email.value, password.value);
  busy.value = false;
  if (ok) {
    guestChosen.value = true;
    markGuestSessionChosen();
    await store.hydrateWorkspace();
  } else if (auth.authNotice) {
    view.value = 'signin';
  }
}

async function handleSignOut() {
  await auth.signOut();
  clearGuestSessionChoice();
  guestChosen.value = false;
  store.resetGuestSession();
}
</script>
