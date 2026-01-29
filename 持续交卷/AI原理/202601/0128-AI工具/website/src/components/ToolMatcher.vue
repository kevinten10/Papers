<script setup>
import {
  Zap,
  ChevronRight,
  Terminal,
  Globe,
  Layers,
  Activity,
  DollarSign,
  Star,
  ShieldCheck,
  ArrowRightLeft,
  CheckCircle2,
  ArrowUpRight,
  Monitor
} from 'lucide-vue-next'
import { getCategoryIcon } from '../utils/icons'

defineProps({
  matcherStep: {
    type: Number,
    required: true
  },
  matcherAnswers: {
    type: Object,
    required: true
  },
  matchResult: {
    type: Array,
    default: () => []
  },
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:matcherStep', 'update:matcherAnswers', 'reset'])
</script>

<template>
  <section class="max-w-4xl mx-auto py-12 animate-in zoom-in-95 duration-700">
    <div
      :class="[
        'rounded-[64px] p-16 border relative overflow-hidden transition-all shadow-4xl',
        isDarkMode
          ? 'bg-slate-800/40 border-white/5 shadow-none'
          : 'bg-white border-slate-200 shadow-[0_50px_100px_rgba(0,0,0,0.05)] shadow-slate-200/50'
      ]"
    >
      <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 via-emerald-500/5 to-transparent blur-[150px] -mr-64 -mt-64"
      ></div>

      <div v-if="matcherStep === 0" class="space-y-12 relative z-10 text-center py-16">
        <div
          class="w-32 h-32 rounded-[40px] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-3xl shadow-blue-600/30 mx-auto mb-16 animate-bounce duration-[2000ms]"
        >
          <Zap class="w-16 h-16 text-white fill-white" />
        </div>
        <div class="space-y-8">
          <h2 class="text-7xl font-black leading-tight tracking-tighter">
            定制您的
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
              >AI 生产力方案</span
            >
          </h2>
          <p class="text-2xl opacity-60 max-w-3xl mx-auto font-medium leading-relaxed">
            只需 4 分钟，为您匹配覆盖全球与国内最优链路的 AI 工具组合。
          </p>
        </div>
        <button
          class="group flex items-center gap-6 bg-blue-600 px-12 py-6 rounded-[32px] font-black text-2xl text-white hover:scale-105 transition-all shadow-2xl shadow-blue-600/40 mx-auto active:scale-95"
          @click="$emit('update:matcherStep', 1)"
        >
          开启智能匹配
          <ChevronRight class="w-8 h-8 group-hover:translate-x-3 transition-transform" />
        </button>
      </div>

      <!-- Matcher Steps -->
      <div
        v-else-if="matcherStep >= 1 && matcherStep <= 4"
        class="space-y-12 animate-in fade-in slide-in-from-right-20 duration-500"
      >
        <div class="flex justify-between items-center">
          <span class="text-sm font-black text-blue-600 uppercase tracking-[0.4em]"
            >Step 0{{ matcherStep }} / 04</span
          >
          <div class="flex gap-3">
            <div
              v-for="i in 4"
              :key="i"
              :class="[
                'w-12 h-2 rounded-full transition-all duration-500',
                i <= matcherStep
                  ? 'bg-blue-600 shadow-sm shadow-blue-600/50'
                  : 'bg-slate-200 dark:bg-white/10'
              ]"
            ></div>
          </div>
        </div>

        <div v-if="matcherStep === 1">
          <h3 class="text-5xl font-black mb-12 tracking-tight">您主要希望 AI 帮您做什么？</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              v-for="opt in [
                {
                  id: 'coding',
                  title: '核心代码开发',
                  desc: '深度编程、系统架构、跨文件重构',
                  icon: Terminal
                },
                {
                  id: 'research',
                  title: '深度调研与总结',
                  desc: '文档阅读、实时搜索、技术选型',
                  icon: Globe
                },
                {
                  id: 'creative',
                  title: '全媒体内容创作',
                  desc: '视频生成、3D 建模、UI 设计',
                  icon: Layers
                },
                {
                  id: 'daily',
                  title: '极致办公自动化',
                  desc: '报告生成、表格处理、工作流编排',
                  icon: Zap
                },
                {
                  id: 'desktop',
                  title: '桌面 AI 助手',
                  desc: '本地文件处理、桌面自动化、日常辅助',
                  icon: Monitor
                }
              ]"
              :key="opt.id"
              :class="[
                'p-10 text-left rounded-[40px] border transition-all group relative overflow-hidden',
                isDarkMode
                  ? 'bg-white/5 border-white/5 hover:border-blue-500/50'
                  : 'bg-slate-50 border-slate-100 hover:border-blue-500/30 hover:bg-white shadow-sm hover:shadow-2xl shadow-slate-200/20'
              ]"
              @click="$emit('update:matcherAnswers', { ...matcherAnswers, purpose: opt.id }); $emit('update:matcherStep', 2)"
            >
              <div
                :class="[
                  'w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6',
                  isDarkMode
                    ? 'bg-white/5 group-hover:bg-blue-500/20'
                    : 'bg-white group-hover:bg-blue-50 shadow-inner'
                ]"
              >
                <component
                  :is="opt.icon"
                  class="w-8 h-8 group-hover:text-blue-600 transition-colors"
                />
              </div>
              <h4
                class="font-black text-2xl mb-3 group-hover:text-blue-600 transition-colors tracking-tight"
              >
                {{ opt.title }}
              </h4>
              <p class="text-sm opacity-50 font-bold leading-relaxed">{{ opt.desc }}</p>
            </button>
          </div>
        </div>

        <div v-if="matcherStep === 2">
          <h3 class="text-5xl font-black mb-12 tracking-tight">您的项目规模如何？</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              v-for="opt in [
                {
                  id: 'large',
                  title: '中大型存量仓库',
                  desc: '需要读懂复杂业务逻辑、跨文件关联',
                  icon: Activity
                },
                {
                  id: 'fast',
                  title: '快速原型/MVP',
                  desc: '从零开始、追求 48h 快速上线',
                  icon: Zap
                }
              ]"
              :key="opt.id"
              :class="[
                'p-10 text-left rounded-[40px] border transition-all group relative overflow-hidden',
                isDarkMode
                  ? 'bg-white/5 border-white/5 hover:border-blue-500/50'
                  : 'bg-slate-50 border-slate-100 hover:border-blue-500/30 hover:bg-white shadow-sm hover:shadow-2xl shadow-slate-200/20'
              ]"
              @click="$emit('update:matcherAnswers', { ...matcherAnswers, scale: opt.id }); $emit('update:matcherStep', 3)"
            >
              <div
                :class="[
                  'w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110',
                  isDarkMode
                    ? 'bg-white/5 group-hover:bg-blue-500/20'
                    : 'bg-white group-hover:bg-blue-50 shadow-inner'
                ]"
              >
                <component
                  :is="opt.icon"
                  class="w-8 h-8 group-hover:text-blue-600 transition-colors"
                />
              </div>
              <h4
                class="font-black text-2xl mb-3 group-hover:text-blue-600 transition-colors tracking-tight"
              >
                {{ opt.title }}
              </h4>
              <p class="text-sm opacity-50 font-bold leading-relaxed">{{ opt.desc }}</p>
            </button>
          </div>
        </div>

        <div v-if="matcherStep === 3">
          <h3 class="text-5xl font-black mb-12 tracking-tight">您的预算情况如何？</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button
              v-for="opt in [
                { id: 'free', title: '极致性价比', price: '￥0', icon: Zap },
                { id: 'pro', title: '专业生产力', price: '≈ ￥150', icon: DollarSign },
                { id: 'unlimited', title: '顶级性能流', price: '不设上限', icon: Star }
              ]"
              :key="opt.id"
              :class="[
                'p-10 text-center rounded-[40px] border transition-all group',
                isDarkMode
                  ? 'bg-white/5 border-white/5 hover:border-blue-500/50'
                  : 'bg-slate-50 border-slate-100 hover:border-blue-500/30 hover:bg-white shadow-sm hover:shadow-2xl shadow-slate-200/20'
              ]"
              @click="$emit('update:matcherAnswers', { ...matcherAnswers, budget: opt.id }); $emit('update:matcherStep', 4)"
            >
              <div
                :class="[
                  'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-500 group-hover:scale-110',
                  isDarkMode
                    ? 'bg-white/5 group-hover:bg-blue-500/20'
                    : 'bg-white group-hover:bg-blue-50 shadow-inner shadow-slate-100'
                ]"
              >
                <component
                  :is="opt.icon"
                  class="w-10 h-10 group-hover:text-blue-600 transition-colors"
                />
              </div>
              <h4 class="font-black text-2xl mb-2 group-hover:text-blue-600 transition-colors">
                {{ opt.title }}
              </h4>
              <p class="text-lg font-black text-emerald-600">{{ opt.price }}</p>
            </button>
          </div>
        </div>

        <div v-if="matcherStep === 4">
          <h3 class="text-5xl font-black mb-12 tracking-tight">您的首选使用环境？</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              v-for="opt in [
                {
                  id: 'cn',
                  title: '国内环境 (CN)',
                  desc: '响应极快、无需网络魔法、深度懂中文',
                  icon: ShieldCheck
                },
                {
                  id: 'global',
                  title: '全球环境 (Global)',
                  desc: '追求最前沿模型、全球技术生态集成',
                  icon: Globe
                }
              ]"
              :key="opt.id"
              :class="[
                'p-12 text-left rounded-[48px] border transition-all group',
                isDarkMode
                  ? 'bg-white/5 border-white/5 hover:border-blue-500/50'
                  : 'bg-slate-50 border-slate-100 hover:border-blue-500/30 hover:bg-white shadow-sm hover:shadow-2xl shadow-slate-200/20'
              ]"
              @click="$emit('update:matcherAnswers', { ...matcherAnswers, region: opt.id }); $emit('update:matcherStep', 5)"
            >
              <div
                :class="[
                  'w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110',
                  isDarkMode
                    ? 'bg-white/5 group-hover:bg-blue-500/20'
                    : 'bg-white group-hover:bg-blue-50 shadow-inner'
                ]"
              >
                <component
                  :is="opt.icon"
                  class="w-8 h-8 group-hover:text-blue-600 transition-colors"
                />
              </div>
              <h4
                class="font-black text-3xl mb-4 group-hover:text-blue-600 transition-colors tracking-tighter"
              >
                {{ opt.title }}
              </h4>
              <p class="text-base opacity-50 font-bold leading-relaxed">{{ opt.desc }}</p>
            </button>
          </div>
        </div>

        <button
          class="flex items-center gap-3 text-sm font-black opacity-40 hover:opacity-100 transition-all hover:-translate-x-2"
          @click="$emit('update:matcherStep', matcherStep - 1)"
        >
          <ArrowRightLeft class="w-5 h-5 rotate-180" /> 返回上一步
        </button>
      </div>

      <div
        v-else-if="matcherStep === 5"
        class="space-y-16 animate-in zoom-in-95 duration-1000 relative z-10"
      >
        <div class="text-center space-y-6">
          <div
            class="inline-flex items-center gap-4 px-5 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-black uppercase tracking-[0.3em] mb-4 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/5"
          >
            <CheckCircle2 class="w-5 h-5" /> 选型报告生成完毕
          </div>
          <h3 class="text-7xl font-black tracking-tighter leading-none">
            为您打造的
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500"
              >AI 套装</span
            >
          </h3>
          <p class="text-xl opacity-60 font-bold">基于您的需求，我们推荐以下最优组合方案：</p>
        </div>

        <div class="grid grid-cols-1 gap-10 max-w-4xl mx-auto">
          <div
            v-for="tool in matchResult"
            :key="tool.id"
            :class="[
              'p-10 rounded-[48px] border flex flex-col lg:flex-row justify-between items-center gap-12 group transition-all duration-700 hover:shadow-3xl',
              isDarkMode
                ? 'bg-white/5 border-white/5'
                : 'bg-slate-50 border-slate-100 hover:bg-white shadow-xl shadow-slate-200/40'
            ]"
          >
            <div class="flex items-center gap-10">
              <div
                class="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-600/20 group-hover:rotate-6 transition-transform"
              >
                <component :is="getCategoryIcon(tool.category)" class="w-12 h-12 text-white" />
              </div>
              <div class="space-y-3 text-center lg:text-left">
                <div class="flex items-center gap-4 justify-center lg:justify-start">
                  <h4
                    class="text-3xl font-black group-hover:text-blue-600 transition-colors tracking-tighter"
                  >
                    {{ tool.name }}
                  </h4>
                  <span
                    class="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase"
                    >{{ tool.category }}</span
                  >
                </div>
                <p class="text-base opacity-60 font-black italic tracking-tight">
                  {{ tool.best_for }}
                </p>
                <div class="flex gap-2 justify-center lg:justify-start">
                  <span
                    v-for="v in tool.versions"
                    :key="v.type"
                    class="text-[10px] font-black opacity-40 border-l-2 border-slate-300 pl-2 ml-2 first:border-0 first:pl-0 first:ml-0"
                    >{{ v.type }}: {{ v.pricing }}</span
                  >
                </div>
              </div>
            </div>
            <a
              :href="tool.versions[0]?.link"
              target="_blank"
              class="px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg hover:scale-110 transition-all shadow-2xl shadow-blue-600/40 flex items-center gap-3 group/btn"
            >
              立即部署
              <ArrowUpRight
                class="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
              />
            </a>
          </div>
        </div>

        <div class="pt-16 text-center">
          <button
            class="text-sm font-black opacity-30 hover:opacity-100 transition-opacity underline underline-offset-[12px] decoration-2"
            @click="$emit('reset')"
          >
            重新测试
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
