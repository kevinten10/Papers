<script setup>
import { ref, onErrorCaptured } from 'vue'
import { AlertTriangle, RefreshCw, Home } from 'lucide-vue-next'

defineProps({
  fallback: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['error', 'retry'])

const hasError = ref(false)
const error = ref(null)
const errorInfo = ref('')

onErrorCaptured((err, instance, info) => {
  hasError.value = true
  error.value = err
  errorInfo.value = info
  
  emit('error', { error: err, instance, info })
  
  // 阻止错误继续传播
  return false
})

const handleRetry = () => {
  hasError.value = false
  error.value = null
  errorInfo.value = ''
  emit('retry')
}

const handleGoHome = () => {
  window.location.href = '/'
}
</script>

<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
    <div class="max-w-md w-full text-center space-y-6">
      <!-- Error Icon -->
      <div class="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
        <AlertTriangle class="w-10 h-10 text-red-600 dark:text-red-400" />
      </div>
      
      <!-- Error Message -->
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
          出错了
        </h2>
        <p class="text-slate-600 dark:text-slate-400">
          抱歉，应用程序遇到了问题。请尝试刷新页面或返回首页。
        </p>
      </div>
      
      <!-- Error Details (Development Only) -->
      <div 
        v-if="error && import.meta.env.DEV" 
        class="text-left p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800"
      >
        <p class="text-sm font-mono text-red-700 dark:text-red-400 break-all">
          {{ error.message }}
        </p>
        <p v-if="errorInfo" class="text-xs text-red-600 dark:text-red-500 mt-2">
          {{ errorInfo }}
        </p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          @click="handleRetry"
        >
          <RefreshCw class="w-4 h-4" />
          重试
        </button>
        <button
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          @click="handleGoHome"
        >
          <Home class="w-4 h-4" />
          返回首页
        </button>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>
