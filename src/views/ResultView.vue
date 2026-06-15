<template>
  <main class="min-h-screen px-4 py-12">
    <div class="max-w-2xl mx-auto space-y-6">

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4">
        <div class="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p class="text-gray-400 text-sm">Cya sedang membaca CV kamu...</p>
      </div>

      <!-- Processing (paid, audit in progress) -->
      <div v-else-if="audit?.status === 'payment_verified' || audit?.status === 'processing'" class="flex flex-col items-center justify-center py-32 space-y-4">
        <div class="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p class="text-gray-400 text-sm">Pembayaran diterima. Audit sedang diproses...</p>
        <p class="text-xs text-gray-600">Halaman ini akan otomatis diperbarui.</p>
      </div>

      <!-- Failed audit -->
      <div v-else-if="audit?.status === 'failed'" class="text-center py-32 space-y-4 max-w-md mx-auto">
        <div class="text-4xl">⚠️</div>
        <h2 class="text-xl font-semibold text-red-400">Audit Gagal</h2>
        <p class="text-gray-400 text-sm leading-relaxed">
          {{ audit.failure_reason || 'Terjadi kesalahan saat memproses audit kamu.' }}
        </p>
        <RouterLink to="/audit" class="btn-primary inline-flex text-sm">
          Coba Lagi
        </RouterLink>
      </div>

      <!-- Fetch error -->
      <div v-else-if="fetchError" class="text-center py-32 space-y-3">
        <p class="text-red-400">{{ fetchError }}</p>
        <RouterLink to="/" class="text-sm text-brand-400 hover:underline">Kembali ke halaman utama</RouterLink>
      </div>

      <!-- Result -->
      <template v-else-if="audit?.result">
        <!-- Header -->
        <div class="text-center space-y-1 pb-4">
          <p class="text-xs text-gray-500 uppercase tracking-widest">Laporan Audit CV</p>
          <h1 class="text-2xl font-bold">Hasil Audit Kamu</h1>
          <p class="text-sm text-gray-400">Posisi: <span class="text-gray-200 font-medium">{{ audit.target_role }}</span> · {{ audit.experience_level }}</p>
        </div>

        <!-- Verdict -->
        <VerdictCard :verdict="result.recruiter_verdict" />

        <!-- First Impression -->
        <AuditSection title="Kesan Pertama" icon="👁️">
          <p class="text-gray-300 leading-relaxed">{{ result.first_impression }}</p>
        </AuditSection>

        <!-- Strengths -->
        <AuditSection title="Kekuatan" icon="✅">
          <ul class="space-y-2">
            <li v-for="(s, i) in result.strengths" :key="i" class="flex gap-3 text-gray-300 text-sm">
              <span class="text-emerald-400 shrink-0 mt-0.5">+</span>
              <span>{{ s }}</span>
            </li>
          </ul>
        </AuditSection>

        <!-- Weaknesses -->
        <AuditSection title="Kelemahan" icon="⚠️">
          <ul class="space-y-2">
            <li v-for="(w, i) in result.weaknesses" :key="i" class="flex gap-3 text-gray-300 text-sm">
              <span class="text-red-400 shrink-0 mt-0.5">−</span>
              <span>{{ w }}</span>
            </li>
          </ul>
        </AuditSection>

        <!-- Missing Opportunities -->
        <AuditSection title="Yang Bisa Ditambahkan" icon="💡">
          <ul class="space-y-2">
            <li v-for="(m, i) in result.missing_opportunities" :key="i" class="flex gap-3 text-gray-300 text-sm">
              <span class="text-amber-400 shrink-0 mt-0.5">→</span>
              <span>{{ m }}</span>
            </li>
          </ul>
        </AuditSection>

        <!-- ATS Review -->
        <AuditSection title="ATS Review" icon="🤖">
          <div class="space-y-3">
            <span
              class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
              :class="{
                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': result.ats_review.rating === 'Excellent',
                'bg-amber-500/10 text-amber-400 border border-amber-500/20': result.ats_review.rating === 'Good',
                'bg-red-500/10 text-red-400 border border-red-500/20': result.ats_review.rating === 'Needs Improvement',
              }"
            >
              {{ result.ats_review.rating }}
            </span>
            <p class="text-gray-300 text-sm leading-relaxed">{{ result.ats_review.reason }}</p>
          </div>
        </AuditSection>

        <!-- Action Plan -->
        <AuditSection title="Action Plan" icon="📋">
          <div class="space-y-5">
            <div v-if="result.action_plan.high_priority?.length">
              <p class="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Prioritas Tinggi</p>
              <ul class="space-y-2">
                <li v-for="(a, i) in result.action_plan.high_priority" :key="i" class="flex gap-3 text-sm text-gray-300">
                  <span class="text-red-400 shrink-0">🔴</span>
                  <span>{{ a }}</span>
                </li>
              </ul>
            </div>
            <div v-if="result.action_plan.medium_priority?.length">
              <p class="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Prioritas Sedang</p>
              <ul class="space-y-2">
                <li v-for="(a, i) in result.action_plan.medium_priority" :key="i" class="flex gap-3 text-sm text-gray-300">
                  <span class="text-amber-400 shrink-0">🟡</span>
                  <span>{{ a }}</span>
                </li>
              </ul>
            </div>
            <div v-if="result.action_plan.low_priority?.length">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Prioritas Rendah</p>
              <ul class="space-y-2">
                <li v-for="(a, i) in result.action_plan.low_priority" :key="i" class="flex gap-3 text-sm text-gray-300">
                  <span class="text-gray-500 shrink-0">⚪</span>
                  <span>{{ a }}</span>
                </li>
              </ul>
            </div>
          </div>
        </AuditSection>

        <!-- Footer -->
        <div class="text-center pt-4 pb-8 space-y-3">
          <p class="text-xs text-gray-600">Direview oleh Cya · Legacya Sphere</p>
          <RouterLink to="/audit" class="btn-primary inline-flex text-sm">
            Audit CV Lagi
          </RouterLink>
        </div>
      </template>

    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { supabase } from '@/lib/supabase'
import VerdictCard from '@/components/audit/VerdictCard.vue'
import AuditSection from '@/components/audit/AuditSection.vue'

const route = useRoute()
const audit = ref(null)
const loading = ref(true)
const fetchError = ref('')
let pollInterval = null

const result = computed(() => audit.value?.result)

async function fetchAudit() {
  const { data, error } = await supabase
    .from('audits')
    .select('status, target_role, experience_level, result, failure_reason')
    .eq('public_id', route.params.publicId)
    .single()

  if (error) {
    fetchError.value = 'Audit tidak ditemukan.'
    loading.value = false
    return
  }

  audit.value = data
  loading.value = false

  if (data.status === 'completed' || data.status === 'failed') {
    clearInterval(pollInterval)
  }
}

onMounted(() => {
  fetchAudit()
  pollInterval = setInterval(() => {
    if (audit.value?.status !== 'completed') {
      fetchAudit()
    }
  }, 4000)
})

onUnmounted(() => {
  clearInterval(pollInterval)
})
</script>
