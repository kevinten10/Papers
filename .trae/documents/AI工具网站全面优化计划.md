## 优化计划概述

基于对现有代码的分析，我将进行以下五个方面的优化：

---

## 1. 雷达图/工具卡片 - 未使用工具样式区分

**问题**：Zed、Replit（IDE）、Aider、Cline（CLI）等工具用户未使用过，需要视觉区分

**解决方案**：
- 在 ToolCard.vue 中添加 `isUsed` 标识区分
- 未使用工具使用不同的背景色（如灰色/半透明）
- 添加"未体验"标签或角标
- 降低未使用工具的卡片透明度或添加特殊边框

**具体实现**：
```vue
// ToolCard.vue 修改
:class="[
  'group rounded-[40px] p-10 border transition-all duration-700',
  tool.isUsed 
    ? 'hover:-translate-y-3' // 使用过的正常悬浮
    : 'opacity-70 bg-slate-50/50', // 未使用的降低透明度
]"
```

**需要在 tools.json 中添加字段**：
```json
"isUsed": true/false
```

---

## 2. 大表对比 - 按维度分类展示

**问题**：GlobalTable.vue 当前是所有工具混在一个表中，不同类型工具特性不同无法有效对比

**解决方案**：
- 按 IDE / CLI / LLM / APP / DESKTOP 分类展示
- 每个分类使用适合该维度的对比字段

**各维度对比字段设计**：

### IDE 维度对比表
| 字段 | 说明 |
|-----|------|
| 工具名称 | + 厂商 |
| 核心模型 | Claude/GPT/自研等 |
| Agent能力 | ⭐评分 |
| 代码补全 | ⭐评分 |
| 重构能力 | ⭐评分 |
| 价格 | $/月 |
| 推荐指数 | ⭐⭐⭐⭐⭐ |

### CLI 维度对比表
| 字段 | 说明 |
|-----|------|
| 工具名称 | + 厂商 |
| 核心能力 | 推理/Git集成/批处理等 |
| 模型支持 | 多模型/单一模型 |
| 免费额度 | 请求数/天 |
| 价格 | $/月 |
| 推荐指数 | ⭐⭐⭐⭐⭐ |

### LLM 维度对比表
| 字段 | 说明 |
|-----|------|
| 模型名称 | + 厂商 |
| 上下文 | 128K/200K/1M等 |
| 推理能力 | ⭐评分 |
| 代码能力 | ⭐评分 |
| 中文支持 | ⭐评分 |
| 价格 | $/月 |
| 推荐指数 | ⭐⭐⭐⭐⭐ |

**实现方式**：
- 创建多个分表组件：IDETable.vue / CLITable.vue / LLMTable.vue
- 或使用 Tab 切换在一个组件内展示不同维度

---

## 3. 智能匹配 - 补充优化

**问题**：ToolMatcher.vue 当前匹配逻辑较简单，问题选项有限

**优化方案**：

### 3.1 增加更多匹配维度
- **编程语言偏好**：Python/JS/Java/Go/Rust等
- **团队规模**：个人/小团队/企业
- **隐私要求**：本地优先/云端接受
- **学习曲线**：接受陡峭/需要平缓

### 3.2 优化匹配算法
```javascript
// 更精细的匹配逻辑
if (answers.purpose === 'coding') {
  if (answers.language === 'python' && tool.tags.includes('Python强')) score += 2
  if (answers.scale === 'large' && tool.category === 'IDE') score += 2
  if (answers.privacy === 'local' && tool.tags.includes('本地部署')) score += 3
}
```

### 3.3 增加匹配结果解释
- 说明为什么推荐这个工具
- 展示匹配度百分比
- 提供"不适合我"反馈按钮

### 3.4 添加步骤
- Step 5: 编程语言偏好
- Step 6: 团队规模
- Step 7: 隐私要求

---

## 4. 工作流 - 补充优化

**问题**：WorkflowSection.vue 当前只有4个工作流，可以更丰富

**优化方案**：

### 4.1 新增工作流

**工作流5: 后端项目开发流**
```
1. 需求分析 (Claude/GPT)
2. 数据库设计 (Qoder Repo Wiki)
3. API接口开发 (Cursor/Trae)
4. 单元测试生成 (Aider)
5. 文档编写 (NotebookLM)
```

**工作流6: 前端页面开发流**
```
1. 设计稿理解 (Gemini Vision)
2. 组件开发 (Cursor Composer)
3. 样式调试 (Trae Solo)
4. 响应式适配 (Windsurf)
5. 性能优化 (Claude Code)
```

**工作流7: AI模型选型流**
```
1. 需求梳理 (DeepSeek)
2. 模型对比 (Perplexity)
3. POC验证 (Coze)
4. 成本评估 (DeepSeek)
5. 部署方案 (各平台CLI)
```

### 4.2 工作流卡片增强
- 添加预计时间
- 添加难度等级
- 添加推荐工具图标
- 添加"开始此工作流"按钮

### 4.3 交互式工作流
- 点击步骤可以展开详细说明
- 显示每个步骤的推荐Prompt
- 提供工具直达链接

---

## 5. 攻略 - 补充优化

**问题**：PricingSection.vue 当前只有3个档位，可以更详细

**优化方案**：

### 5.1 增加细分档位

**档位4: 学生/初学者 (¥0-30/月)**
- Trae CN版 (免费)
- Gemini CLI (免费)
- DeepSeek API (¥10-20)
- Coze 免费版

**档位5: 中级开发者 (¥50-100/