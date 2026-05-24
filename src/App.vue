<template>
  <DefaultLayout />
</template>

<script setup>
import { watch, onMounted } from 'vue';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { useAppStore } from './stores/appStore';
import { useAuthStore } from './stores/authStore';
import { usePredictionStore } from './stores/predictionStore';
import { markGuestSessionChosen } from './utils/guestSession';

const app = useAppStore();
const auth = useAuthStore();
const store = usePredictionStore();

onMounted(async () => {
  app.init();
  await auth.init();
  if (auth.isMember) {
    await store.hydrateWorkspace();
  }
});

watch(
  () => auth.isMember,
  async (member, wasMember) => {
    if (member) {
      markGuestSessionChosen();
      if (!wasMember) await store.hydrateWorkspace();
    } else if (wasMember) {
      store.resetGuestSession();
    }
  }
);
</script>
