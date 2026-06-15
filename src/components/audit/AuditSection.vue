<template>
  <div class="card space-y-4">
    <div class="flex items-center gap-2">
      <span class="text-lg">{{ icon }}</span>
      <h2 class="font-semibold text-gray-100">{{ title }}</h2>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  icon:  { type: String, default: '📌' },
})
</script>
