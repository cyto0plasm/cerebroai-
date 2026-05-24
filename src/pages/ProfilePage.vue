<template>
  <div class="min-h-screen">
    <div class="border-b border-surface-200/80 dark:border-surface-800 bg-surface-0/80 dark:bg-surface-900/80">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="font-display text-2xl font-bold text-surface-900 dark:text-surface-50">Profile</h1>
        <p class="text-sm text-surface-500 mt-1">Account and saved screening studies</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <!-- Guest -->
      <div v-if="!auth.isMember" class="panel p-8 text-center flex flex-col items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
          <UserRound class="w-7 h-7 text-surface-400" />
        </div>
        <div>
          <p class="font-semibold text-surface-900 dark:text-surface-50">Sign in to view your profile</p>
          <p class="text-sm text-surface-500 mt-1 max-w-sm mx-auto">
            Cloud studies, account details, and full scan reports are available for signed-in members.
          </p>
        </div>
        <router-link to="/dashboard">
          <BaseButton variant="primary">Go to workspace to sign in</BaseButton>
        </router-link>
      </div>

      <template v-else>
        <!-- Account -->
        <section class="panel overflow-hidden">
          <div class="panel-header flex items-center justify-between gap-4">
            <span class="text-sm font-semibold">Account</span>
            <span class="chip bg-success-50 dark:bg-success-950 text-success-700 dark:text-success-300 border border-success-200 dark:border-success-800">
              Member
            </span>
          </div>
          <div class="p-5 flex flex-col sm:flex-row gap-5 sm:items-center">
            <div
              class="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-200 flex items-center justify-center text-xl font-bold shrink-0"
              aria-hidden="true"
            >
              {{ initials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-surface-900 dark:text-surface-50 truncate">{{ auth.userEmail }}</p>
              <p class="text-xs text-surface-500 mt-1">User ID: {{ auth.user?.id?.slice(0, 8) }}…</p>
              <p v-if="memberSince" class="text-xs text-surface-500 mt-0.5">Member since {{ memberSince }}</p>
            </div>
            <BaseButton variant="outline" size="sm" class="shrink-0" @click="handleSignOut">Sign out</BaseButton>
          </div>
          <div class="px-5 pb-5 grid grid-cols-3 gap-3 border-t border-surface-100 dark:border-surface-800 pt-4">
            <div class="text-center">
              <p class="text-xl font-bold text-surface-900 dark:text-surface-50 tabular-nums">{{ scans.length }}</p>
              <p class="text-[10px] uppercase tracking-wide text-surface-400 font-semibold mt-0.5">Studies</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-bold text-danger-600 tabular-nums">{{ tumorCount }}</p>
              <p class="text-[10px] uppercase tracking-wide text-surface-400 font-semibold mt-0.5">Tumor flags</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-bold text-success-600 tabular-nums">{{ clearCount }}</p>
              <p class="text-[10px] uppercase tracking-wide text-surface-400 font-semibold mt-0.5">Clear</p>
            </div>
          </div>
        </section>

        <!-- Scans -->
        <section class="panel overflow-hidden">
          <div class="panel-header flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="text-sm font-semibold">Saved studies</span>
              <p class="text-[11px] text-surface-400 mt-0.5">Tap a row for full report details</p>
            </div>
            <div class="relative w-full sm:w-56">
              <Search class="absolute left-3 top-2.5 w-3.5 h-3.5 text-surface-400 pointer-events-none" />
              <input
                v-model="search"
                type="search"
                placeholder="Search…"
                class="input-field pl-9 py-2 text-xs w-full"
              />
            </div>
          </div>

          <div v-if="loading" class="p-10 text-center text-sm text-surface-400">Loading studies…</div>
          <p v-else-if="loadError" class="p-5 text-xs text-danger-600 bg-danger-50 dark:bg-danger-950/30 m-4 rounded-lg" role="alert">
            {{ loadError }}
          </p>
          <div v-else-if="filteredScans.length === 0" class="p-10 text-center">
            <FileStack class="w-10 h-10 text-surface-300 mx-auto mb-3" />
            <p class="text-sm text-surface-500">No studies yet</p>
            <router-link to="/dashboard" class="inline-block mt-3">
              <BaseButton variant="soft" size="sm">Analyze a slice</BaseButton>
            </router-link>
          </div>
          <ul v-else class="divide-y divide-surface-100 dark:divide-surface-800">
            <li v-for="scan in filteredScans" :key="scan.id">
              <button
                type="button"
                class="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
                @click="openScan(scan)"
              >
                <div class="w-11 h-11 rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 overflow-hidden shrink-0">
                  <img
                    v-if="scan.previewUrl"
                    :src="scan.previewUrl"
                    alt=""
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-surface-400">
                    <ImageIcon class="w-4 h-4" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
                    {{ scan.displayName || scan.fileName }}
                  </p>
                  <p class="text-xs text-surface-500 mt-0.5">
                    {{ scan.prediction }} · {{ Math.round((scan.confidence || 0) * 100) }}%
                    · {{ formatShortDate(scan.timestamp) }}
                  </p>
                </div>
                <span
                  :class="[
                    'chip shrink-0',
                    scan.prediction === 'Tumor'
                      ? 'bg-danger-50 text-danger-700 border border-danger-200 dark:bg-danger-950/40 dark:text-danger-300 dark:border-danger-800'
                      : 'bg-success-50 text-success-700 border border-success-200 dark:bg-success-950/40 dark:text-success-300 dark:border-success-800',
                  ]"
                >
                  {{ scan.prediction === 'Tumor' ? 'Flagged' : 'Clear' }}
                </span>
                <ChevronRight class="w-4 h-4 text-surface-400 shrink-0" />
              </button>
            </li>
          </ul>
        </section>
      </template>
    </div>

    <ScanDetailDialog
      :open="dialogOpen"
      :scan="selectedScan"
      :can-delete="auth.isMember"
      @close="dialogOpen = false"
      @delete="handleDelete"
      @open-workspace="handleOpenWorkspace"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  UserRound,
  Search,
  FileStack,
  ImageIcon,
  ChevronRight,
} from 'lucide-vue-next';
import { useAuthStore } from '../stores/authStore';
import { usePredictionStore } from '../stores/predictionStore';
import * as scanRepo from '../services/scanRepository';
import { clearGuestSessionChoice } from '../utils/guestSession';
import ScanDetailDialog from '../components/profile/ScanDetailDialog.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import { TUMOR_CLASSES } from '../constants';

