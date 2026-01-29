# Clawdbot (现更名为 Moltbot) 深度调研报告

## 1. 什么是 Clawdbot？

**Clawdbot**（2026年1月更名为 **Moltbot**）是一个开源的、运行在本地设备上的**个人 AI 助手**。它由 Peter Steinberger (@steipete) 开发，旨在打破传统 AI 聊天机器人（如 ChatGPT、Claude 网页版）的限制，让 AI 真正拥有“手和脚”，能够直接在你的计算机上执行任务。

其核心逻辑是：**本地运行的 Agent + 消息网关 + 技能插件系统**。

- **官方网站**: [molt.bot](https://molt.bot/) (原 [clawd.bot](https://clawd.bot/))
- **GitHub**: [clawdbot/clawdbot](https://github.com/clawdbot/clawdbot)
- **核心理念**: 让 AI 成为你的“数字员工”，而非仅仅是一个聊天框。

---

## 2. 核心特性

- **本地主权**: 运行在用户自己的 Mac, Windows 或 Linux 设备上。数据存储在本地（Markdown 文件和本地文件夹），隐私性极高。
- **消息平台集成**: 你可以通过 **WhatsApp, Telegram, Discord, iMessage** 与它交流。就像在给一个真人助理发短信。
- **主动性 (Proactivity)**: 不同于被动响应的 AI，它能主动给你发消息（如：提醒日程、汇报自动化任务进度）。
- **持久化记忆**: 它拥有跨会话的记忆能力，能记住你的偏好、历史决策和复杂背景。
- **技能系统 (Skills)**: 支持插件扩展。它可以操作 Shell、读写文件、控制浏览器、调用 API。
- **自进化能力**: 它可以根据你的需求，通过对话自动编写并安装新的技能脚本。

---

## 3. 典型使用场景

### 3.1 个人行政与办公自动化
- **日程管理**: “帮我查看明天的日历，并在上午 10 点提醒我开会。”
- **邮件与信息处理**: 自动清理收件箱，撰写邮件草稿，总结未读的 Telegram 消息。
- **文件管理**: 整理下载文件夹，重命名文件，将 PDF 转换为 Markdown。

### 3.2 深度调研与信息采集
- **网页抓取与总结**: 给它一个 URL，它能自动访问、提取核心信息并同步到你的 **Notion** 或 **Obsidian**。
- **对比调研**: “调研这三款向量数据库的性能，整理成对比表格发给我。”

### 3.3 编程与开发辅助
- **远程 Coding**: 通过手机发消息让家里的 Mac mini 运行测试、修复代码 Bug 并直接提交 Pull Request。
- **环境搭建**: 自动安装依赖、配置本地开发环境。

### 3.4 智能家居与生活助手
- **家居控制**: 通过插件连接 Sonos 音箱、Philips Hue 灯光、甚至是空气净化器。
- **个性化服务**: 生成个性化的冥想引导语音（结合 TTS 技术）。

---

## 4. 如何快速上手

### 4.1 环境要求
- **Node.js**: 需要版本 22 或更高。
- **硬件**: 推荐长期运行的设备（如 Mac mini, Raspberry Pi 或 24h 运行的笔记本）。

### 4.2 安装步骤
1. **全局安装**:
   ```bash
   npm install -g clawdbot@latest
   # 或者使用 pnpm
   pnpm add -g clawdbot@latest
   ```

2. **运行配置向导**:
   ```bash
   clawdbot onboard --install-daemon
   ```
   *此过程会引导你设置模型（推荐 Claude 3.5 Sonnet 或 Opus）、API Key 以及消息网关。*

3. **连接聊天通道**:
   ```bash
   clawdbot channels login
   ```
   *根据提示扫描 WhatsApp QR 码或输入 Telegram Bot Token。*

4. **验证状态**:
   ```bash
   clawdbot health
   clawdbot status
   ```

---

## 5. 为什么它最近很火？

1. **Mac mini 效应**: 随着 M4 Mac mini 的发布，大量用户寻找将其作为“家庭 AI 服务器”的最佳实践，Clawdbot 被视为最强“贾维斯”化身。
2. **超越“对话”**: 它展示了 AI Agent 从“只会聊天”到“能干脏活累活”的转变。
3. **黑客友好**: 它是开源的，用户可以完全控制它的指令集和权限。
4. **无缝集成**: 消息软件的集成极大降低了使用门槛，让 AI 随时随地“在线”。

---

## 6. 注意事项与风险

- **安全风险**: 赋予 AI 操作 Shell 和文件的权限具有潜在风险。建议在隔离环境或非核心生产机器上运行。
- **Token 消耗**: 作为一个 Agent，它在执行复杂任务（如网页搜索、自愈代码）时会频繁调用 LLM，可能导致较高的 API 费用。
- **配置门槛**: 虽然有向导，但对于非技术用户，配置 Shell 权限和 API Gateway 仍有一定挑战。

---
*调研日期：2026-01-27*
*记录于：d:\Projects\Papers\持续交卷\AI原理\202601\0127-clawdbot.md*
