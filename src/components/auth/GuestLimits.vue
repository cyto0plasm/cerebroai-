<template>
  <div class="panel p-5 flex flex-col gap-3">
    <h3 class="text-sm font-semibold text-surface-900 dark:text-surface-100">Guest session limits</h3>
    <ul class="text-xs text-surface-500 dark:text-surface-400 flex flex-col gap-2 leading-relaxed">
      <li>· Studies disappear when you close the browser</li>
      <li>· Cannot rename, compare archives, or export session JSON</li>
      <li>· Screening and plot review are fully available</li>
    </ul>
    <router-link to="/dashboard">
      <BaseButton variant="soft" size="sm" class="w-full" @click="sessionStorage.removeItem('axial_guest_ok')">
        Sign in for full workspace
      </BaseButton>
    </router-link>
  </div>
</template>

<script setup>
import BaseButton from '../ui/BaseButton.vue';
</script>
