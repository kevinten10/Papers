<script setup>
import { ref } from 'vue'
import { useTools } from './composables/useTools'
import {
  Search,
  Zap,
  LayoutGrid,
  Table as TableIcon,
  Workflow,
  DollarSign,
  Sun,
  Moon,
  Trophy,
  X,
  Globe,
  ShieldCheck,
  Github
} from 'lucide-vue-next'

// Components
import ToolCard from './components/ToolCard.vue'
import ToolMatcher from './components/ToolMatcher.vue'
import GlobalTable from './components/GlobalTable.vue'
import WorkflowSection from './components/WorkflowSection.vue'
import PricingSection from './components/PricingSection.vue'

const {
  searchQuery,
  selectedCategory,
  selectedVersion,
  isDarkMode,
  compareSelection,
  categories,
  versions,
  filteredTools,
  toggleCompare,
  matcherStep,
  matcherAnswers,
  matchResult,
  resetMatcher
} = useTools()

const activeTab = ref('radar')

const tabs = [
  { id: 'radar', label: '雷达', icon: LayoutGrid },
  { id: 'table', label: '大表', icon: TableIcon },
  { id: 'matcher', label: '匹配', icon: Zap },
  { id: 'flow', label: '工作流', icon: Workflow },
  { id: 'pricing', label: '攻略', icon: DollarSign }
]
</script>

