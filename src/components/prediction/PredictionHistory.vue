<template>
  <div class="flex flex-col gap-3">
    <div v-if="store.history.length > 0" class="flex gap-2">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-2.5 w-3.5 h-3.5 text-surface-400 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search studies…"
          class="input-field pl-9 py-2 text-xs"
        />
      </div>
      <button
        type="button"
        @click="toggleFilter"
        class="chip border border-surface-200 dark:border-surface-600 shrink-0 cursor-pointer hover:border-brand-400 transition-colors"
        :class="filterChipClass"
      >
        {{ filterClass === 'all' ? 'All' : filterClass }}
      </button>
    </div>

    <div v-if="filteredHistory.length > 0" class="flex flex-col gap-1.5 overflow-y-auto max-h-[420px] pr-0.5">
      <div
        v-for="item in filteredHistory"
        :key="item.id"
        :class="[
          'group w-full rounded-xl border transition-all duration-200',
          store.selectedHistoryId === item.id
            ? 'border-brand-400 bg-brand-50/80 dark:bg-brand-950/40 shadow-card'
            : 'border-surface-100 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 hover:border-surface-300 dark:hover:border-surface-600',
        ]"
      >
        <button
          type="button"
          class="w-full text-left px-3 py-2.5 flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 rounded-xl"
          @click="store.setHistorySelection(item.id)"
        >
          <div class="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 overflow-hidden shrink-0 border border-surface-200 dark:border-surface-600">
            <img
              v-if="item.previewUrl"
              :src="item.previewUrl"
              alt=""
              class="w-full h-full object-cover"
              @error="(e) => (e.target.style.display = 'none')"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-surface-300">
              <ImageIcon class="w-4 h-4" />
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <p v-if="renamingId !== item.id" class="text-xs font-semibold text-surface-800 dark:text-surface-100 truncate">
              {{ item.displayName || item.fileName }}
            </p>
            <input
              v-else
              v-model="renameValue"
              class="input-field py-1 text-xs"
              @keydown.enter="commitRename(item.id)"
              @keydown.escape="cancelRename"
              @click.stop
            />
            <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span
                :class="[
                  'w-1.5 h-1.5 rounded-full',
                  item.prediction === 'Tumor' ? 'bg-danger-500' : 'bg-success-500',
                ]"
              />
              <span class="text-[11px] text-surface-400">
                {{ item.prediction }} · {{ Math.round(item.confidence * 100) }}%
              </span>
            </div>
          </div>

          <div class="flex flex-col items-end gap-1 shrink-0">
            <span class="text-[10px] text-surface-400 tabular-nums">{{ formatTime(item.timestamp) }}</span>
            <div class="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                v-if="store.canPersist"
                type="button"
                class="p-1 rounded-md text-surface-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950"
                title="Rename"
                @click.stop="startRename(item)"
              >
                <Pencil class="w-3 h-3" />
              </button>
              <button
                type="button"
                class="p-1 rounded-md text-surface-400 hover:text-danger-600 hover:bg-danger-50"
                title="Remove"
                @click.stop="store.deleteHistoryItem(item.id)"
              >
                <X class="w-3 h-3" />
              </button>
            </div>
          </div>
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <FolderOpen class="w-7 h-7 text-surface-300 mb-2" />
      <p class="text-xs font-medium text-surface-500">No studies yet</p>
      <p class="text-[11px] text-surface-400 mt-0.5">Completed screenings appear here</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, X, FolderOpen, Pencil, ImageIcon } from 'lucide-vue-next';
import { usePredictionStore } from '../../stores/predictionStore';

const store = usePredictionStore();
const searchQuery = ref('');
const filterClass = ref('all');
const renamingId = ref(null);
const renameValue = ref('');

const filterChipClass = computed(() => {
  if (filterClass.value === 'Tumor') return 'bg-danger-50 text-danger-600 border-danger-200';
  if (filterClass.value === 'No Tumor') return 'bg-success-50 text-success-600 border-success-200';
  return 'bg-surface-50 text-surface-600';
});

const toggleFilter = () => {
  filterClass.value =
    filterClass.value === 'all' ? 'Tumor' : filterClass.value === 'Tumor' ? 'No Tumor' : 'all';
};

const filteredHistory = computed(() =>
  store.history.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const name = (item.displayName || item.fileName || '').toLowerCase();
    const matchSearch = name.includes(q);
    const matchFilter = filterClass.value === 'all' || item.prediction === filterClass.value;
    return matchSearch && matchFilter;
  })
);

function startRename(item) {
  renamingId.value = item.id;
  renameValue.value = item.displayName || item.fileName;
}

async function commitRename(id) {
  await store.renameScan(id, renameValue.value);
  renamingId.value = null;
}

function cancelRename() {
  renamingId.value = null;
}

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
</script>
