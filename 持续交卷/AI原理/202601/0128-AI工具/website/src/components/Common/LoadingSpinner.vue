<script setup>
import { Loader2 } from 'lucide-vue-next'

defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  text: {
    type: String,
    default: '加载中...'
  },
  showText: {
    type: Boolean,
    default: true
  }
})

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const textClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg'
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <Loader2
      :class="[
        sizeClasses[size],
        'animate-spin text-blue-600'
      ]"
    />
    <span
      v-if="showText"
      :class="[
        textClasses[size],
        'text-slate-500 font-medium'
      ]"
    >
      {{ text }}
    </span>
  </div>
</template>
