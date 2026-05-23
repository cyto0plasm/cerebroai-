<template>
  <div class="flex flex-col gap-3">

    <!-- Search -->
    <div v-if="store.history.length > 0" class="flex gap-2">
      <div class="relative flex-1">
        <Search class="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-surface-400 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="w-full pl-8 pr-3 py-2 text-xs bg-surface-50 border border-surface-200 rounded-lg text-surface-700 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>
      <button
        @click="toggleFilter"
        :class="[
          'px-3 py-2 rounded-lg text-xs font-semibold border transition-colors shrink-0',
          filterClass === 'all' ? 'bg-surface-50 border-surface-200 text-surface-600' :
          filterClass === 'Tumor' ? 'bg-danger-50 border-danger-200 text-danger-600' :
          'bg-success-50 border-success-200 text-success-600'
        ]"
      >
        {{ filterClass === 'all' ? 'All' : filterClass }}
      </button>
    </div>

    <!-- List -->
    <div v-if="filteredHistory.length > 0" class="flex flex-col gap-1.5 overflow-y-auto" style="max-height: 460px">
      <button
        v-for="item in filteredHistory"
        :key="item.id"
        @click="store.setHistorySelection(item.id)"
        :class="[
          'w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-100 flex items-center gap-3 group',
          store.selectedHistoryId === item.id
            ? 'bg-brand-50 border-brand-200'
            : 'bg-white border-surface-100 hover:border-surface-200 hover:bg-surface-50'
        ]"
      >
        <!-- Thumbnail -->
        <div class="w-9 h-9 rounded-lg bg-surface-100 overflow-hidden shrink-0 flex items-center justify-center border border-surface-200">
          <img v-if="item.previewUrl" :src="item.previewUrl" alt="" class="w-full h-full object-cover" @error="(e) => e.target.style.display='none'" />
          <Brain v-else class="w-4 h-4 text-surface-300" />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-surface-800 truncate">{{ item.fileName }}</p>
          <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span :class="['w-1.5 h-1.5 rounded-full shrink-0', item.prediction === 'Tumor' ? 'bg-danger-500' : 'bg-success-500']"></span>
            <span class="text-[11px] text-surface-400">{{ item.prediction }} · {{ Math.round(item.confidence * 100) }}%</span>
            <span
              v-if="item.heatmap || item.previewUrl"
              class="text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded"
            >
              plots
            </span>
          </div>
        </div>

        <!-- Time + delete -->
        <div class="flex flex-col items-end gap-1 shrink-0">
          <span class="text-[10px] text-surface-300">{{ formatTime(item.timestamp) }}</span>
          <button
            @click.stop="store.deleteHistoryItem(item.id)"
            class="opacity-0 group-hover:opacity-100 p-0.5 rounded text-surface-300 hover:text-danger-500 transition-all focus:outline-none"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </button>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <FolderOpen class="w-7 h-7 text-surface-200 mb-2" />
      <p class="text-xs font-medium text-surface-400">No scans yet</p>
      <p class="text-[11px] text-surface-300 mt-0.5">Results will appear here after analysis</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, X, FolderOpen, Brain } from 'lucide-vue-next';
import { usePredictionStore } from '../../stores/predictionStore';

const store = usePredictionStore();
const searchQuery = ref('');
const filterClass = ref('all');

const toggleFilter = () => {
  filterClass.value = filterClass.value === 'all' ? 'Tumor' : filterClass.value === 'Tumor' ? 'No Tumor' : 'all';
};

const filteredHistory = computed(() =>
  store.history.filter(item => {
    const matchSearch = item.fileName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchFilter = filterClass.value === 'all' || item.prediction === filterClass.value;
    return matchSearch && matchFilter;
  })
);

const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
</script>
