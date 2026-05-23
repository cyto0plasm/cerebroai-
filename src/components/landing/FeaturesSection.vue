<template>
  <section id="features" class="bg-surface-0 dark:bg-surface-900 border-y border-surface-200 dark:border-surface-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="flex flex-col gap-6">
          <div>
            <p class="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">Capabilities</p>
            <h2 class="font-display text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">
              Built for focused slice review
            </h2>
          </div>

          <div class="flex flex-col gap-5">
            <div v-for="feat in CORE_FEATURES" :key="feat.id" class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="iconBg[feat.id]">
                <component :is="icons[feat.id]" class="w-5 h-5" :class="iconColor[feat.id]" />
              </div>
              <div>
                <p class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ feat.title }}</p>
                <p class="text-sm text-surface-500 dark:text-surface-400 mt-0.5 leading-relaxed">{{ feat.description }}</p>
              </div>
            </div>
          </div>

          <router-link to="/dashboard" class="w-fit">
            <BaseButton variant="primary">Open workspace</BaseButton>
          </router-link>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="card in cards" :key="card.title" class="panel p-5 flex flex-col gap-2">
            <component :is="card.icon" class="w-5 h-5 text-brand-600" />
            <p class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ card.title }}</p>
            <p class="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{{ card.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Layers, ScanLine, ShieldCheck, ClipboardList } from 'lucide-vue-next';
import { CORE_FEATURES } from '../../constants';
import BaseButton from '../ui/BaseButton.vue';

const icons = { screening: ScanLine, maps: Layers, workspace: ClipboardList };
const iconBg = {
  screening: 'bg-brand-50 dark:bg-brand-950',
  maps: 'bg-accent-500/10',
  workspace: 'bg-success-50 dark:bg-success-500/10',
};
const iconColor = {
  screening: 'text-brand-600',
  maps: 'text-accent-500',
  workspace: 'text-success-600',
};

const cards = [
  { icon: ScanLine, title: 'ResNet18 core', text: 'Binary screening on 224×224 axial input.' },
  { icon: Layers, title: 'Grad-CAM', text: 'See where the model concentrated on the slice.' },
  { icon: ShieldCheck, title: 'Member vault', text: 'Encrypted account storage via Supabase.' },
  { icon: ClipboardList, title: 'Guest path', text: 'Try the full screening flow without an account.' },
];
</script>
