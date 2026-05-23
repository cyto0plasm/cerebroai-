<template>
  <section class="relative overflow-hidden bg-surface-50 border-b border-surface-200">
    <!-- Subtle scan-grid background -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-[0.35]"
      style="background-image: radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0); background-size: 28px 28px;"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-24 right-0 w-[520px] h-[520px] rounded-full bg-brand-100/40 blur-3xl"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute bottom-0 left-0 w-72 h-72 rounded-full bg-teal-100/30 blur-3xl"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-surface-300 to-transparent"
    />

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-16 lg:pb-20">
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
      >

        <!-- Left: message -->
        <div class="flex flex-col gap-6 max-w-xl">

          <!-- Logo lockup -->
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-surface-900 flex items-center justify-center shrink-0 shadow-card"
              aria-hidden="true"
            >
              <svg viewBox="0 0 40 40" class="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="14" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.7" />
                <circle cx="20" cy="20" r="9" stroke="#e2e8f0" stroke-width="1.5" />
                <path
                  d="M20 11c-3.2 2.8-4.8 6.2-4.8 10.2 0 2.6 1 5 2.6 6.8M20 11c3.2 2.8 4.8 6.2 4.8 10.2 0 2.6-1 5-2.6 6.8"
                  stroke="#94a3b8"
                  stroke-width="1.25"
                  stroke-linecap="round"
                />
                <circle cx="20" cy="20" r="2" fill="#38bdf8" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold text-surface-900 tracking-tight leading-none">CerebroAI</p>
              <p class="text-[11px] text-surface-500 mt-0.5">Brain MRI tumor screening</p>
            </div>
          </div>

          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-surface-200 text-surface-600 text-xs font-medium w-fit shadow-card">
            <ScanLine class="w-3.5 h-3.5 text-brand-600" />
            Research &amp; education · Not for clinical diagnosis
          </div>

          <div class="flex flex-col gap-4">
            <h1 class="text-4xl sm:text-[2.75rem] font-bold text-surface-900 leading-[1.12] tracking-tight">
              Upload a brain MRI slice.<br />
              <span class="text-surface-600">Get a clear screening result.</span>
            </h1>

            <p class="text-surface-500 text-base sm:text-[1.05rem] leading-relaxed">
              A ResNet18 classifier analyzes your image and returns a tumor / no-tumor prediction,
              confidence score, and an activation heatmap. Scan history stays in your browser — only
              the image you submit is sent for analysis.
            </p>
          </div>

          <!-- Workflow steps -->
          <ol class="flex flex-col sm:flex-row sm:items-stretch gap-2 sm:gap-0">
            <li
              v-for="(step, i) in steps"
              :key="step.label"
              class="flex items-center gap-2 sm:flex-1 sm:flex-col sm:items-start sm:gap-1.5 px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-none sm:first:rounded-l-lg sm:last:rounded-r-lg bg-white border border-surface-200 sm:border-r-0 sm:last:border-r"
            >
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold shrink-0">
                {{ i + 1 }}
              </span>
              <div>
                <p class="text-xs font-semibold text-surface-800">{{ step.label }}</p>
                <p class="text-[11px] text-surface-400 hidden sm:block">{{ step.hint }}</p>
              </div>
            </li>
          </ol>

          <!-- CTAs -->
          <div class="flex flex-wrap gap-3 pt-1">
            <router-link to="/dashboard">
              <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-card focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                Analyze a scan
                <ArrowRight class="w-4 h-4" />
              </button>
            </router-link>
            <a href="#how-it-works">
              <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-surface-700 text-sm font-semibold rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors focus:outline-none focus:ring-2 focus:ring-surface-300 focus:ring-offset-2">
                How it works
              </button>
            </a>
          </div>

          <!-- Honest trust row -->
          <ul class="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 pt-1 text-xs text-surface-500">
            <li v-for="item in trustPoints" :key="item" class="flex items-center gap-1.5">
              <Check class="w-3.5 h-3.5 text-success-600 shrink-0" />
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Right: example output card -->
        <div class="flex justify-center lg:justify-end">
          <div class="w-full max-w-[380px]">
            <p class="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-3 text-center lg:text-right">
              Example output
            </p>

            <div class="bg-white rounded-2xl border border-surface-200 shadow-card-lg overflow-hidden">
              <!-- Card header -->
              <div class="px-5 py-3.5 border-b border-surface-100 flex items-center justify-between bg-surface-50/80">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-semibold text-surface-900">Analysis report</p>
                </div>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                  Demo only
                </span>
              </div>

              <!-- Scan preview -->
              <div class="relative h-48 bg-surface-900 overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center">
                  <!-- Stylized axial slice -->
                  <svg viewBox="0 0 200 200" class="w-40 h-40 opacity-90" aria-hidden="true">
                    <defs>
                      <radialGradient id="brainFill" cx="50%" cy="45%" r="55%">
                        <stop offset="0%" stop-color="#64748b" />
                        <stop offset="100%" stop-color="#1e293b" />
                      </radialGradient>
                    </defs>
                    <ellipse cx="100" cy="100" rx="72" ry="68" fill="url(#brainFill)" />
                    <ellipse cx="100" cy="100" rx="72" ry="68" fill="none" stroke="#475569" stroke-width="1" />
                    <path d="M100 32c-18 14-28 32-28 52 0 12 4 24 10 34" stroke="#94a3b8" stroke-width="1.5" fill="none" stroke-linecap="round" />
                    <path d="M100 32c18 14 28 32 28 52 0 12-4 24-10 34" stroke="#94a3b8" stroke-width="1.5" fill="none" stroke-linecap="round" />
                    <!-- Heatmap hotspot -->
                    <circle cx="128" cy="88" r="18" fill="#ef4444" opacity="0.35" />
                    <circle cx="128" cy="88" r="10" fill="#f97316" opacity="0.5" />
                  </svg>
                </div>

                <!-- Scan lines overlay -->
                <div
                  class="absolute inset-0 opacity-[0.08]"
                  style="background: repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px);"
                />

                <div class="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-900/75 backdrop-blur-sm border border-surface-700/50">
                  <Layers class="w-3 h-3 text-sky-400" />
                  <span class="text-[10px] text-surface-300 font-medium">Grad-CAM overlay</span>
                </div>

                <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span class="text-[10px] text-surface-400 bg-surface-900/80 px-2 py-0.5 rounded font-mono truncate">
                    mri_axial_demo.png
                  </span>
                  <span class="text-[10px] text-sky-300 bg-surface-900/80 px-2 py-0.5 rounded font-mono shrink-0">
                    224 × 224
                  </span>
                </div>
              </div>

              <!-- Result body -->
              <div class="p-5 flex flex-col gap-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-lg bg-danger-50 flex items-center justify-center shrink-0">
                      <AlertTriangle class="w-4 h-4 text-danger-600" />
                    </div>
                    <div>
                      <p class="text-[11px] font-medium text-danger-500 uppercase tracking-wide">Prediction</p>
                      <p class="text-base font-bold text-surface-900">Tumor detected</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-danger-600 leading-none">87%</p>
                    <p class="text-[10px] text-surface-400 mt-0.5">confidence</p>
                  </div>
                </div>

                <div>
                  <div class="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                    <div class="h-full bg-danger-500 rounded-full" style="width: 87%"></div>
                  </div>
                </div>

                <div class="rounded-lg border border-surface-100 bg-surface-50 px-3.5 py-3">
                  <p class="text-[11px] font-semibold text-surface-500 uppercase tracking-wide mb-1">Summary</p>
                  <p class="text-xs text-surface-600 leading-relaxed">
                    Model flagged a region of interest in the scan. Review the heatmap and treat this as
                    a screening aid — not a medical diagnosis.
                  </p>
                </div>

                <p class="text-[10px] text-surface-400 leading-relaxed border-t border-surface-100 pt-3">
                  Illustrative example. Your actual result depends on the image you upload.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ArrowRight, Check, AlertTriangle, ScanLine, Layers } from 'lucide-vue-next';

const steps = [
  { label: 'Upload', hint: 'JPEG, PNG, TIFF, BMP' },
  { label: 'Analyze', hint: 'CNN + heatmap' },
  { label: 'Review', hint: 'Saved in browser' },
];

const trustPoints = [
  'JPEG · PNG · TIFF · BMP · up to 10 MB',
  'History saved locally in this browser',
  'First request may take ~30s while server wakes',
];
</script>
