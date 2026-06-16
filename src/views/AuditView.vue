<template>
  <main class="min-h-screen px-6 py-12">
    <div class="max-w-xl mx-auto space-y-8">

      <!-- Header -->
      <div class="text-center space-y-2">
        <RouterLink to="/" class="text-xs text-gray-500 hover:text-gray-400 transition-colors">← Kembali</RouterLink>
        <h1 class="text-2xl font-bold mt-3">Mulai Audit CV</h1>
        <p class="text-gray-400 text-sm">Cya akan membaca CV kamu seperti seorang recruiter Indonesia.</p>
      </div>

      <!-- Step indicator -->
      <div class="flex items-center gap-2">
        <div v-for="(s, i) in stepLabels" :key="i" class="flex items-center gap-2 flex-1">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            :class="i + 1 <= currentStep ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-500'"
          >
            {{ i + 1 }}
          </div>
          <span class="text-xs hidden sm:block" :class="i + 1 === currentStep ? 'text-gray-200' : 'text-gray-600'">{{ s }}</span>
          <div v-if="i < stepLabels.length - 1" class="flex-1 h-px bg-gray-800" />
        </div>
      </div>

      <!-- Step 1: Role Selection -->
      <div v-if="currentStep === 1" class="card space-y-6">
        <div>
          <h2 class="font-semibold mb-1">Posisi yang Dituju</h2>
          <p class="text-sm text-gray-400">Ketik posisi yang ingin kamu lamar.</p>
        </div>
        <div>
          <input
            v-model="form.targetRole"
            type="text"
            placeholder="Contoh: Frontend Developer, Admin, Operator Produksi..."
            class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <div>
          <h3 class="text-sm font-medium mb-3 text-gray-300">Level Pengalaman</h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="level in experienceLevels"
              :key="level"
              @click="form.experienceLevel = level"
              class="px-4 py-3 rounded-xl border text-sm font-medium transition-colors"
              :class="form.experienceLevel === level
                ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                : 'border-gray-700 text-gray-400 hover:border-gray-600'"
            >
              {{ level }}
            </button>
          </div>
        </div>
        <button
          @click="nextStep"
          :disabled="!form.targetRole || !form.experienceLevel"
          class="btn-primary w-full"
        >
          Lanjut →
        </button>
      </div>

      <!-- Step 2: CV Upload -->
      <div v-if="currentStep === 2" class="card space-y-6">
        <div>
          <h2 class="font-semibold mb-1">Upload CV</h2>
          <p class="text-sm text-gray-400">Format PDF. Maksimal 5MB.</p>
        </div>
        <div
          @dragover.prevent
          @drop.prevent="onDrop"
          @click="fileInput?.click()"
          class="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center cursor-pointer hover:border-brand-500/50 transition-colors"
          :class="{ 'border-brand-500 bg-brand-500/5': form.file }"
        >
          <input ref="fileInput" type="file" accept=".pdf" class="hidden" @change="onFileChange" />
          <div v-if="!form.file" class="space-y-2">
            <div class="text-3xl">📄</div>
            <p class="text-sm text-gray-400">Klik atau drag & drop CV kamu di sini</p>
            <p class="text-xs text-gray-600">PDF only · Max 5MB</p>
          </div>
          <div v-else class="space-y-1">
            <div class="text-3xl">✅</div>
            <p class="text-sm font-medium text-brand-400">{{ form.file.name }}</p>
            <p class="text-xs text-gray-500">{{ (form.file.size / 1024).toFixed(1) }} KB</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="currentStep--" class="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-sm text-gray-400 hover:border-gray-600 transition-colors">
            ← Kembali
          </button>
          <button @click="nextStep" :disabled="!form.file" class="btn-primary flex-1">
            Lanjut →
          </button>
        </div>
      </div>

      <!-- Step 3: Summary + Pay -->
      <div v-if="currentStep === 3" class="space-y-4">
        <div class="card space-y-4">
          <h2 class="font-semibold">Ringkasan Audit</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">Posisi</span>
              <span class="font-medium">{{ form.targetRole }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Level</span>
              <span class="font-medium">{{ form.experienceLevel }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">File</span>
              <span class="font-medium truncate ml-4">{{ form.file?.name }}</span>
            </div>
            <div class="border-t border-gray-800 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span class="text-brand-400">Rp10.000</span>
            </div>
          </div>
        </div>

        <!-- Pending payment state -->
        <div v-if="snapPending" class="card text-center space-y-3">
          <div class="text-2xl">⏳</div>
          <p class="font-semibold">Menunggu Konfirmasi Pembayaran</p>
          <p class="text-sm text-gray-400">Selesaikan pembayaran di aplikasi bank atau e-wallet kamu.</p>
          <RouterLink :to="`/result/${pendingPublicId}`" class="btn-primary block text-center">
            Lihat Status Audit →
          </RouterLink>
        </div>

        <template v-else>
          <p v-if="error" class="text-sm text-red-400 text-center">{{ error }}</p>

          <div class="flex gap-3">
            <button @click="currentStep--" class="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-sm text-gray-400 hover:border-gray-600 transition-colors">
              ← Kembali
            </button>
            <button @click="submitAudit" :disabled="isSubmitting" class="btn-primary flex-1">
              <span v-if="isSubmitting">Memproses...</span>
              <span v-else>Bayar & Audit — Rp10.000</span>
            </button>
          </div>
        </template>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()

const currentStep = ref(1)
const stepLabels = ['Posisi', 'Upload CV', 'Bayar']
const experienceLevels = ['Fresh Graduate', 'Junior', 'Mid-Level', 'Senior']

const form = reactive({
  targetRole: '',
  experienceLevel: '',
  file: null,
})

const fileInput = ref(null)
const isSubmitting = ref(false)
const error = ref('')
const snapPending = ref(false)
const pendingPublicId = ref('')

function nextStep() {
  if (currentStep.value < 3) currentStep.value++
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file && file.size <= 5 * 1024 * 1024) {
    form.file = file
  }
}

function onDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file?.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    form.file = file
  }
}

async function submitAudit() {
  isSubmitting.value = true
  error.value = ''
  try {
    const formData = new FormData()
    formData.append('target_role', form.targetRole)
    formData.append('experience_level', form.experienceLevel)
    formData.append('cv_file', form.file)

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-audit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Gagal membuat audit.')
    }

    const { public_id, snap_token } = await res.json()
    pendingPublicId.value = public_id

    window.snap.pay(snap_token, {
      onSuccess() {
        router.push({ name: 'result', params: { publicId: pendingPublicId.value } })
      },
      onPending() {
        snapPending.value = true
        isSubmitting.value = false
      },
      onError(result) {
        error.value = result?.status_message || 'Pembayaran gagal. Coba lagi.'
        isSubmitting.value = false
      },
      onClose() {
        isSubmitting.value = false
      },
    })
  } catch (e) {
    error.value = e.message
    isSubmitting.value = false
  }
}
</script>
