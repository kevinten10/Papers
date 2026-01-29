<script setup>
defineProps({
  lines: {
    type: Number,
    default: 3
  }
})
</script>

<template>
  <div class="rounded-[40px] p-10 border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-800/30 animate-pulse">
    <!-- Header Skeleton -->
    <div class="flex items-center gap-6 mb-10">
      <div class="w-16 h-16 rounded-[24px] bg-slate-200 dark:bg-slate-700"></div>
      <div class="flex-1 space-y-2">
        <div class="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div class="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    </div>
    
    <!-- Content Skeleton -->
    <div class="space-y-4">
      <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
      <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
    </div>
    
    <!-- Tags Skeleton -->
    <div class="flex flex-wrap gap-2 mt-8">
      <div v-for="i in 3" :key="i" class="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
    </div>
    
    <!-- Footer Skeleton -->
    <div class="flex items-center justify-between pt-8 mt-8 border-t border-slate-100 dark:border-white/5">
      <div class="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-[18px]"></div>
      <div class="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </div>
  </div>
</template>
