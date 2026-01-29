<script setup>
defineProps({
  ranking: {
    type: String,
    required: true
  }
})
</script>

<template>
  <span
    class="px-2 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[9px] font-black uppercase tracking-tighter shadow-sm"
  >
    {{ ranking }}
  </span>
</template>
