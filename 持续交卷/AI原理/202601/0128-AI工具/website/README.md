# AI 工具教学网站 - 开发文档

## 项目概述

基于 Vue 3 + Vite + Tailwind CSS 构建的 AI 工具选型与教学平台。

## 开发环境

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format

# 运行测试
npm run test
```

## 项目架构

### 目录结构

```
src/
├── components/          # 业务组件
│   ├── Common/          # 通用组件
│   │   ├── FunTag.vue      # 趣味评级标签
│   │   └── StarRating.vue  # 星级评分组件
│   ├── GlobalTable.vue     # 全局对比表格
│   ├── PricingSection.vue  # 定价攻略
│   ├── ToolCard.vue        # 工具卡片
│   ├── ToolMatcher.vue     # 智能匹配向导
│   └── WorkflowSection.vue # 工作流展示
├── composables/         # 组合式函数
│   ├── useTools.js         # 核心业务逻辑
│   └── __tests__/          # 测试文件
├── data/                # 静态数据
│   ├── schema.json         # 数据结构定义
│   └── tools.json          # 工具数据
├── App.vue              # 根组件
├── main.js              # 入口文件
└── style.css            # 全局样式
```

### 核心模块说明

#### useTools.js

核心组合式函数，提供以下功能：

- **搜索过滤**: 根据关键词、分类、版本筛选工具
- **对比功能**: 支持最多 3 个工具对比
- **智能匹配**: 4 步问答推荐工具组合
- **主题切换**: 亮色/暗色模式

```javascript
const {
  searchQuery,        // 搜索关键词
  selectedCategory,   // 选中分类
  selectedVersion,    // 选中版本
  isDarkMode,         // 暗黑模式状态
  compareSelection,   // 对比选中项
  filteredTools,      // 过滤后的工具列表
  toggleCompare,      // 切换对比
  matchResult,        // 匹配结果
  resetMatcher        // 重置匹配
} = useTools()
```

#### 数据结构

工具数据遵循 schema.json 定义的结构：

```typescript
interface Tool {
  id: string
  name: string
  category: 'IDE' | 'CLI' | 'LLM' | 'APP'
  developer: string
  versions: Version[]
  pros: string[]
  cons: string[]
  best_for: string
  fun_ranking: string
  personal_experience: {
    rating: number
    insights: string
    pitfalls: string[]
  }
  swot: {
    S: string
    W: string
    O: string
    T: string
  }
  tags: string[]
}

interface Version {
  type: 'CN' | 'Global'
  pricing: string
  models: string
  link: string
}
```

## 组件规范

### 组件命名

- 使用 PascalCase
- 语义化命名，如 `ToolCard`、`GlobalTable`

### Props 定义

```javascript
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
```

### Emits 定义

```javascript
defineEmits(['toggle-compare', 'update:modelValue'])
```

## 样式规范

### Tailwind 使用原则

1. **优先使用工具类**: 大部分样式通过 Tailwind 工具类实现
2. **复杂样式使用 @apply**: 在 style 标签中使用 @apply 组合
3. **主题变量**: 使用 CSS 变量支持暗黑模式

### 暗黑模式实现

```vue
<div :class="[
  'base-classes',
  isDarkMode ? 'dark-classes' : 'light-classes'
]">
```

### 常用样式模式

```css
/* 卡片样式 */
.card {
  @apply rounded-[40px] p-10 border transition-all duration-700;
}

/* 玻璃态效果 */
.glass {
  @apply backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80;
}

/* 渐变文字 */
.gradient-text {
  @apply text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500;
}
```

## 数据管理

### 添加新工具

1. 在 `src/data/tools.json` 中添加工具数据
2. 确保数据符合 schema.json 结构
3. 更新相关分类和标签

### 数据验证

```bash
# 验证 JSON 格式
node -e "JSON.parse(require('fs').readFileSync('src/data/tools.json'))"
```

## 测试规范

### 测试文件位置

测试文件放在 `__tests__` 目录下，与被测试文件同级：

```
composables/
├── useTools.js
└── __tests__/
    └── useTools.spec.js
```

### 测试编写原则

1. 测试业务逻辑而非实现细节
2. 使用描述性的测试用例名称
3. 保持测试独立，不相互依赖

```javascript
describe('useTools', () => {
  it('should filter tools by search query', () => {
    const { searchQuery, filteredTools } = useTools()
    searchQuery.value = 'Cursor'
    expect(filteredTools.value.some(t => t.name.includes('Cursor'))).toBe(true)
  })
})
```

## 性能优化

### 已实施的优化

1. **计算属性缓存**: 使用 computed 缓存过滤结果
2. **条件渲染**: 使用 v-if/v-show 控制渲染
3. **动画优化**: 使用 CSS transform 和 opacity

### 待优化项

- [ ] 虚拟滚动（大数据列表）
- [ ] 图片懒加载
- [ ] 路由懒加载

## 部署指南

### Docker 部署

```bash
# 构建镜像
docker build -t ai-tools-site .

# 运行容器
docker run -d -p 80:80 --name ai-tools-site ai-tools-site
```

### 手动部署

```bash
# 构建
npm run build

# 部署 dist 目录到 Web 服务器
```

## 常见问题

### Q: 如何添加新的工具分类？

A: 修改 `useTools.js` 中的 `categories` 数组，并在组件中添加对应的图标映射。

### Q: 如何修改主题颜色？

A: 修改 `tailwind.config.js` 中的 colors 配置和 `style.css` 中的 CSS 变量。

### Q: 如何添加新的工作流？

A: 在 `WorkflowSection.vue` 中的 `workflows` 数组添加新的工作流对象。

## 更新日志

查看项目根目录的 [CHANGELOG.md](../CHANGELOG.md) 了解版本历史。

## 贡献指南

查看项目根目录的 [CONTRIBUTING.md](../CONTRIBUTING.md) 了解如何贡献代码。
