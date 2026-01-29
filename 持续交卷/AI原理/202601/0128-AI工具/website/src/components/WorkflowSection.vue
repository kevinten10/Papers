<script setup>
import { Activity, BookOpen, Layers, Zap } from 'lucide-vue-next'

defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const workflows = [
  {
    title: '通用开发闭环 (IDE + CLI)',
    icon: Activity,
    color: 'blue',
    steps: [
      '需求澄清 (Claude/OpenAI)',
      '任务拆分 (IDE Chat)',
      '实现与调试 (IDE Solo/Composer)',
      '质量扫描与重构 (CLI/Reviewer)',
      '交付文档生成 (NotebookLM)'
    ]
  },
  {
    title: '知识消化与调研流',
    icon: BookOpen,
    color: 'emerald',
    steps: [
      '海量资料搜集 (Perplexity)',
      '结构化摘要提取 (NotebookLM)',
      '架构草图绘制 (Nano Banana)',
      '方案对齐与可行性分析 (Claude)',
      '知识库入库与共享 (Coze/Wiki)'
    ]
  },
  {
    title: '全媒体创意生产流',
    icon: Layers,
    color: 'amber',
    steps: [
      '剧本/分镜生成 (Claude/GPT)',
      '角色/场景建模 (Meshy/混元3D)',
      '视频片段渲染 (Kling/Sora)',
      '音频/配乐合成 (NotebookLM/Suno)',
      '后期剪辑与增强 (剪映 AI)'
    ]
  },
  {
    title: '极致办公自动化流',
    icon: Zap,
    color: 'purple',
    steps: [
      '多源咨询自动收集 (Coze)',
      '复杂表格公式生成 (WPS AI)',
      'PPT 框架与美化 (NotebookLM/WPS)',
      '日程自动冲突检测 (Coze 智能体)',
      '周报/月报自动汇总 (DeepSeek)'
    ]
  }
]
</script>

<template>
  <section class="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-700">
    <div class="text-center space-y-6 max-w-3xl mx-auto">
      <h2 class="text-6xl font-black tracking-tighter leading-tight">
        AI 协作
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500"
          >实战工作流</span
        >
      </h2>
      <p class="opacity-60 text-xl font-medium leading-relaxed">
        基于调研文档整理的标准化 AI 协作模式，从需求到交付的全闭环指南。
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div
        v-for="flow in workflows"
        :key="flow.title"
        :class="[
          'rounded-[48px] p-10 border relative overflow-hidden',
          isDarkMode
            ? 'bg-slate-800/40 border-white/5'
            : 'bg-white border-slate-200 shadow-xl shadow-slate-200/40'
        ]"
      >
        <h3 class="text-2xl font-black mb-8 flex items-center gap-4">
          <div
            :class="[
              `w-10 h-10 rounded-xl flex items-center justify-center bg-${flow.color}-500/10`
            ]"
          >
            <component :is="flow.icon" :class="[`w-5 h-5 text-${flow.color}-600`]" />
          </div>
          {{ flow.title }}
        </h3>
        <div class="space-y-6 relative">
          <div class="absolute left-4 top-4 bottom-4 w-px bg-slate-200 dark:bg-white/10"></div>
          <div v-for="(step, idx) in flow.steps" :key="idx" class="relative pl-12">
            <div
              :class="[
                `absolute left-0 top-1 w-8 h-8 rounded-full text-white flex items-center justify-center text-[10px] font-black z-10 bg-${flow.color}-500`
              ]"
            >
              0{{ idx + 1 }}
            </div>
            <h4 class="font-bold text-sm mb-1">{{ step }}</h4>
            <p class="text-xs opacity-50 font-medium">使用推荐工具组合，确保每一步产出符合标准。</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
