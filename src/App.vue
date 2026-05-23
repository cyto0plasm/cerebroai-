<template>
  <DefaultLayout />
</template>

<script setup>
import { onMounted } from 'vue';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { useAppStore } from './stores/appStore';

onMounted(() => {
  useAppStore().init();
});
</script>