const auth = useAuthStore();
const predictionStore = usePredictionStore();

const scans = ref([]);
const loading = ref(false);
const loadError = ref(null);
const search = ref('');
const dialogOpen = ref(false);
const selectedScan = ref(null);

const initials = computed(() => {
  const email = auth.userEmail || '';
  const part = email.split('@')[0] || '?';
  return part.slice(0, 2).toUpperCase();
});

const memberSince = computed(() => {
  const created = auth.user?.created_at;
  if (!created) return null;
  return new Date(created).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
});

const tumorCount = computed(() =>
  scans.value.filter((s) => s.prediction === TUMOR_CLASSES.TUMOR).length
);
const clearCount = computed(() => scans.value.length - tumorCount.value);

const filteredScans = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return scans.value;
  return scans.value.filter((s) => {
    const name = (s.displayName || s.fileName || '').toLowerCase();
    const pid = (s.patientId || '').toLowerCase();
    return name.includes(q) || pid.includes(q) || s.prediction?.toLowerCase().includes(q);
  });
});

function mergeWithLocalImages(cloudList) {
  const localById = new Map(predictionStore.history.map((h) => [h.id, h]));
  return cloudList.map((scan) => {
    const local = localById.get(scan.id);
    if (!local) return scan;
    return {
      ...scan,
      previewUrl: scan.previewUrl || local.previewUrl,
      heatmap: scan.heatmap || local.heatmap,
    };
  });
}

async function loadScans() {
  if (!auth.isMember || !auth.user) {
    scans.value = [];
    return;
  }
  loading.value = true;
  loadError.value = null;
  try {
    const cloud = await scanRepo.fetchUserScans(auth.user.id);
    scans.value = mergeWithLocalImages(cloud);
  } catch (e) {
    loadError.value = e?.message || 'Failed to load studies.';
    scans.value = mergeWithLocalImages([...predictionStore.history]);
  } finally {
    loading.value = false;
  }
}

function openScan(scan) {
  selectedScan.value = scan;
  dialogOpen.value = true;
}

async function handleDelete(scanId) {
  await predictionStore.deleteHistoryItem(scanId);
  scans.value = scans.value.filter((s) => s.id !== scanId);
}

function handleOpenWorkspace(scanId) {
  if (scanId) predictionStore.setHistorySelection(scanId);
}

async function handleSignOut() {
  await auth.signOut();
  clearGuestSessionChoice();
  scans.value = [];
}

function formatShortDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

onMounted(() => {
  if (auth.isMember) loadScans();
});

watch(
  () => auth.isMember,
  (member) => {
    if (member) loadScans();
    else scans.value = [];
  }
);
</script>