<template>
  <div
    :class="[
      'min-h-screen transition-all duration-500 font-sans',
      isDarkMode ? 'bg-[#0a0f1e] text-slate-100' : 'bg-slate-50 text-slate-900'
    ]"
  >
    <!-- Header -->
    <header
      :class="[
        'sticky top-0 z-50 border-b px-6 py-4 backdrop-blur-2xl transition-all duration-300',
        isDarkMode ? 'bg-slate-900/80 border-white/5' : 'bg-white/80 border-slate-200'
      ]"
    >
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-4 group cursor-pointer" @click="activeTab = 'radar'">
          <div
            class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-500 flex items-center justify-center shadow-xl shadow-blue-500/20 transition-all group-hover:scale-110 group-hover:rotate-3"
          >
            <Zap class="w-7 h-7 text-white fill-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black tracking-tight flex items-center gap-2">
              AI 工具全书
              <span
                class="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase tracking-tighter"
                >V4.0</span
              >
            </h1>
            <p class="text-[11px] opacity-50 font-bold uppercase tracking-[0.2em]">
              2026 深度集成与实战教学版
            </p>
          </div>
        </div>

        <nav
          :class="[
            'flex items-center gap-1.5 p-1.5 rounded-[20px] border transition-all shadow-inner',
            isDarkMode ? 'bg-slate-800/50 border-white/5' : 'bg-slate-100/80 border-slate-200'
          ]"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'flex items-center gap-2 px-5 py-2.5 rounded-[14px] text-sm font-black transition-all duration-500',
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200/50'
                : 'opacity-50 hover:opacity-100 hover:bg-white/40'
            ]"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>

          <div class="w-px h-5 bg-slate-300 mx-2 opacity-50"></div>

          <a
            href="https://github.com/kevinten10"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2.5 rounded-xl hover:bg-white/80 transition-all active:scale-90"
            title="GitHub"
          >
            <Github class="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </a>

          <button
            class="p-2.5 rounded-xl hover:bg-white/80 transition-all active:scale-90"
            @click="isDarkMode = !isDarkMode"
          >
            <Sun v-if="isDarkMode" class="w-4 h-4 text-amber-400" />
            <Moon v-else class="w-4 h-4 text-indigo-600" />
          </button>
        </nav>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-16">
      <!-- Radar Section -->
      <section v-if="activeTab === 'radar'" class="space-y-16 animate-in fade-in duration-700">
        <div class="flex flex-col lg:flex-row justify-between items-end gap-10">
          <div class="space-y-4">
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest"
            >
              <Trophy class="w-3 h-3" /> 2026 全球精选 · 系统性集成
            </div>
            <h2 class="text-6xl font-black tracking-tighter leading-[1.1]">
              发现您的
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500"
                >最强 AI 组合</span
              >
            </h2>
            <p class="opacity-60 max-w-2xl text-xl font-medium leading-relaxed">
              整合 10+ 份调研文档、SWOT 分析与 30+ 工具的 CN/Global 双版本实战数据。
            </p>
          </div>

          <div class="flex flex-wrap gap-5 w-full lg:w-auto">
            <div class="relative flex-1 lg:w-80">
              <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索工具、品牌或 SWOT 关键词..."
                :class="[
                  'w-full pl-14 pr-6 py-4 border rounded-[24px] focus:outline-none focus:ring-8 transition-all font-bold text-sm',
                  isDarkMode
                    ? 'bg-slate-800/50 border-white/5 focus:ring-blue-500/10'
                    : 'bg-white border-slate-200 focus:ring-blue-500/5 shadow-xl shadow-slate-200/40'
                ]"
              />
            </div>
            <div
              :class="[
                'flex gap-1 p-1 rounded-[20px] border',
                isDarkMode ? 'bg-slate-800 border-white/5' : 'bg-slate-100 border-slate-200'
              ]"
            >
              <button
                v-for="cat in categories"
                :key="cat"
                :class="[
                  'px-5 py-2.5 rounded-[16px] text-xs font-black transition-all',
                  selectedCategory === cat
                    ? isDarkMode
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50'
                    : 'opacity-40 hover:opacity-100'
                ]"
                @click="selectedCategory = cat"
              >
                {{ cat }}
              </button>
            </div>
            <div
              :class="[
                'flex gap-1 p-1 rounded-[20px] border',
                isDarkMode ? 'bg-slate-800 border-white/5' : 'bg-slate-100 border-slate-200'
              ]"
            >
              <button
                v-for="ver in versions"
                :key="ver"
                :class="[
                  'px-5 py-2.5 rounded-[16px] text-xs font-black transition-all',
                  selectedVersion === ver
                    ? isDarkMode
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-emerald-500 text-white shadow-sm'
                    : 'opacity-40 hover:opacity-100'
                ]"
                @click="selectedVersion = ver"
              >
                {{ ver }}
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <ToolCard
            v-for="tool in filteredTools"
            :key="tool.id"
            :tool="tool"
            :is-dark-mode="isDarkMode"
            :is-compared="compareSelection.some((t) => t.id === tool.id)"
            @toggle-compare="toggleCompare"
          />
        </div>
      </section>

      <!-- Flow Section -->
      <WorkflowSection v-else-if="activeTab === 'flow'" :is-dark-mode="isDarkMode" />

      <!-- Global Table Section -->
      <GlobalTable
        v-else-if="activeTab === 'table'"
        :tools="filteredTools"
        :is-dark-mode="isDarkMode"
        :compare-selection="compareSelection"
        @toggle-compare="toggleCompare"
      />

      <!-- Matcher Section -->
      <ToolMatcher
        v-else-if="activeTab === 'matcher'"
        v-model:matcher-step="matcherStep"
        v-model:matcher-answers="matcherAnswers"
        :match-result="matchResult"
        :is-dark-mode="isDarkMode"
        @reset="resetMatcher"
      />

      <!-- Pricing Section -->
      <PricingSection v-else-if="activeTab === 'pricing'" :is-dark-mode="isDarkMode" />
    </main>

    <!-- Compare Drawer -->
    <div
      v-if="compareSelection.length > 0"
      class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-20 duration-700"
    >
      <div
        :class="[
          'flex items-center gap-8 px-10 py-5 rounded-[32px] border shadow-4xl backdrop-blur-3xl transition-all',
          isDarkMode
            ? 'bg-slate-900/90 border-white/10'
            : 'bg-white/90 border-slate-200 shadow-[0_50px_100px_rgba(0,0,0,0.1)]'
        ]"
      >
        <div class="flex -space-x-5">
          <div
            v-for="tool in compareSelection"
            :key="tool.id"
            class="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-4 border-white dark:border-slate-900 flex items-center justify-center text-white font-black text-sm shadow-lg"
          >
            {{ tool.name[0] }}
          </div>
        </div>
        <div class="w-px h-8 bg-slate-300 opacity-50"></div>
        <button
          class="text-base font-black text-blue-600 hover:scale-110 transition-transform active:scale-95"
          @click="activeTab = 'table'"
        >
          深度对比 {{ compareSelection.length }} 款工具
        </button>
        <button
          class="p-2 opacity-30 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-all"
          @click="compareSelection = []"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer
      class="py-32 border-t border-slate-100 dark:border-white/5 text-center space-y-10 relative overflow-hidden"
    >
      <div
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full"
      ></div>
      <nav
        class="flex flex-wrap justify-center gap-16 text-xs font-black opacity-30 uppercase tracking-[0.4em] relative z-10"
        aria-label="Footer navigation"
      >
        <a 
          href="https://github.com/yourusername/ai-tools-teaching" 
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-blue-600 transition-all hover:tracking-[0.6em]"
        >
          GitHub 仓库
        </a>
        <a 
          href="./AI工具全书-2026交付版.md" 
          class="hover:text-blue-600 transition-all hover:tracking-[0.6em]"
        >
          实战文档
        </a>
        <a 
          href="CHANGELOG.md" 
          class="hover:text-blue-600 transition-all hover:tracking-[0.6em]"
        >
          版本说明
        </a>
        <a 
          href="CONTRIBUTING.md" 
          class="hover:text-blue-600 transition-all hover:tracking-[0.6em]"
        >
          贡献指南
        </a>
      </nav>
      <div class="space-y-4 relative z-10">
        <p class="text-[10px] opacity-20 font-mono font-black tracking-[0.5em] uppercase">
          Built with 💙 in 2026 for the Global Dev Community
        </p>
        <div
          class="justify-center gap-4 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700 hidden sm:flex"
        >
          <Zap class="w-5 h-5" />
          <Globe class="w-5 h-5" />
          <ShieldCheck class="w-5 h-5" />
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=JetBrains+Mono:wght@700&display=swap');

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow-x: hidden;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 20px;
  border: 3px solid transparent;
  background-clip: content-box;
}
.dark ::-webkit-scrollbar-thumb {
  background: #334155;
}

/* Selection */
::selection {
  background: rgba(59, 130, 246, 0.2);
  color: inherit;
}

/* Card Hover Glow */
.group:hover .absolute.top-0.right-0 {
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.5);
}

/* Typography Polish */
h1,
h2,
h3,
h4 {
  letter-spacing: -0.04em;
}
</style>
