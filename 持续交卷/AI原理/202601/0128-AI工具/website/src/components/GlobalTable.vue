<script setup>
import { ref, computed } from 'vue'
import {
  Star,
  ArrowRightLeft,
  Cpu,
  Terminal,
  Brain,
  Layers,
  Monitor
} from 'lucide-vue-next'
import { getCategoryIcon } from '../utils/icons'

const props = defineProps({
  tools: {
    type: Array,
    required: true
  },
  isDarkMode: {
    type: Boolean,
    default: false
  },
  compareSelection: {
    type: Array,
    default: () => []
  }
})

defineEmits(['toggle-compare'])

// 当前选中的分类标签
const activeTab = ref('IDE')

// 分类配置
const categories = [
  { id: 'IDE', name: 'AI IDE', icon: Cpu, desc: '智能开发环境对比' },
  { id: 'CLI', name: 'AI CLI', icon: Terminal, desc: '命令行工具对比' },
  { id: 'LLM', name: 'AI 模型', icon: Brain, desc: '大语言模型对比' },
  { id: 'APP', name: 'AI 应用', icon: Layers, desc: '应用工具对比' },
  { id: 'DESKTOP', name: '桌面工具', icon: Monitor, desc: '桌面AI助手对比' }
]

// 按分类过滤工具
const filteredTools = computed(() => {
  return props.tools.filter(tool => tool.category === activeTab.value)
})

// 获取当前分类的对比字段配置
const getTableColumns = (category) => {
  const columns = {
    IDE: [
      { key: 'name', label: '工具名称', width: 'w-48' },
      { key: 'models', label: '核心模型', width: 'w-56' },
      { key: 'agent', label: 'Agent能力', width: 'w-32' },
      { key: 'completion', label: '代码补全', width: 'w-28' },
      { key: 'refactor', label: '重构能力', width: 'w-28' },
      { key: 'price', label: '价格', width: 'w-32' },
      { key: 'rating', label: '推荐', width: 'w-28' }
    ],
    CLI: [
      { key: 'name', label: '工具名称', width: 'w-48' },
      { key: 'models', label: '模型支持', width: 'w-48' },
      { key: 'freeQuota', label: '免费额度', width: 'w-32' },
      { key: 'git', label: 'Git集成', width: 'w-24' },
      { key: 'automation', label: '自动化', width: 'w-24' },
      { key: 'price', label: '价格', width: 'w-32' },
      { key: 'rating', label: '推荐', width: 'w-28' }
    ],
    LLM: [
      { key: 'name', label: '模型名称', width: 'w-48' },
      { key: 'context', label: '上下文', width: 'w-32' },
      { key: 'reasoning', label: '推理能力', width: 'w-28' },
      { key: 'coding', label: '代码能力', width: 'w-28' },
      { key: 'chinese', label: '中文支持', width: 'w-28' },
      { key: 'price', label: '价格', width: 'w-32' },
      { key: 'rating', label: '推荐', width: 'w-28' }
    ],
    APP: [
      { key: 'name', label: '应用名称', width: 'w-48' },
      { key: 'function', label: '核心功能', width: 'w-56' },
      { key: 'scenario', label: '适用场景', width: 'w-48' },
      { key: 'price', label: '价格', width: 'w-32' },
      { key: 'rating', label: '推荐', width: 'w-28' }
    ],
    DESKTOP: [
      { key: 'name', label: '工具名称', width: 'w-48' },
      { key: 'function', label: '核心功能', width: 'w-56' },
      { key: 'integration', label: '系统集成', width: 'w-40' },
      { key: 'price', label: '价格', width: 'w-32' },
      { key: 'rating', label: '推荐', width: 'w-28' }
    ]
  }
  return columns[category] || columns.IDE
}

// 获取工具在特定维度的值
const getToolValue = (tool, key) => {
  const valueMap = {
    name: () => ({ name: tool.name, developer: tool.developer, category: tool.category }),
    models: () => tool.versions?.[0]?.models || '-',
    agent: () => getAgentLevel(tool),
    completion: () => getCompletionLevel(tool),
    refactor: () => getRefactorLevel(tool),
    freeQuota: () => getFreeQuota(tool),
    git: () => hasGitIntegration(tool),
    automation: () => getAutomationLevel(tool),
    context: () => getContextLength(tool),
    reasoning: () => getReasoningLevel(tool),
    coding: () => getCodingLevel(tool),
    chinese: () => getChineseLevel(tool),
    function: () => tool.best_for?.slice(0, 20) + '...' || '-',
    scenario: () => tool.tags?.slice(0, 2).join(', ') || '-',
    integration: () => tool.tags?.slice(0, 2).join(', ') || '-',
    price: () => tool.versions?.[0]?.pricing || '-',
    rating: () => tool.personal_experience?.rating || 0
  }
  return (valueMap[key] || (() => '-'))()
}

