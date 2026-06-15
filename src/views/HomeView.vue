<template>
  <main class="min-h-screen flex flex-col">
    <!-- Nav -->
    <nav class="px-6 py-4 flex items-center justify-between border-b border-gray-800">
      <span class="text-lg font-bold tracking-tight">Cya<span class="text-brand-400">.</span></span>
      <span class="text-xs text-gray-500">by Legacya Sphere</span>
    </nav>

    <!-- Hero -->
    <section class="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
      <div class="max-w-2xl mx-auto space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-4">
          AI Career Auditor
        </div>

        <h1 class="text-4xl md:text-5xl font-bold leading-tight">
          Dapatkan Feedback CV<br />
          <span class="text-brand-400">Sebelum Recruiter Melihatnya</span>
        </h1>

        <p class="text-lg text-gray-400 max-w-xl mx-auto">
          Upload CV Anda. Temui Cya. Tingkatkan peluang interview Anda dalam hitungan menit.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <RouterLink to="/audit" class="btn-primary text-base px-8 py-4">
            Audit CV Saya — Rp1.000
          </RouterLink>
        </div>

        <p class="text-sm text-gray-600">
          Feedback jujur. Perspektif recruiter Indonesia. Tanpa basa-basi.
        </p>
      </div>
    </section>

    <!-- How it works -->
    <section class="px-6 py-16 border-t border-gray-800">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-xl font-semibold text-center mb-10 text-gray-300">Bagaimana Cara Kerjanya</h2>
        <div class="grid sm:grid-cols-4 gap-6 text-center">
          <div v-for="step in steps" :key="step.number" class="space-y-3">
            <div class="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold mx-auto">
              {{ step.number }}
            </div>
            <p class="font-medium text-sm text-gray-200">{{ step.title }}</p>
            <p class="text-xs text-gray-500">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-6 py-6 border-t border-gray-800 text-center text-xs text-gray-600">
      © 2026 Legacya Sphere · Direview oleh Cya
    </footer>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const steps = [
  { number: '1', title: 'Pilih Target Posisi', desc: 'Beritahu Cya posisi yang ingin kamu lamar.' },
  { number: '2', title: 'Upload CV', desc: 'Upload file PDF CV kamu.' },
  { number: '3', title: 'Bayar Rp1.000', desc: 'Pembayaran aman via Xendit.' },
  { number: '4', title: 'Terima Audit', desc: 'Feedback lengkap dari perspektif recruiter.' },
]
</script>
