<script setup>
import { Star } from 'lucide-vue-next'

defineProps({
  rating: {
    type: Number,
    default: 0
  },
  size: {
    type: String,
    default: 'w-4 h-4'
  }
})
</script>

<template>
  <div class="flex gap-0.5">
    <Star
      v-for="i in 5"
      :key="i"
      :class="[
        size,
        'transition-all',
        i <= Math.floor(rating)
          ? 'text-amber-400 fill-amber-400'
          : i - 0.5 <= rating
            ? 'text-amber-400 fill-amber-400 opacity-60'
            : 'opacity-10'
      ]"
    />
  </div>
</template>
