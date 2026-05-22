<template>
  <section class="bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-0">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">

        <!-- Left -->
        <div class="flex flex-col gap-5 pb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold w-fit">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
            AI-Powered · Runs locally · No data sent
          </div>

          <h1 class="text-4xl sm:text-5xl font-bold text-surface-900 leading-[1.15] tracking-tight">
            Brain MRI<br />
            Tumor Detection
          </h1>

          <p class="text-surface-500 text-base leading-relaxed max-w-md">
            Upload an MRI scan and get an instant AI prediction. Private, fast, and runs entirely on your machine.
          </p>

          <div class="flex gap-3 pt-1">
            <router-link to="/dashboard">
              <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
                Try it now
                <ArrowRight class="w-4 h-4" />
              </button>
            </router-link>
            <a href="#how-it-works">
              <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-surface-700 text-sm font-semibold rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors">
                How it works
              </button>
            </a>
          </div>

          <!-- Trust row -->
          <div class="flex flex-wrap gap-5 pt-3 text-xs text-surface-400">
            <span class="flex items-center gap-1.5"><Check class="w-3.5 h-3.5 text-success-500" /> No cloud upload</span>
            <span class="flex items-center gap-1.5"><Check class="w-3.5 h-3.5 text-success-500" /> Under 1 second</span>
            <span class="flex items-center gap-1.5"><Check class="w-3.5 h-3.5 text-success-500" /> PyTorch CNN</span>
          </div>
        </div>

        <!-- Right: mock UI card sitting on the fold -->
        <div class="flex justify-center lg:justify-end pb-0">
          <div class="w-full max-w-[360px] bg-white rounded-t-2xl border border-b-0 border-surface-200 shadow-card-lg overflow-hidden">
            <!-- Card header -->
            <div class="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-danger-50 flex items-center justify-center">
                  <AlertTriangle class="w-3.5 h-3.5 text-danger-500" />
                </div>
                <span class="text-sm font-semibold text-surface-900">Analysis Result</span>
              </div>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-danger-50 text-danger-600">
                <span class="w-1.5 h-1.5 rounded-full bg-danger-500"></span>
                Positive
              </span>
            </div>

            <!-- MRI image area -->
            <div class="relative h-44 bg-surface-900 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-surface-800 to-surface-950 flex items-center justify-center">
                <Brain class="w-16 h-16 text-surface-600 opacity-40" />
              </div>
              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span class="text-[10px] text-surface-400 bg-surface-900/80 px-2 py-0.5 rounded font-mono">patient_mri_t2.png</span>
                <span class="text-[10px] text-success-400 bg-surface-900/80 px-2 py-0.5 rounded font-mono">Processed</span>
              </div>
            </div>

            <!-- Result -->
            <div class="p-5 flex flex-col gap-4">
              <div>
                <p class="text-xs text-surface-400 mb-1">Tumor detected</p>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-sm font-semibold text-surface-900">Confidence</span>
                  <span class="text-sm font-bold text-danger-600">94%</span>
                </div>
                <div class="h-2 bg-surface-100 rounded-full overflow-hidden">
                  <div class="h-full bg-danger-500 rounded-full" style="width:94%"></div>
                </div>
              </div>
              <div class="bg-danger-50 border border-danger-100 rounded-lg p-3 text-xs text-danger-600 leading-relaxed">
                Immediate neurosurgical consultation recommended.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ArrowRight, Check, Brain, AlertTriangle } from 'lucide-vue-next';
</script>
