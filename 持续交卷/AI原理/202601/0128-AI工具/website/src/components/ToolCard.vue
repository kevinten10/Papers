<script setup>
import { ref } from 'vue'
import {
  ArrowRightLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Activity,
  ChevronDown,
  Info
} from 'lucide-vue-next'
import StarRating from './Common/StarRating.vue'
import FunTag from './Common/FunTag.vue'
import { getCategoryIcon } from '../utils/icons'

defineProps({
  tool: {
    type: Object,
    required: true
  },
  isDarkMode: {
    type: Boolean,
    default: false
  },
  isCompared: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-compare'])

const activeSwot = ref(false)
</script>

<template>
  <div
    :class="[
      'group rounded-[40px] p-10 border transition-all duration-700 hover:-translate-y-3 flex flex-col h-full relative overflow-hidden',
      tool.used === false
        ? isDarkMode
          ? 'bg-slate-900/50 border-white/10 hover:border-amber-500/40 opacity-85'
          : 'bg-slate-100 border-slate-300 hover:border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.02)]'
        : isDarkMode
          ? 'bg-slate-800/30 border-white/5 hover:border-blue-500/40'
          : 'bg-white border-slate-200 hover:border-blue-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(59,130,246,0.1)]'
    ]"
  >
    <div
      class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent blur-2xl"
    ></div>

    <div class="flex justify-between items-start mb-10 relative z-10">
      <div class="flex items-center gap-6">
        <div
          :class="[
            'w-16 h-16 rounded-[24px] flex items-center justify-center border transition-all group-hover:rotate-6 duration-500',
            tool.used === false
              ? isDarkMode
                ? 'bg-slate-700/50 border-slate-600/50 group-hover:bg-amber-500/20'
                : 'bg-slate-200 border-slate-300 group-hover:bg-amber-100'
              : isDarkMode
                ? 'bg-white/5 border-white/10 group-hover:bg-blue-500/20'
                : 'bg-blue-50 border-blue-100 group-hover:bg-blue-100 group-hover:shadow-lg shadow-blue-500/10'
          ]"
        >
          <component :is="getCategoryIcon(tool.category)" :class="['w-8 h-8', tool.used === false ? 'text-slate-500' : 'text-blue-600']" />
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <h3
              :class="['font-black text-2xl tracking-tighter transition-colors', tool.used === false ? 'group-hover:text-amber-600' : 'group-hover:text-blue-600']"
            >
              {{ tool.name }}
            </h3>
            <FunTag v-if="tool.fun_ranking" :ranking="tool.fun_ranking" />
            <span
              v-if="tool.used === false"
              :class="[
                'px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter flex items-center gap-1',
                isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
              ]"
            >
              <Info class="w-3 h-3" />
              未体验
            </span>
          </div>
          <p class="text-[10px] opacity-40 font-black uppercase tracking-[0.3em]">
            {{ tool.developer }}
          </p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-3">
        <div class="flex gap-1">
          <span
            v-for="v in tool.versions"
            :key="v.type"
            :class="[
              'px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter',
              v.type === 'CN'
                ? 'bg-emerald-500/10 text-emerald-600'
                : 'bg-blue-500/10 text-blue-600'
            ]"
          >
            {{ v.type }}
          </span>
        </div>
        <StarRating :rating="tool.personal_experience?.rating" />
      </div>
    </div>

    <div
      class="space-y-6 flex-grow relative z-10 overflow-hidden group-hover:overflow-y-auto max-h-[450px] pr-2 custom-scrollbar transition-all duration-500"
    >
      <div class="relative">
        <p class="text-base opacity-70 leading-relaxed font-medium">
          {{ tool.personal_experience?.insights }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 opacity-80 group-hover:opacity-100 transition-opacity">
        <div class="space-y-2">
          <div
            class="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 tracking-widest"
          >
            <CheckCircle2 class="w-3 h-3" /> 优势 (Pros)
          </div>
          <ul class="space-y-1">
            <li
              v-for="pro in tool.pros"
              :key="pro"
              class="text-xs font-bold opacity-60 flex items-start gap-2"
            >
              <span class="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              {{ pro }}
            </li>
          </ul>
        </div>
        <div v-if="tool.cons && tool.cons.length" class="space-y-2">
          <div
            class="flex items-center gap-2 text-[10px] font-black uppercase text-rose-500 tracking-widest"
          >
            <AlertCircle class="w-3 h-3" /> 劣势 (Cons)
          </div>
          <ul class="space-y-1">
            <li
              v-for="con in tool.cons"
              :key="con"
              class="text-xs font-bold opacity-60 flex items-start gap-2"
            >
              <span class="w-1 h-1 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
              {{ con }}
            </li>
          </ul>
        </div>
      </div>

      <div class="relative z-10">
        <button
          class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all mb-4"
          @click="activeSwot = !activeSwot"
        >
          <Activity class="w-3 h-3" /> SWOT 分析
          <ChevronDown :class="['w-3 h-3 transition-transform', activeSwot ? 'rotate-180' : '']" />
        </button>
        <div
          v-if="activeSwot"
          class="grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-300"
        >
          <div
            v-for="(val, key) in tool.swot"
            :key="key"
            class="p-3 rounded-xl bg-slate-500/5 border border-slate-200/10"
          >
            <span class="text-[9px] font-black text-blue-600 mr-2">{{ key }}</span>
            <p class="text-[9px] opacity-60 leading-tight">{{ val }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <div
          :class="[
            'p-5 rounded-[24px] border transition-colors',
            isDarkMode
              ? 'bg-white/5 border-white/5'
              : 'bg-slate-50 border-slate-100 group-hover:bg-blue-50/30 group-hover:border-blue-100'
          ]"
        >
          <div class="flex items-start gap-4">
            <CheckCircle2 class="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            <p class="text-sm font-black leading-snug italic opacity-80">{{ tool.best_for }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3">
          <div
            v-for="v in tool.versions"
            :key="v.type"
            class="flex justify-between items-center px-4 py-2 rounded-xl bg-slate-500/5 border border-slate-200/10"
          >
            <span class="text-[10px] font-black opacity-40">{{ v.type }} 版本</span>
            <span class="text-[10px] font-bold text-blue-600">{{ v.pricing }}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2.5 pt-2">
          <span
            v-for="tag in tool.tags"
            :key="tag"
            :class="[
              'px-4 py-2 rounded-2xl text-[10px] font-black tracking-wider shadow-sm transition-all group-hover:scale-105',
              isDarkMode
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'bg-white text-blue-600 border border-blue-100'
            ]"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-white/5 relative z-10"
    >
      <button
        :class="[
          'flex items-center gap-2.5 px-6 py-3 rounded-[18px] text-xs font-black transition-all active:scale-95',
          isCompared
            ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-500/10'
            : isDarkMode
              ? 'bg-white/5 hover:bg-white/10 text-white/80'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
        ]"
        @click="$emit('toggle-compare', tool)"
      >
        <ArrowRightLeft class="w-4 h-4" />
        {{ isCompared ? '已就绪' : '加入对比' }}
      </button>
      <a
        :href="tool.versions[0]?.link"
        target="_blank"
        class="group/link flex items-center gap-2 text-xs font-black text-blue-600 hover:translate-x-1 transition-transform"
      >
        立即访问
        <ArrowUpRight
          class="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform"
        />
      </a>
    </div>
  </div>
</template>
