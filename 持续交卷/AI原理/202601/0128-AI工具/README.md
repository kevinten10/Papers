# AI 工具全书 - 2026 深度集成与实战教学版

[![Vue 3](https://img.shields.io/badge/Vue-3.5.13-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 整合 10+ 份调研文档、SWOT 分析与 30+ 工具的 CN/Global 双版本实战数据，助力开发者和团队精准选型 AI 工具。

## 🎯 项目简介

本项目是一个全面的 AI 工具教学与选型平台，涵盖：

- **AI IDE**: Cursor、Trae、Windsurf、Zed 等 8+ 款主流 IDE 深度评测
- **AI CLI**: Claude Code、Aider、OpenCode 等命令行工具实战指南
- **AI LLM**: DeepSeek、GPT、Claude、Gemini 等大模型能力对比
- **AI APP**: NotebookLM 等应用工具使用技巧

### ✨ 核心特性

- 📊 **双版本对比表**: CN/Global 版本定价、模型、能力一屏掌握
- 🎯 **智能匹配向导**: 4 步问答为您推荐最适合的 AI 工具组合
- 🔄 **实战工作流**: 4 大标准化 AI 协作模式，从需求到交付全闭环
- 💰 **省钱攻略**: 从"入门白嫖"到"硬核生产力"的全球化充值路径
- 🌓 **暗黑模式**: 支持亮色/暗色主题切换
- 📱 **响应式设计**: 完美适配桌面端和移动端

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装与运行

```bash
# 进入项目目录
cd website

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 代码规范

```bash
# 运行 ESLint 检查
npm run lint

# 运行 Prettier 格式化
npm run format

# 运行单元测试
npm run test
```

## 📁 项目结构

```
website/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── Common/          # 通用组件
│   │   ├── GlobalTable.vue  # 全局对比表格
│   │   ├── PricingSection.vue # 定价攻略
│   │   ├── ToolCard.vue     # 工具卡片
│   │   ├── ToolMatcher.vue  # 智能匹配向导
│   │   └── WorkflowSection.vue # 工作流展示
│   ├── composables/         # 组合式函数
│   │   ├── useTools.js      # 核心逻辑
│   │   └── __tests__/       # 测试文件
│   ├── data/                # 数据文件
│   │   ├── schema.json      # 数据结构定义
│   │   └── tools.json       # 工具数据
│   ├── App.vue              # 主应用组件
│   ├── main.js              # 入口文件
│   └── style.css            # 全局样式
├── public/                  # 静态资源
├── index.html               # HTML 模板
├── package.json             # 项目配置
├── vite.config.js           # Vite 配置
├── tailwind.config.js       # Tailwind 配置
├── Dockerfile               # Docker 构建
└── nginx.conf               # Nginx 配置
```

## 🛠️ 技术栈

- **前端框架**: Vue 3.5 + Composition API
- **构建工具**: Vite 6.0
- **样式方案**: Tailwind CSS 3.4
- **图标库**: Lucide Vue Next
- **测试框架**: Vitest + Vue Test Utils
- **代码规范**: ESLint + Prettier
- **部署方案**: Docker + Nginx

## 📚 数据来源

本项目数据基于以下调研文档整理：

- [调研/README.md](调研/README.md) - 原始调研笔记
- [调研/使用指南_*.md](调研/) - 各平台使用指南
- [AI工具全书-2026交付版.md](AI工具全书-2026交付版.md) - 完整交付文档

## 🐳 Docker 部署

```bash
# 构建镜像
cd website
docker build -t ai-tools-site .

# 运行容器
docker run -d -p 80:80 --name ai-tools-site ai-tools-site
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

## 📝 变更日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本历史。

## 📄 许可证

[MIT](LICENSE) © 2026 AI Tools Teaching Project

## 🙏 致谢

感谢所有为 AI 工具生态做出贡献的开发者和团队。

---

<p align="center">Built with 💙 in 2026 for the Global Dev Community</p>