// 辅助函数：获取能力等级
const getAgentLevel = (tool) => {
  if (tool.tags?.includes('Agentic') || tool.tags?.includes('自主代理')) return '⭐⭐⭐⭐⭐'
  if (tool.tags?.includes('Composer')) return '⭐⭐⭐⭐'
  return '⭐⭐⭐'
}

const getCompletionLevel = (tool) => {
  if (tool.tags?.includes('行业标杆')) return '⭐⭐⭐⭐⭐'
  if (tool.tags?.includes('极速')) return '⭐⭐⭐⭐'
  return '⭐⭐⭐'
}

const getRefactorLevel = (tool) => {
  if (tool.tags?.includes('大项目利器')) return '⭐⭐⭐⭐⭐'
  if (tool.tags?.includes('重构')) return '⭐⭐⭐⭐'
  return '⭐⭐⭐'
}

const getFreeQuota = (tool) => {
  const pricing = tool.versions?.[0]?.pricing || ''
  if (pricing.includes('2000')) return '2000/天'
  if (pricing.includes('1000')) return '1000/天'
  if (pricing.includes('免费')) return '免费'
  return '无'
}

const hasGitIntegration = (tool) => {
  return tool.tags?.includes('Git') || tool.tags?.includes('开源') ? '✅' : '❌'
}

const getAutomationLevel = (tool) => {
  if (tool.tags?.includes('自主代理')) return '⭐⭐⭐⭐⭐'
  if (tool.tags?.includes('自动化')) return '⭐⭐⭐⭐'
  return '⭐⭐⭐'
}

const getContextLength = (tool) => {
  const models = tool.versions?.[0]?.models || ''
  if (models.includes('1M') || models.includes('100万')) return '100万'
  if (models.includes('200K')) return '20万'
  if (models.includes('128K')) return '12.8万'
  return '6.4万'
}

const getReasoningLevel = (tool) => {
  if (tool.tags?.includes('推理强') || tool.tags?.includes('o1')) return '⭐⭐⭐⭐⭐'
  if (tool.tags?.includes('编程最强')) return '⭐⭐⭐⭐'
  return '⭐⭐⭐'
}

const getCodingLevel = (tool) => {
  if (tool.tags?.includes('编程最强') || tool.tags?.includes('代码')) return '⭐⭐⭐⭐⭐'
  if (tool.tags?.includes('国产之光')) return '⭐⭐⭐⭐'
  return '⭐⭐⭐'
}

const getChineseLevel = (tool) => {
  if (tool.tags?.includes('中文顶尖') || tool.tags?.includes('中文')) return '⭐⭐⭐⭐⭐'
  if (tool.tags?.includes('国产')) return '⭐⭐⭐⭐'
  return '⭐⭐⭐'
}
</script>

