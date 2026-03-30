# 📝 Drafts - 草稿目录

这里是文章草稿的协作空间。

## 目录结构

```
drafts/
├── ideas/              # 💡 原始想法（自动优化）
│   ├── idea-1.md      # 状态: seed → growing → ready → draft
│   └── idea-2.md
├── 2026-03-25-topic-draft.md   # 📝 写作中的草稿
└── README.md
```

## 工作流程

```
你给想法 → ideas/ 记录 → 每小时自动优化 → drafts/ 草稿 → 定稿 → 发布
```

### 1. 💡 提交想法

告诉我你的想法，我会记录到 `ideas/` 目录：

```
"我想写一篇关于 AI Agent 架构的文章，主要讲..."
```

### 2. 🔄 自动优化

定时任务每小时检查想法，逐步完善：
- **seed** → 分析价值，提出扩展方向
- **growing** → 补充细节，整理大纲
- **ready** → 生成完整草稿

### 3. 📝 草稿写作

想法成熟后，自动创建草稿文件：
```
drafts/2026-03-25-topic-draft.md
```

### 4. ✅ 定稿发布

确认草稿后：
1. 移动到正式目录（如 `博客文章/Artificial/`）
2. 运行 `npm run build` 更新索引
3. 发布 Agent 按时间发布到各平台

## 想法文件格式

```markdown
---
status: seed | growing | ready | draft
created: 2026-03-25
updated: 2026-03-25
---

# [想法标题]

## 核心观点
[一句话描述]

## 背景/动机
[为什么想写]

## 想要涵盖的点
- 点 1
- 点 2

## 参考资料（可选）
- [链接]

## 目标读者（可选）
[谁会感兴趣]
```

## 草稿文件格式

```markdown
---
status: draft | review | final
created: 2026-03-25
updated: 2026-03-25
target: 掘金, 知乎, CSDN
---

# 文章标题

[完整文章内容]
```
