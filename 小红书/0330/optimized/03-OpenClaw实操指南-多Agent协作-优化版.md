---
status: optimized
created: 2026-03-30
optimized: 2026-04-06
target: 小红书
topic: OpenClaw 多 Agent 搭建实操，无VPN方案
---

# 🛠️ 没VPN、没Claude Code，怎么跑多Agent协作？

配置低的旧电脑，装不了Claude Code，也用不了海外API。

我用Qwen CLI + GLM Coding Plan，在三台旧笔记本上搭了一套OpenClaw协作系统。14天跑了20个项目，今天聊点真正有用的坑。

## ⚠️ 踩过的4个坑

**坑1：Agent之间上下文不共享**
→ GitHub仓库当"共享记忆"，做任何事前先pull，做完立刻push

**坑2：任务冲突**
→ 严格按分工，用Issue认领，冲突时孔明裁决

**坑3：知识不沉淀**
→ 建knowledge-base目录，每个项目做完提取关键经验

**坑4：没有监控=失控**
→ health-check.sh检查系统状态

## ✅ 适合谁

**适合**：有多台旧设备、做并行项目、愿意花10分钟写SOUL.md
**不适合**：想一键开箱即用

管理AI和管理人逻辑一样——分工、协作、沉淀、把关。

---

💬 **你试过让多个AI协作吗？最大困难是什么？**

#OpenClaw #AI协作 #独立开发者 #多Agent #Qwen #GLM
