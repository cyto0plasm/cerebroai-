<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[100] pointer-events-none">
      <div class="absolute inset-0 bg-surface-900/50 pointer-events-auto" @click="skip" />
      <div
        v-if="targetRect"
        class="absolute rounded-xl ring-4 ring-brand-500 ring-offset-2 ring-offset-transparent pointer-events-none transition-all duration-300"
        :style="highlightStyle"
      />
      <div
        class="absolute pointer-events-auto max-w-sm bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-card-lg p-5"
        :style="tooltipStyle"
        role="dialog"
        aria-labelledby="tour-title"
      >
        <p id="tour-title" class="text-sm font-bold text-surface-900 dark:text-surface-100">
          {{ step.title }}
        </p>
        <p class="text-xs text-surface-500 mt-2 leading-relaxed">{{ step.body }}</p>
        <div class="flex items-center justify-between mt-4 gap-2">
          <button type="button" class="text-xs text-surface-400 hover:text-surface-600" @click="skip">
            Skip tour
          </button>
          <div class="flex gap-2">
            <span class="text-[10px] text-surface-400 self-center">{{ index + 1 }}/{{ steps.length }}</span>
            <button
              type="button"
              class="text-xs font-semibold px-3 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              @click="next"
            >
              {{ index === steps.length - 1 ? 'Done' : 'Next' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '../../stores/appStore';

const app = useAppStore();
const route = useRoute();

const steps = [
  { selector: '[data-tour="upload"]', title: 'Upload', body: 'Add one MRI slice or a small series (up to 8). DICOM (.dcm) is converted automatically.' },
  { selector: '[data-tour="patient-id"]', title: 'Case ID', body: 'Optional anonymous label — stored only in this browser. Never use real patient names.' },
  { selector: '[data-tour="result"]', title: 'Results', body: 'Prediction, summary report, and collapsible visual plots appear here after analysis.' },
  { selector: '[data-tour="history"]', title: 'Your scans', body: 'Session history stays on this device. Compare two scans or export JSON for research notes.' },
];

const index = ref(0);
const targetRect = ref(null);

const showTour = ref(false);

const visible = computed(
  () => route.name === 'dashboard' && !app.onboardingDone && showTour.value
);

const step = computed(() => steps[index.value]);

const highlightStyle = computed(() => {
  if (!targetRect.value) return {};
  const r = targetRect.value;
  return {
    top: `${r.top - 4}px`,
    left: `${r.left - 4}px`,
    width: `${r.width + 8}px`,
    height: `${r.height + 8}px`,
  };
});

const tooltipStyle = computed(() => {
  if (!targetRect.value) return { top: '20%', left: '50%', transform: 'translateX(-50%)' };
  const r = targetRect.value;
  return {
    top: `${Math.min(r.bottom + 12, window.innerHeight - 200)}px`,
    left: `${Math.max(16, Math.min(r.left, window.innerWidth - 340))}px`,
  };
});

function measure() {
  const el = document.querySelector(step.value?.selector);
  if (el) {
    targetRect.value = el.getBoundingClientRect();
  } else {
    targetRect.value = null;
  }
}

function next() {
  if (index.value >= steps.length - 1) {
    app.completeOnboarding();
    targetRect.value = null;
    return;
  }
  index.value += 1;
  nextTick(measure);
}

function skip() {
  app.completeOnboarding();
  targetRect.value = null;
}

let ro;
onMounted(() => {
  if (!app.onboardingDone && route.name === 'dashboard') {
    setTimeout(() => {
      showTour.value = true;
      measure();
      if (!targetRect.value) index.value = 0;
    }, 500);
    window.addEventListener('resize', measure);
    ro = new ResizeObserver(measure);
    document.querySelector('[data-tour="upload"]')?.parentElement && ro.observe(document.body);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', measure);
  ro?.disconnect();
});

watch(index, () => nextTick(measure));
</script>