<template>
  <section class="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-700">
    <div class="text-center space-y-6 max-w-3xl mx-auto">
      <h2 class="text-6xl font-black tracking-tighter leading-tight">
        分类维度
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500"
          >对比表</span
        >
      </h2>
      <p class="opacity-60 text-xl font-medium leading-relaxed">
        按 IDE/CLI/LLM/APP/DESKTOP 不同维度进行专业对比，同类工具才有可比性。
      </p>
    </div>

    <!-- 分类标签页 -->
    <div class="flex flex-wrap justify-center gap-4">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="activeTab = cat.id"
        :class="[
          'flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all duration-300',
          activeTab === cat.id
            ? isDarkMode
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-105'
            : isDarkMode
              ? 'bg-white/5 text-white/60 hover:bg-white/10'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
      >
        <component :is="cat.icon" class="w-5 h-5" />
        <span>{{ cat.name }}</span>
      </button>
    </div>

    <!-- 当前分类描述 -->
    <div class="text-center">
      <p :class="['text-sm font-medium', isDarkMode ? 'text-white/40' : 'text-slate-500']">
        {{ categories.find(c => c.id === activeTab)?.desc }}
      </p>
    </div>

    <!-- 对比表格 -->
    <div
      :class="[
        'rounded-[32px] border overflow-hidden shadow-2xl transition-all',
        isDarkMode
          ? 'bg-slate-800/40 border-white/5'
          : 'bg-white border-slate-200 shadow-slate-200/30'
      ]"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr
              :class="[
                'border-b text-[11px] font-black uppercase tracking-[0.15em]',
                isDarkMode
                  ? 'bg-white/5 border-white/5 text-white/50'
                  : 'bg-slate-50 border-slate-100 text-slate-500'
              ]"
            >
              <th
                v-for="col in getTableColumns(activeTab)"
                :key="col.key"
                :class="['px-6 py-5', col.width]"
              >
                {{ col.label }}
              </th>
              <th class="px-6 py-5 w-24 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-white/5">
            <tr
              v-for="tool in filteredTools"
              :key="tool.id"
              :class="[
                'hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all group',
                tool.used === false ? 'opacity-70' : ''
              ]"
            >
              <td
                v-for="col in getTableColumns(activeTab)"
                :key="col.key"
                class="px-6 py-5"
              >
                <!-- 名称列特殊处理 -->
                <template v-if="col.key === 'name'">
                  <div class="flex items-center gap-4">
                    <div
                      class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shadow-sm"
                    >
                      <component :is="getCategoryIcon(tool.category)" class="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-black text-base group-hover:text-blue-600 transition-colors">
                          {{ tool.name }}
                        </span>
                        <span
                          v-if="tool.used === false"
                          :class="[
                            'px-1.5 py-0.5 rounded text-[8px] font-black',
                            isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                          ]"
                        >
                          未体验
                        </span>
                      </div>
                      <p class="text-[9px] opacity-40 font-bold uppercase tracking-widest">
                        {{ tool.developer }}
                      </p>
                    </div>
                  </div>
                </template>

                <!-- 评分列特殊处理 -->
                <template v-else-if="col.key === 'rating'">
                  <div class="flex gap-0.5">
                    <Star
                      v-for="i in 5"
                      :key="i"
                      :class="[
                        'w-4 h-4',
                        i <= getToolValue(tool, col.key)
                          ? 'text-amber-400 fill-amber-400'
                          : 'opacity-10'
                      ]"
                    />
                  </div>
                </template>

                <!-- 普通列 -->
                <template v-else>
                  <span :class="['text-sm font-bold', isDarkMode ? 'text-white/80' : 'text-slate-700']">
                    {{ getToolValue(tool, col.key) }}
                  </span>
                </template>
              </td>

              <!-- 操作列 -->
              <td class="px-6 py-5 text-right">
                <button
                  :class="[
                    'p-2.5 rounded-xl transition-all active:scale-90 shadow-sm',
                    compareSelection.some((t) => t.id === tool.id)
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'hover:bg-slate-200 dark:hover:bg-white/10 bg-slate-100 dark:bg-white/5'
                  ]"
                  @click="$emit('toggle-compare', tool)"
                >
                  <ArrowRightLeft class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div
        v-if="filteredTools.length === 0"
        class="py-20 text-center"
      >
        <p :class="['text-lg font-bold opacity-40', isDarkMode ? 'text-white' : 'text-slate-600']">
          该分类暂无工具数据
        </p>
      </div>
    </div>

    <!-- 图例说明 -->
    <div
      :class="[
        'rounded-2xl p-6 border',
        isDarkMode
          ? 'bg-white/5 border-white/10'
          : 'bg-slate-50 border-slate-200'
      ]"
    >
      <h4 :class="['text-xs font-black uppercase tracking-widest mb-4', isDarkMode ? 'text-white/60' : 'text-slate-500']">
        图例说明
      </h4>
      <div class="flex flex-wrap gap-6 text-sm">
        <div class="flex items-center gap-2">
          <span class="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/30"></span>
          <span :class="isDarkMode ? 'text-white/60' : 'text-slate-600'">未亲身体验，信息来自调研</span>
        </div>
        <div class="flex items-center gap-2">
          <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
          <span :class="isDarkMode ? 'text-white/60' : 'text-slate-600'">专家推荐指数 (1-5星)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold">⭐⭐⭐⭐⭐</span>
          <span :class="isDarkMode ? 'text-white/60' : 'text-slate-600'">能力等级评分</span>
        </div>
      </div>
    </div>
  </section>
</template>
