<template>
  <section id="features" class="bg-white border-y border-surface-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <!-- Left: text -->
        <div class="flex flex-col gap-6">
          <div>
            <p class="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">What it does</p>
            <h2 class="text-3xl font-bold text-surface-900 tracking-tight leading-tight">
              Accurate analysis,<br />zero complexity
            </h2>
          </div>

          <div class="flex flex-col gap-5">
            <div v-for="feat in CORE_FEATURES" :key="feat.id" class="flex items-start gap-4">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" :class="iconBg[feat.id]">
                <component :is="icons[feat.id]" class="w-4.5 h-4.5" :class="iconColor[feat.id]" style="width:18px;height:18px" />
              </div>
              <div>
                <p class="text-sm font-semibold text-surface-900">{{ feat.title }}</p>
                <p class="text-sm text-surface-500 mt-0.5 leading-relaxed">{{ feat.description }}</p>
              </div>
            </div>
          </div>

          <router-link to="/dashboard" class="mt-2 w-fit">
            <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
              Open Scanner
              <ArrowRight class="w-4 h-4" />
            </button>
          </router-link>
        </div>

        <!-- Right: visual grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-surface-50 rounded-xl border border-surface-200 p-5 flex flex-col gap-3">
            <div class="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <Layers class="w-4 h-4 text-brand-600" />
            </div>
            <p class="text-sm font-semibold text-surface-900">CNN Model</p>
            <p class="text-xs text-surface-500 leading-relaxed">Custom PyTorch architecture trained on labeled MRI datasets.</p>
          </div>
          <div class="bg-surface-50 rounded-xl border border-surface-200 p-5 flex flex-col gap-3">
            <div class="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center">
              <Zap class="w-4 h-4 text-warning-500" />
            </div>
            <p class="text-sm font-semibold text-surface-900">Fast Inference</p>
            <p class="text-xs text-surface-500 leading-relaxed">Results in under 450ms on CPU. GPU accelerated when available.</p>
          </div>
          <div class="bg-surface-50 rounded-xl border border-surface-200 p-5 flex flex-col gap-3">
            <div class="w-8 h-8 rounded-lg bg-success-50 flex items-center justify-center">
              <ShieldCheck class="w-4 h-4 text-success-600" />
            </div>
            <p class="text-sm font-semibold text-surface-900">Demo-ready</p>
            <p class="text-xs text-surface-500 leading-relaxed">Runs in the browser with a hosted API. Images are sent to the server for analysis.</p>
          </div>
          <div class="bg-surface-50 rounded-xl border border-surface-200 p-5 flex flex-col gap-3">
            <div class="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center">
              <ClipboardList class="w-4 h-4 text-surface-500" />
            </div>
            <p class="text-sm font-semibold text-surface-900">Scan History</p>
            <p class="text-xs text-surface-500 leading-relaxed">All results saved locally in your browser for easy review.</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ArrowRight, Layers, Zap, ShieldCheck, ClipboardList } from 'lucide-vue-next';
import { CORE_FEATURES } from '../../constants';

const icons = { 'deep-telemetry': Layers, 'speed': Zap, 'history': ClipboardList };
const iconBg = { 'deep-telemetry': 'bg-brand-50', 'speed': 'bg-warning-50', 'history': 'bg-success-50' };
const iconColor = { 'deep-telemetry': 'text-brand-600', 'speed': 'text-warning-500', 'history': 'text-success-600' };
</script>
