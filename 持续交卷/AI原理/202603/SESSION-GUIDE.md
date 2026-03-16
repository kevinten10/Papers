# 会话指导文件 — 2026-03-11 AI Coding 文章生成

> 本文件记录本次 Claude Code 会话的完整产出，供后续会话参考。

---

## 一、项目背景

基于 Vibe Coding 大型项目翻车后的实践经验，撰写了一篇深度技术文章，并生成四个社媒平台的改编版本和 20 张配图。

**核心主题：** Vibe Coding 翻车后怎么办？大型项目的补救策略与工程化实践

**Git Commit:** `e41939d` (master 分支)

---

## 二、文件清单

### 2.1 主文章

| 文件 | 说明 |
|:-----|:-----|
| `0310-AICoding.md` | 主文章（~57KB，约 15000 字），包含 6 大策略 + 10 个 AI Skills 模板 |

**文章结构：**
1. 前言 — Vibe Coding 翻车现场
2. 翻车原因分析（架构漂移、理解力债务、上下文限制）
3. **策略一：** 穷举式逻辑规约（Exhaustive Enumeration）
4. **策略二：** 聚焦式 Code Review（Focused Review）
5. **策略三：** Multi-Agent 调试（Fan-Out/Fan-In 模式）
6. **策略四：** 文档分层治理（热/温/冷三级记忆）
7. **策略五：** MCP + Hooks 调试工具链
8. **策略六：** AI Skills 工具箱（10 个可复用模板）
9. 总结与哲学反思

**文章特色：**
- 每条策略含：原理讲解 → 实际代码/配置示例 → 配图
- 10 个 Skills 模板可直接复制使用（涵盖需求分析、代码审查、测试生成、重构等）
- 引用了 Andrej Karpathy、Addy Osmani 等人的观点

### 2.2 社媒改编版

| 文件 | 说明 |
|:-----|:-----|
| `0310-AICoding-社媒版.md` | 四平台社媒文案（~14KB） |

**包含四个平台的完整发布文案：**

| 平台 | 风格 | 字数 | 特点 |
|:-----|:-----|:-----|:-----|
| 微信公众号 | 精华浓缩版 | ~2500 字 | 独立成文，引导收藏转发 |
| 知乎 | 技术深度版 | ~3000 字 | 自问自答体，数据驱动，带论文引用 |
| 小红书 | 干货笔记版 | ~800 字 | 短句 + emoji + 轮播图引导 |
| X / Twitter | 英文 Thread | 7 推 | 英文，每推 < 280 字符，配图标注 |

**文末附有各平台配图对照表**（第五节），标注了每张图的推荐使用位置。

### 2.3 配图（20 张）

所有图片在 `images/` 目录，使用 `mcp-image` (Gemini) 生成。

#### 原文配图（8 张）

| 文件名 | 内容 | 用于文章章节 |
|:-------|:-----|:------------|
| `recovery-flow.png` | 补救流程总览 | 前言 |
| `failure-analysis.png` | 翻车原因分析 | 第一章 |
| `context-feeding.png` | 上下文喂养策略 | 策略一 |
| `focused-review.png` | 聚焦式 Review | 策略二 |
| `multi-agent-debugging.png` | 多 Agent 调试 | 策略三 |
| `doc-architecture.png` | 文档分层架构 | 策略四 |
| `save-decision.png` | 存废决策流程 | 补充章节 |

#### 金句卡（4 张，跨平台复用）

| 文件名 | 金句内容 |
|:-------|:--------|
| `quote-exhaustive.png` | "AI 最大的优势不是写代码——是穷举" |
| `quote-architect.png` | "AI 是最好的施工队，但建筑师必须是你" |
| `quote-discipline.png` | "AI 越强大，工程纪律就越重要" |
| `quote-review.png` | "Review 的核心不是找 bug——是验证逻辑完整性" |

#### 平台专属图（8 张）

| 文件名 | 平台 | 说明 |
|:-------|:-----|:-----|
| `wechat-cover.png` | 微信 | 公众号封面头图（深蓝专业风） |
| `wechat-6strategies.png` | 微信 | 6 策略竖版长图 |
| `zhihu-header.png` | 知乎 | 知乎专栏头图（暗色代码风） |
| `zhihu-review-data.png` | 知乎 | Review 数据对比（19% vs 70%） |
| `xiaohongshu-cover.png` | 小红书 | 粉橙色 3:4 竖版封面 |
| `xiaohongshu-6tips.png` | 小红书 | 6 技巧轮播卡片 |
| `xiaohongshu-fanout.png` | 小红书 | Fan-Out/Fan-In 可爱机器人图 |
| `x-thread-header.png` | X/Twitter | 英文 Thread 首图（16:9 暗色） |
| `x-fanout-fanin.png` | X/Twitter | 英文 Fan-Out/Fan-In 流程图 |

---

## 三、后续可做的事

### 3.1 发布
- [ ] 微信公众号：复制社媒版第一节，上传 `wechat-cover.png` 为封面
- [ ] 知乎：复制第二节，以自问自答形式发布
- [ ] 小红书：复制第三节，上传 3-4 张图做轮播
- [ ] X/Twitter：逐条发推，每条配对应图片
- [ ] 原文发布到 papers.kevinten10.com（已在仓库中）

### 3.2 可能的改进
- [ ] 小红书缺少一张「错误 vs 正确做法对比卡」（生成时 MCP 多次断连未成功）
- [ ] X/Twitter 缺少一张英文金句卡（minimax CDN 网络不通未下载成功）
- [ ] 可考虑为每个 Skills 模板单独生成配图
- [ ] 文章可翻译为完整英文版发布到 Medium/Dev.to

### 3.3 运行站点
```bash
cd /Users/kevinten/projects/Papers
npm run build   # 重新生成知识库索引
npm run dev     # 本地预览 http://localhost:8000
```

---

## 四、工具链记录

| 工具 | 用途 | 备注 |
|:-----|:-----|:-----|
| `mcp__mcp-image__generate_image` | 图片生成（Gemini） | 生成 18 张图，偶尔断连需重试 |
| `mcp__minimax-mcp__text_to_image` | 图片生成（Minimax） | CDN 在本地网络不可达，仅生成了 URL |
| Claude Code 主对话 | 文章撰写 + 社媒改编 | 全程对话式完成 |

---

*生成时间：2026-03-11 23:40*
