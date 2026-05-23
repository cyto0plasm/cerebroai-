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

      <form v-if="view === 'signin'" class="flex flex-col gap-3" @submit.prevent="handleSignIn">
        <input v-model="email" type="email" required placeholder="Email" class="input-field" autocomplete="email" />
        <input v-model="password" type="password" required placeholder="Password" class="input-field" autocomplete="current-password" />
        <p v-if="auth.authError" class="text-xs text-danger-600" role="alert">{{ auth.authError }}</p>
        <p v-if="auth.authNotice" class="text-xs text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 rounded-lg px-3 py-2" role="status">{{ auth.authNotice }}</p>
        <BaseButton type="submit" variant="primary" class="w-full" :loading="busy">Sign in</BaseButton>
        <button type="button" class="text-xs text-brand-600 font-semibold" @click="view = 'signup'">Create account</button>
      </form>

      <form v-else-if="view === 'signup'" class="flex flex-col gap-3" @submit.prevent="handleSignUp">
        <input v-model="email" type="email" required placeholder="Email" class="input-field" />
        <input v-model="password" type="password" required minlength="8" placeholder="Password (8+ chars)" class="input-field" />
        <p v-if="auth.authError" class="text-xs text-danger-600" role="alert">{{ auth.authError }}</p>
        <p v-if="auth.authNotice" class="text-xs text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 rounded-lg px-3 py-2" role="status">{{ auth.authNotice }}</p>
        <BaseButton type="submit" variant="primary" class="w-full" :loading="busy">Create account</BaseButton>
        <button type="button" class="text-xs text-brand-600 font-semibold" @click="view = 'signin'">Already have an account</button>
      </form>

      <div class="flex flex-col gap-2 pt-2 border-t border-surface-100 dark:border-surface-700">
        <BaseButton variant="outline" class="w-full" @click="enterGuest">
          Continue as guest
        </BaseButton>
        <p class="text-[11px] text-surface-400 text-center leading-relaxed">
          Guest: analyze slices now. History clears when you leave. No rename cloud save, import, or compare archive.
        </p>
      </div>

      <p v-if="!auth.cloudEnabled" class="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 rounded-lg px-3 py-2 leading-relaxed">
        {{ auth.configHint || 'Cloud workspace is not configured. Add Supabase keys to .env.local and restart the dev server, or use Continue as guest.' }}
      </p>
    </div>
  </div>

  <div
    v-else-if="auth.isGuest"
    class="chip bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20 w-fit"
  >
    <UserRound class="w-3.5 h-3.5" />
    Guest session — not saved to cloud
  </div>

  <div
    v-else-if="auth.isMember"
    class="flex items-center gap-3 flex-wrap"
  >
    <div class="chip bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-200 border border-brand-200 dark:border-brand-800">
      <ShieldCheck class="w-3.5 h-3.5" />
      {{ auth.userEmail }}
    </div>
    <BaseButton variant="ghost" size="sm" @click="handleSignOut">Sign out</BaseButton>
  </div>
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
