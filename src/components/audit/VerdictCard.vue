<template>
  <div class="card text-center space-y-3">
    <p class="text-xs text-gray-500 uppercase tracking-widest">Keputusan Recruiter</p>
    <div class="flex justify-center">
      <span :class="badgeClass" class="text-lg font-bold px-6 py-2 rounded-full">
        {{ icon }} {{ label }}
      </span>
    </div>
    <p class="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">{{ verdict.reason }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  verdict: {
    type: Object,
    required: true,
  },
})

const verdictMap = {
  Interview: { icon: '🟢', label: 'Interview', badge: 'badge-interview' },
  Consider:  { icon: '🟡', label: 'Pertimbangkan', badge: 'badge-consider' },
  Reject:    { icon: '🔴', label: 'Ditolak', badge: 'badge-reject' },
}

const current = computed(() => verdictMap[props.verdict.verdict] ?? verdictMap.Consider)
const icon = computed(() => current.value.icon)
const label = computed(() => current.value.label)
const badgeClass = computed(() => current.value.badge)
</script>
