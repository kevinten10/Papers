<script setup>
import { DollarSign, CheckCircle2, AlertCircle, X, Plus } from 'lucide-vue-next'

defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <section class="space-y-24 animate-in fade-in duration-1000">
    <div class="text-center space-y-8 max-w-4xl mx-auto">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest"
      >
        <DollarSign class="w-3 h-3" /> 2026 避坑必看
      </div>
      <h2 class="text-7xl font-black tracking-tighter leading-tight">
        充值建议与
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600"
          >省钱全攻略</span
        >
      </h2>
      <p class="opacity-60 text-2xl font-medium leading-relaxed">
        AI 订阅是长跑，我们为您规划了从“入门白嫖”到“硬核生产力”的全球化充值路径。
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
      <!-- Tier 1 -->
      <div
        :class="[
          'rounded-[56px] p-12 space-y-12 border relative overflow-hidden group transition-all duration-700 hover:-translate-y-4',
          isDarkMode
            ? 'bg-slate-800/40 border-white/5'
            : 'bg-white border-slate-200 shadow-2xl shadow-slate-200/40'
        ]"
      >
        <div
          class="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full -mr-20 -mt-20 group-hover:bg-emerald-500/10 transition-colors"
        ></div>
        <div class="space-y-5">
          <span class="text-[11px] font-black uppercase tracking-[0.4em] opacity-40"
            >入门/学生组合</span
          >
          <h3 class="text-4xl font-black tracking-tighter">极致白嫖流</h3>
          <p class="text-5xl font-black text-emerald-500 tracking-tighter">
            ¥0 <span class="text-base font-normal opacity-40">/ 月</span>
          </p>
        </div>
        <ul class="space-y-8">
          <li class="flex items-start gap-5">
            <div
              class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0"
            >
              <CheckCircle2 class="w-5 h-5 text-emerald-500" />
            </div>
            <div class="space-y-2">
              <span class="font-black text-base flex items-center gap-2"
                >Trae (CN 版)
                <span class="text-[8px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-md"
                  >CN</span
                ></span
              >
              <p class="text-sm opacity-50 font-bold leading-relaxed">
                目前最良心的免费 AI IDE，豆包+DeepSeek 算力全开。
              </p>
            </div>
          </li>
          <li class="flex items-start gap-5">
            <div
              class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0"
            >
              <CheckCircle2 class="w-5 h-5 text-emerald-500" />
            </div>
            <div class="space-y-2">
              <span class="font-black text-base flex items-center gap-2"
                >DeepSeek R1 (API)
                <span class="text-[8px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-md"
                  >CN</span
                ></span
              >
              <p class="text-sm opacity-50 font-bold leading-relaxed">
                极其廉价的 API，配合 Aider 即可实现顶配编程体验。
              </p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Tier 2 -->
      <div
        :class="[
          'rounded-[56px] p-12 space-y-12 border-4 relative overflow-hidden group shadow-4xl scale-105 z-10 transition-all duration-700 hover:-translate-y-4',
          isDarkMode
            ? 'bg-slate-800/60 border-blue-500/30'
            : 'bg-white border-blue-600 shadow-blue-500/20 shadow-[0_50px_100px_rgba(59,130,246,0.1)]'
        ]"
      >
        <div
          class="absolute top-0 right-0 bg-blue-600 px-10 py-3 rounded-bl-[32px] text-xs font-black text-white uppercase tracking-[0.2em] shadow-lg"
        >
          团队推荐
        </div>
        <div class="space-y-5">
          <span class="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600"
            >专业/独立开发者</span
          >
          <h3 class="text-4xl font-black tracking-tighter">高效率生产力</h3>
          <p class="text-5xl font-black text-blue-600 tracking-tighter">
            ≈ ¥150 <span class="text-base font-normal opacity-40">/ 月</span>
          </p>
        </div>
        <ul class="space-y-8">
          <li class="flex items-start gap-5">
            <div
              class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0"
            >
              <CheckCircle2 class="w-5 h-5 text-blue-600" />
            </div>
            <div class="space-y-2">
              <span class="font-black text-base flex items-center gap-2"
                >Cursor Pro ($20)
                <span class="text-[8px] bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded-md"
                  >GLOBAL</span
                ></span
              >
              <p class="text-sm opacity-50 font-bold leading-relaxed">
                最全能的 IDE，解决复杂业务逻辑的终极利器。
              </p>
            </div>
          </li>
          <li class="flex items-start gap-5">
            <div
              class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0"
            >
              <CheckCircle2 class="w-5 h-5 text-blue-600" />
            </div>
            <div class="space-y-2">
              <span class="font-black text-base flex items-center gap-2"
                >Coze.com ($9)
                <span class="text-[8px] bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded-md"
                  >GLOBAL</span
                ></span
              >
              <p class="text-sm opacity-50 font-bold leading-relaxed">
                低成本用上 GPT-4o 及其生态，构建自动化工作流。
              </p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Tier 3 -->
      <div
        :class="[
          'rounded-[56px] p-12 space-y-12 border relative overflow-hidden group transition-all duration-700 hover:-translate-y-4',
          isDarkMode
            ? 'bg-slate-800/40 border-white/5'
            : 'bg-white border-slate-200 shadow-2xl shadow-slate-200/40'
        ]"
      >
        <div class="space-y-5">
          <span class="text-[11px] font-black uppercase tracking-[0.4em] opacity-40"
            >硬核/企业级</span
          >
          <h3 class="text-4xl font-black tracking-tighter">极致 Agentic</h3>
          <p class="text-5xl font-black text-amber-500 tracking-tighter">
            ¥1500+ <span class="text-base font-normal opacity-40">/ 月</span>
          </p>
        </div>
        <ul class="space-y-8">
          <li class="flex items-start gap-5">
            <div
              class="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0"
            >
              <CheckCircle2 class="w-5 h-5 text-amber-500" />
            </div>
            <div class="space-y-2">
              <span class="font-black text-base flex items-center gap-2"
                >Claude Max / o1-Pro
                <span class="text-[8px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-md"
                  >GLOBAL</span
                ></span
              >
              <p class="text-sm opacity-50 font-bold leading-relaxed">
                无限制调用地球上最强的推理大脑。
              </p>
            </div>
          </li>
          <li class="flex items-start gap-5">
            <div
              class="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0"
            >
              <CheckCircle2 class="w-5 h-5 text-amber-500" />
            </div>
            <div class="space-y-2">
              <span class="font-black text-base flex items-center gap-2"
                >Claude Code API
                <span class="text-[8px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-md"
                  >GLOBAL</span
                ></span
              >
              <p class="text-sm opacity-50 font-bold leading-relaxed">
                让 AI 代理全权接管终端，享受极致自动化。
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Strategy Box -->
    <div
      :class="[
        'rounded-[64px] p-16 border border-dashed relative overflow-hidden',
        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300 shadow-inner'
      ]"
    >
      <div class="flex items-center gap-8 mb-16 relative z-10">
        <div
          class="w-20 h-20 rounded-[32px] bg-amber-500/10 flex items-center justify-center shadow-xl shadow-amber-500/10"
        >
          <AlertCircle class="w-10 h-10 text-amber-500" />
        </div>
        <div>
          <h3 class="text-4xl font-black tracking-tighter">避坑指南 & 全球充值技巧</h3>
          <p class="text-lg opacity-50 font-bold mt-1">省下的钱够再买一台 MacBook。</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
        <div class="space-y-10">
          <h4
            class="text-sm font-black uppercase text-rose-500 tracking-[0.5em] flex items-center gap-3"
          >
            <X class="w-5 h-5" /> 绝对不要踩的坑
          </h4>
          <ul class="space-y-8">
            <li class="flex items-start gap-4 group/item">
              <div
                class="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2.5 group-hover/item:scale-150 transition-transform"
              ></div>
              <p class="text-base font-black opacity-70 leading-relaxed">
                不要同时订阅多个同质化 IDE (如 Cursor + Windsurf)，功能重叠度 90%。
              </p>
            </li>
            <li class="flex items-start gap-4 group/item">
              <div
                class="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2.5 group-hover/item:scale-150 transition-transform"
              ></div>
              <p class="text-base font-black opacity-70 leading-relaxed">
                国内开发者不要在未解决网络环境前充值 Claude Pro，极易封号。
              </p>
            </li>
          </ul>
        </div>
        <div class="space-y-10">
          <h4
            class="text-sm font-black uppercase text-emerald-600 tracking-[0.5em] flex items-center gap-3"
          >
            <Plus class="w-5 h-5" /> 全球省钱妙招
          </h4>
          <ul class="space-y-8">
            <li class="flex items-start gap-4 group/item">
              <div
                class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 group-hover/item:scale-150 transition-transform"
              ></div>
              <p class="text-base font-black opacity-70 leading-relaxed">
                优先使用 DeepSeek API 接入 Aider，成本仅为订阅制的 5% 且能力相当。
              </p>
            </li>
            <li class="flex items-start gap-4 group/item">
              <div
                class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 group-hover/item:scale-150 transition-transform"
              ></div>
              <p class="text-base font-black opacity-70 leading-relaxed">
                善用 GitHub Student Pack，可白嫖 Copilot、Cursor 部分额度及各大 API。
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
