import {
  Cpu,
  Terminal,
  Globe,
  Layers,
  Monitor,
  Zap,
  Code2,
  Bot,
  Brain,
  Sparkles,
  MessageSquare,
  Cloud,
  Box
} from 'lucide-vue-next'

/**
 * 根据工具分类获取对应的图标组件
 * @param {string} category - 工具分类 (IDE/CLI/LLM/APP/DESKTOP)
 * @returns {Component} 图标组件
 */
export function getCategoryIcon(category) {
  switch (category) {
    case 'IDE':
      return Cpu
    case 'CLI':
      return Terminal
    case 'LLM':
      return Brain
    case 'APP':
      return Layers
    case 'DESKTOP':
      return Monitor
    default:
      return Zap
  }
}

/**
 * 分类图标映射表
 */
export const categoryIcons = {
  IDE: Cpu,
  CLI: Terminal,
  LLM: Brain,
  APP: Layers,
  DESKTOP: Monitor,
  default: Zap
}

/**
 * 工具特定的图标映射（用于更精确的图标展示）
 */
export const toolIcons = {
  // IDE
  cursor: Code2,
  trae: Bot,
  qoder: Cloud,
  windsurf: Sparkles,
  zed: Zap,
  replit: Globe,
  codebuddy: Box,
  kiro: Cpu,
  // CLI
  'claude-code': Bot,
  aider: Terminal,
  opencode: Code2,
  'gemini-cli': Sparkles,
  'qwen-cli': Cloud,
  cline: Code2,
  // LLM
  'deepseek-family': Brain,
  'gpt-family': Bot,
  'claude-family': MessageSquare,
  'gemini-family': Sparkles,
  'qwen-family': Cloud,
  'doubao-family': Box,
  'glm-family': Brain,
  // APP
  perplexity: Globe,
  coze: Bot,
  notebooklm: Layers
}

/**
 * 获取分类图标（替代方案）
 * @param {string} category - 工具分类
 * @returns {Component} 图标组件
 */
export function getCategoryIconFromMap(category) {
  return categoryIcons[category] || categoryIcons.default
}
