# 变更日志

所有项目的显著变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added
- 项目初始化和基础架构搭建
- 完整的 AI 工具数据（20+ 款工具）
- 智能匹配向导功能
- 双版本对比表（CN/Global）
- 实战工作流展示
- 定价攻略与省钱指南
- 暗黑模式支持
- Docker 部署支持

## [1.0.0] - 2026-01-28

### Added

#### 核心功能
- **工具雷达页面**: 展示所有 AI 工具的卡片式布局，支持搜索、分类筛选、版本筛选
- **全局对比表**: 一屏掌握所有工具的 CN/Global 版本差异、定价模型与核心能力
- **智能匹配向导**: 4 步问答（用途、规模、预算、环境）推荐最适合的 AI 工具组合
- **实战工作流**: 4 大标准化 AI 协作模式
  - 通用开发闭环 (IDE + CLI)
  - 知识消化与调研流
  - 全媒体创意生产流
  - 极致办公自动化流
- **定价攻略**: 从"入门白嫖"到"硬核生产力"的三档推荐方案

#### 数据内容
- **AI IDE (8款)**: Cursor、Trae、Qoder、Windsurf、Zed、Replit、Codebuddy、Kiro
- **AI CLI (3款)**: Claude Code、Aider、OpenCode
- **AI LLM (7款)**: DeepSeek、GPT、Claude、Gemini、MiniMax、Kimi、Grok
- **AI APP (1款)**: NotebookLM

#### 技术实现
- Vue 3.5 + Composition API
- Vite 6.0 构建工具
- Tailwind CSS 3.4 样式框架
- Lucide Vue Next 图标库
- Vitest 测试框架
- ESLint + Prettier 代码规范
- Docker + Nginx 部署方案

#### 文档
- 项目根目录 README.md
- website/README.md 开发文档
- CONTRIBUTING.md 贡献指南
- CHANGELOG.md 变更日志

### 设计特性
- 响应式设计，适配桌面端和移动端
- 暗黑/亮色主题切换
- 玻璃态视觉效果
- 流畅的动画过渡
- 卡片悬浮效果
- 自定义滚动条样式

## 版本说明

### 版本号规则

本项目使用语义化版本控制（SemVer）：

- **主版本号（MAJOR）**: 不兼容的 API 修改
- **次版本号（MINOR）**: 向下兼容的功能新增
- **修订号（PATCH）**: 向下兼容的问题修复

### 版本标签

- `[Unreleased]`: 未发布的变更
- `[Yanked]`: 已撤销的版本（如果有）

## 贡献记录

感谢所有为项目做出贡献的人！

---

## 更新计划

### 即将推出

- [ ] 添加更多 AI 工具数据
- [ ] 工具对比功能增强
- [ ] 用户收藏功能
- [ ] 分享功能
- [ ] PWA 支持
- [ ] 多语言支持

### 长期规划

- [ ] 用户评论系统
- [ ] 工具评分系统
- [ ] 社区讨论区
- [ ] API 接口开放

---

<p align="center">Built with 💙 in 2026</p>
