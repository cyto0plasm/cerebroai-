<template>
  <div class="bg-white rounded-xl border border-surface-200 shadow-card overflow-hidden">
    <!-- Collapsed header — plots hidden until user expands -->
    <button
      type="button"
      :aria-expanded="expanded"
      aria-controls="prediction-plots-panel"
      @click="expanded = !expanded"
      class="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-surface-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center shrink-0">
          <BarChart3 class="w-4 h-4 text-surface-600" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-surface-900">Visual analysis</p>
          <p class="text-xs text-surface-400 mt-0.5 truncate">
            {{ plotSummary }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <span class="hidden sm:inline text-xs font-medium text-brand-600">
          {{ expanded ? 'Hide plots' : 'Show plots' }}
        </span>
        <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface-100 text-surface-500">
          {{ availablePlotCount }}
        </span>
        <ChevronDown
          class="w-4 h-4 text-surface-400 transition-transform duration-200"
          :class="{ 'rotate-180': expanded }"
        />
      </div>
    </button>

    <!-- Expanded plot panel -->
    <div
      v-show="expanded"
      id="prediction-plots-panel"
      class="border-t border-surface-100 animate-fade-in"
    >
      <!-- Tab bar -->
      <div class="px-4 pt-3 pb-0 flex gap-1 overflow-x-auto scrollbar-thin">
        <button
          v-for="tab in visibleTabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id"
          :class="[
            'px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500',
            activeTab === tab.id
              ? 'bg-brand-50 text-brand-700 border border-brand-100'
              : 'text-surface-500 hover:text-surface-800 hover:bg-surface-50 border border-transparent'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="p-4 sm:p-5">
        <!-- Original scan -->
        <div v-if="activeTab === 'original'" class="flex flex-col gap-3">
          <p class="text-xs text-surface-500 leading-relaxed">
            Source image submitted for inference (224×224 resize applied server-side).
          </p>
          <div class="rounded-lg border border-surface-200 bg-surface-900 overflow-hidden">
            <img
              v-if="scan.previewUrl"
              :src="scan.previewUrl"
              :alt="`Original scan: ${scan.fileName}`"
              class="w-full object-contain max-h-80"
            />
            <div v-else class="flex items-center justify-center h-48 text-surface-500 text-xs">
              Original preview unavailable for this session
            </div>
          </div>
          <p v-if="scan.fileName" class="text-[11px] text-surface-400 font-mono truncate">
            {{ scan.fileName }}
          </p>
        </div>

        <!-- Grad-CAM heatmap -->
        <div v-else-if="activeTab === 'heatmap'" class="flex flex-col gap-3">
          <p class="text-xs text-surface-500 leading-relaxed">
            Grad-CAM activation map — warm colors mark regions that most influenced the model output.
          </p>
          <div class="rounded-lg border border-surface-200 overflow-hidden relative bg-surface-900">
            <img
              :src="scan.heatmap"
              alt="Grad-CAM activation heatmap"
              class="w-full object-contain max-h-80"
            />
            <div class="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
              <span class="text-[10px] text-surface-300 bg-surface-900/80 px-2 py-1 rounded font-medium">
                Grad-CAM overlay
              </span>
              <div class="flex items-center gap-1.5 text-[10px] text-surface-300 bg-surface-900/80 px-2 py-1 rounded">
                <span class="w-2 h-2 rounded-sm bg-blue-500"></span> low
                <span class="w-2 h-2 rounded-sm bg-yellow-400"></span> mid
                <span class="w-2 h-2 rounded-sm bg-red-500"></span> high
              </div>
            </div>
          </div>
        </div>

        <!-- Side-by-side comparison -->
        <div v-else-if="activeTab === 'compare'" class="flex flex-col gap-3">
          <p class="text-xs text-surface-500 leading-relaxed">
            Compare the input slice against the model&apos;s attention overlay.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="flex flex-col gap-1.5">
              <p class="text-[11px] font-semibold text-surface-500 uppercase tracking-wide">Input</p>
              <div class="rounded-lg border border-surface-200 bg-surface-900 overflow-hidden aspect-square flex items-center justify-center">
                <img
                  v-if="scan.previewUrl"
                  :src="scan.previewUrl"
                  alt="Input scan"
                  class="w-full h-full object-contain"
                />
                <span v-else class="text-xs text-surface-500 px-4 text-center">No preview</span>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <p class="text-[11px] font-semibold text-surface-500 uppercase tracking-wide">Activation</p>
              <div class="rounded-lg border border-surface-200 bg-surface-900 overflow-hidden aspect-square flex items-center justify-center">
                <img
                  v-if="scan.heatmap"
                  :src="scan.heatmap"
                  alt="Activation map"
                  class="w-full h-full object-contain"
                />
                <span v-else class="text-xs text-surface-500 px-4 text-center">No heatmap</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Class probability -->
        <div v-else-if="activeTab === 'probability'" class="flex flex-col gap-4">
          <p class="text-xs text-surface-500 leading-relaxed">
            Model confidence split between tumor-positive and tumor-negative classes for this scan.
          </p>

          <div class="rounded-lg border border-surface-100 bg-surface-50 p-4 flex flex-col gap-4">
            <div v-for="row in probabilityRows" :key="row.label" class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold" :class="row.textClass">{{ row.label }}</span>
                <span class="font-bold tabular-nums" :class="row.textClass">{{ row.percent }}%</span>
              </div>
              <div class="h-2.5 rounded-full bg-white border border-surface-200 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700 ease-out"
                  :class="row.barClass"
                  :style="{ width: row.percent + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Mini donut-style summary -->
          <div class="flex items-center gap-4 p-4 rounded-lg border border-surface-200">
            <div
              class="relative w-16 h-16 rounded-full shrink-0"
              :style="{ background: donutGradient }"
              aria-hidden="true"
            >
              <div class="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                <span class="text-xs font-bold text-surface-800 tabular-nums">{{ Math.round(scan.confidence * 100) }}%</span>
              </div>
            </div>
            <div>
              <p class="text-sm font-semibold text-surface-900">Predicted: {{ scan.prediction }}</p>
              <p class="text-xs text-surface-400 mt-0.5">
                {{ scan.prediction === 'Tumor' ? 'Tumor class' : 'No tumor class' }} assigned at
                {{ Math.round(scan.confidence * 100) }}% confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { BarChart3, ChevronDown } from 'lucide-vue-next';

const props = defineProps({
  scan: { type: Object, required: true },
});

const expanded = ref(false);
const activeTab = ref('original');

const hasPreview = computed(() => Boolean(props.scan?.previewUrl));
const hasHeatmap = computed(() => Boolean(props.scan?.heatmap));

const visibleTabs = computed(() => {
  const tabs = [
    { id: 'original', label: 'Original scan', show: hasPreview.value },
    { id: 'heatmap', label: 'Activation map', show: hasHeatmap.value },
    { id: 'compare', label: 'Side-by-side', show: hasPreview.value && hasHeatmap.value },
    { id: 'probability', label: 'Class probabilities', show: props.scan?.confidence != null },
  ];
  return tabs.filter(t => t.show);
});

const availablePlotCount = computed(() => visibleTabs.value.length);

const plotSummary = computed(() => {
  const parts = [];
  if (hasPreview.value) parts.push('original');
  if (hasHeatmap.value) parts.push('Grad-CAM');
  parts.push('probabilities');
  return parts.join(' · ');
});

const probabilityRows = computed(() => {
  const conf = props.scan?.confidence ?? 0;
  const isTumor = props.scan?.prediction === 'Tumor';
  const tumorPct = Math.round((isTumor ? conf : 1 - conf) * 100);
  const clearPct = 100 - tumorPct;

  return [
    {
      label: 'Tumor',
      percent: tumorPct,
      textClass: 'text-danger-600',
      barClass: 'bg-danger-500',
    },
    {
      label: 'No tumor',
      percent: clearPct,
      textClass: 'text-success-600',
      barClass: 'bg-success-500',
    },
  ];
});

const donutGradient = computed(() => {
  const tumorPct = probabilityRows.value[0].percent;
  return `conic-gradient(#ef4444 0% ${tumorPct}%, #22c55e ${tumorPct}% 100%)`;
});

watch(
  () => props.scan?.id,
  () => {
    expanded.value = false;
    activeTab.value = visibleTabs.value[0]?.id ?? 'probability';
  },
  { immediate: true }
);
</script>
