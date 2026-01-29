# 贡献指南

感谢您对 AI 工具全书项目的关注！我们欢迎所有形式的贡献，包括但不限于：

- 提交 Bug 报告
- 提出新功能建议
- 改进文档
- 提交代码修复或新功能
- 分享使用经验

## 开发流程

### 1. Fork 和克隆

```bash
# Fork 本仓库到您的 GitHub 账号
# 然后克隆到本地
git clone https://github.com/YOUR_USERNAME/ai-tools-teaching.git
cd ai-tools-teaching/website
```

### 2. 安装依赖

```bash
npm install
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/bug-description
```

### 4. 开发和测试

```bash
# 启动开发服务器
npm run dev

# 运行测试
npm run test

# 代码检查
npm run lint

# 代码格式化
npm run format
```

### 5. 提交更改

```bash
git add .
git commit -m "feat: 添加新功能描述"
git push origin feature/your-feature-name
```

### 6. 创建 Pull Request

在 GitHub 上创建 Pull Request，描述您的更改内容。

## 代码规范

### Vue 组件规范

1. **组件命名**: 使用 PascalCase，如 `ToolCard.vue`
2. **Props 定义**: 必须指定类型和默认值
3. **Emits 定义**: 明确声明所有事件

```vue
<script setup>
defineProps({
  tool: {
    type: Object,
    required: true
  },
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-compare'])
</script>
```

### JavaScript 规范

1. 使用 ES6+ 语法
2. 优先使用 `const`，必要时使用 `let`，避免使用 `var`
3. 使用箭头函数
4. 使用模板字符串

```javascript
// 好的示例
const filteredTools = computed(() => {
  return tools.value.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesSearch
  })
})

// 不好的示例
var result = tools.filter(function(t) {
  return t.name.indexOf(query) > -1
})
```

### 样式规范

1. 优先使用 Tailwind CSS 工具类
2. 复杂样式使用 `@apply`
3. 保持类名顺序一致：布局 -> 间距 -> 外观 -> 交互

```vue
<!-- 好的示例 -->
<div class="flex items-center gap-4 px-6 py-4 bg-white rounded-xl hover:shadow-lg transition-shadow">

<!-- 不好的示例 -->
<div class="bg-white px-6 py-4 hover:shadow-lg flex rounded-xl transition-shadow items-center gap-4">
```

## 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```
feat(tools): 添加 Windsurf IDE 数据

添加 Windsurf IDE 的详细信息，包括：
- 定价模型
- 支持的模型
- SWOT 分析

fix(ui): 修复暗黑模式下卡片边框颜色

docs(readme): 更新部署指南
```

## 数据贡献指南

### 添加新工具

1. 在 `website/src/data/tools.json` 中添加工具数据
2. 确保数据符合 `schema.json` 定义的结构
3. 验证 JSON 格式正确
4. 更新相关分类和标签

### 数据字段说明

```json
{
  "id": "工具唯一标识",
  "name": "工具名称",
  "category": "分类 (IDE/CLI/LLM/APP)",
  "developer": "开发商",
  "versions": [
    {
      "type": "版本类型 (CN/Global)",
      "pricing": "定价信息",
      "models": "支持模型",
      "link": "官方网站链接"
    }
  ],
  "pros": ["优势列表"],
  "cons": ["劣势列表"],
  "best_for": "适用场景",
  "fun_ranking": "评级 (夯/稳/中)",
  "personal_experience": {
    "rating": "评分 (1-5)",
    "insights": "使用心得",
    "pitfalls": ["注意事项"]
  },
  "swot": {
    "S": "优势",
    "W": "劣势",
    "O": "机会",
    "T": "威胁"
  },
  "tags": ["标签列表"]
}
```

## 测试要求

- 新功能必须包含测试用例
- 确保所有测试通过
- 保持测试覆盖率

```bash
# 运行测试
npm run test

# 运行测试并查看覆盖率
npm run test -- --coverage
```

## 文档更新

- 更新相关 README 文档
- 更新 CHANGELOG.md
- 添加必要的代码注释

## 行为准则

- 尊重所有贡献者
- 接受建设性的批评
- 关注对社区最有利的事情
- 展现同理心

## 问题报告

### Bug 报告

请包含以下信息：

1. 问题描述
2. 复现步骤
3. 期望行为
4. 实际行为
5. 环境信息（浏览器、操作系统等）
6. 截图（如果适用）

### 功能建议

请包含以下信息：

1. 功能描述
2. 使用场景
3. 预期效果
4. 可能的实现方案（可选）

## 联系方式

如有问题，请通过以下方式联系：

- 提交 Issue
- 发送邮件至项目维护者

感谢您的贡献！
