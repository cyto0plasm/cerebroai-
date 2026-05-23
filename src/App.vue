<template>
  <DefaultLayout />
</template>

<script setup>
import { watch, onMounted } from 'vue';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { useAppStore } from './stores/appStore';
import { useAuthStore } from './stores/authStore';
import { usePredictionStore } from './stores/predictionStore';

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
    if (member && !wasMember) {
      await store.hydrateWorkspace();
    } else if (!member && wasMember) {
      store.resetGuestSession();
    }
  }
);
</script>
