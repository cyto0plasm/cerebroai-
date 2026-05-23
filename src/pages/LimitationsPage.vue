<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100 tracking-tight">
      Limitations &amp; intended use
    </h1>
    <p class="text-sm text-surface-500 mt-2 leading-relaxed">
      Read before using {{ CONFIG.APP_NAME }} in research, teaching, or clinical-adjacent workflows.
    </p>

    <div class="mt-8 flex flex-col gap-6 text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
      <section v-for="block in sections" :key="block.title" class="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-5">
        <h2 class="text-base font-semibold text-surface-900 dark:text-surface-100 mb-2">{{ block.title }}</h2>
        <ul class="list-disc pl-5 flex flex-col gap-2">
          <li v-for="item in block.items" :key="item">{{ item }}</li>
        </ul>
      </section>

      <section class="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-5">
        <h2 class="text-base font-semibold text-surface-900 dark:text-surface-100 mb-2">Enterprise integrations</h2>
        <p>
          PACS connectivity, hospital SSO, and EMR export are <strong>not available</strong> on this deployment.
          For institutional deployment, a separate integration project would be required.
        </p>
      </section>
    </div>

    <router-link
      to="/dashboard"
      class="inline-flex mt-8 text-sm font-semibold text-brand-600 hover:text-brand-700"
    >
      ← Back to dashboard
    </router-link>
  </div>
</template>

<script setup>
import { CONFIG } from '../config';

const sections = [
  {
    title: 'Not a medical device',
    items: [
      'Not FDA-cleared or CE-marked for diagnosis.',
      'Outputs are screening aids from a 2D convolutional model, not full neuroradiology reports.',
      'Must not be used as the sole basis for treatment, referral, or patient communication.',
    ],
  },
  {
    title: 'Model & data limitations',
    items: [
      'Single 224×224 ResNet18 slice — no 3D volume, no multi-sequence fusion.',
      'Performance depends on training data; sensitivity/specificity are not guaranteed on your site’s scanners.',
      'Grad-CAM shows attention regions, not verified lesion segmentation.',
      'DICOM support converts one slice to PNG — not a full series pipeline.',
    ],
  },
  {
    title: 'Privacy & storage',
    items: [
      'Images are sent to the analysis API for inference; the service does not retain them after processing.',
      'Guest history exists only for the current browser session. Members store studies in a private Supabase workspace.',
      'Use anonymous case IDs only — never real patient identifiers.',
    ],
  },
  {
    title: 'Operational limits',
    items: [
      'Free-tier hosting may sleep; first request after idle can take ~30 seconds.',
      'Multi-slice mode uses majority vote — not a validated ensemble method.',
      'Offline analysis is not available — a live API connection is required.',
    ],
  },
];
</script>
