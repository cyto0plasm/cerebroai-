<template>
  <DefaultLayout />
</template>

<script setup>
import { onMounted } from 'vue';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { usePredictionStore } from './stores/predictionStore';

const store = usePredictionStore();

onMounted(() => {
  // Seeds high-fidelity dummy items for demonstrating dashboard features on first load
  store.seedMockHistory();
});
</script>
