# 🚀 使用 MCP 上传微信公众号文章规则

## 📋 概述

本文档记录了使用 [wenyan-mcp](https://github.com/caol64/wenyan-mcp) 工具将 `持续交卷` 项目中的 Markdown 文章发布到微信公众号的完整流程。

`wenyan-mcp` 是一个基于 Model Context Protocol (MCP) 的服务器组件，可以让 AI 自动将 Markdown 文章排版后发布至微信公众号草稿箱。

## 🔧 环境配置

### 方式一：本地安装（推荐）

```bash
npm install -g @wenyan-md/mcp
```

### 方式二：Docker 运行

```bash
docker pull caol64/wenyan-mcp
```

### MCP 客户端配置

在你的 MCP 配置文件中添加以下内容：

```json
{
  "mcpServers": {
    "wenyan-mcp": {
      "name": "公众号助手",
      "command": "wenyan-mcp",
      "env": {
        "WECHAT_APP_ID": "your_app_id",
        "WECHAT_APP_SECRET": "your_app_secret"
      }
    }
  }
}
```

**环境变量说明：**

- `WECHAT_APP_ID`: 微信公众号平台的 App ID
- `WECHAT_APP_SECRET`: 微信平台的 App Secret

## 📝 文章格式要求

### Frontmatter 配置

在每篇文章开头添加 frontmatter：

```yaml
---
title: 文章标题
cover: https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop&crop=center
---
```

**字段说明：**

- `title`: 文章标题，必填
- `cover`: 封面图片链接，支持本地路径和网络图片

### 推荐封面图片

根据 `持续交卷` 项目主题，推荐使用以下封面图片：

```text
https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop&crop=center
```

这张图片体现了知识积累和智慧启发的主题，完美契合持续学习的理念。

## 🎨 主题选择

wenyan-mcp 支持多种内置主题：

- `default`: 经典干净布局，适合长篇文章阅读
- `orangeheart`: 温暖橙色调，优雅大方
- `rainbow`: 彩色生动，清爽布局
- `lapis`: 冷色调，简洁清新
- `pie`: 现代锐利，时尚风格
- `maize`: 浅黄色调，柔和舒适
- `purple`: 简洁优雅，微紫色调
- `phycat`: 薄荷绿，清晰层次

**推荐选择：**

- 技术类文章：`default` 或 `lapis`
- 学习笔记：`maize` 或 `phycat`
- 综合内容：`pie` 或 `rainbow`

## 📤 上传流程

### 步骤1：准备文章

确保文章符合以下要求：

- 使用 Markdown 格式
- 添加完整的 frontmatter
- 图片路径正确（支持本地和网络路径）
- 内容结构清晰

### 步骤2：调用 MCP 工具

使用以下命令上传文章：

```bash
# 方式1：直接使用 MCP
mcp_wenyan-mcp_publish_article content="文章内容" theme_id="default"

# 方式2：通过 AI 助手调用
@wenyan-mcp 上传文章：持续交卷/rule.md default
```

## 🎯 快速开始

### 示例：上传持续交卷主规则

```bash
# 读取并上传 rule.md
mcp_wenyan-mcp_publish_article content="$(cat 持续交卷/rule.md)" theme_id="default"
```

### 示例：上传算法学习规则

```bash
# 读取并上传算法规则
mcp_wenyan-mcp_publish_article content="$(cat 持续交卷/算法/rule.md)" theme_id="lapis"
```

### 📚 实际案例：英语资讯文章处理与上传流程

#### 案例背景
2025年12月24日，使用wenyan-mcp成功上传一篇英语资讯学习总结文章。

#### 完整流程

**步骤1：文章内容处理**
- 原始文章：简单的AI营销笔记（24.md）
- 处理方式：按照`持续交卷/英语资讯/rule.md`规则整理
- 转换内容：从简单笔记转换为规范的英语学习总结

**步骤2：格式标准化**
```markdown
---
title: 2025-12-24 - Understanding AI Platforms in Marketing
cover: https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop&crop=center
---

# 2025-12-24 - Understanding AI Platforms in Marketing

## 📄 文章信息
- **原文标题**: AI Platforms Revolutionizing Marketing Communications
- **来源**: TechCrunch / Marketing Technology Insights
- **阅读日期**: 2025-12-24
- **文章链接**: https://techcrunch.com/ai-marketing-platforms-2025

## 🎯 核心要点 (Key Points)
[4个核心观点总结]

## 💡 个人见解 (My Thoughts)
[个人思考内容]

## 📚 新学词汇 (New Vocabulary)
[3个专业词汇学习]

## 🔍 语法学习 (Grammar Notes)
[语法结构分析]

## 💭 应用思考 (Practical Applications)
[实际应用思考]
```

**步骤3：图片要求处理**
- 问题：微信公众号要求文章必须包含图片
- 解决方案：在正文中添加至少一张图片
- 示例：
```markdown
![AI Marketing Technology](https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&crop=center)
```

**步骤4：上传执行**
```bash
# 使用lapis主题（技术类文章推荐）
mcp_wenyan-mcp_publish_article content="[完整文章内容]" theme_id="lapis"
```

**步骤5：结果确认**
- 状态：✅ 成功发布到草稿箱
- 媒体ID：`x6O7RRF01Hjdx0XQ1RztQPX0YD97IDmUUy2Eww8QgDAv9hVUF_uqGhTIetzYQb-L`

#### 遇到的问题及解决方案

**问题1：IP白名单限制**
- 错误：`invalid ip xxx.xxx.xxx.xxx not in whitelist`
- 原因：阿里云Serverless使用动态IP
- 解决：配置微信公众号IP白名单，或使用固定IP服务

**问题2：图片要求**
- 错误：`你必须指定一张封面图或者在正文中至少出现一张图片`
- 解决：在文章正文中插入至少一张图片

**问题3：网络连接问题**
- 现象：`fetch failed` 或 `Connection closed`
- 解决：等待网络恢复，检查Serverless配置

#### 成功要点总结
1. **内容质量**：按照规则完整整理，包含所有必要部分
2. **格式规范**：正确的frontmatter和Markdown语法
3. **图片处理**：满足微信公众号的图片要求
4. **主题选择**：根据内容类型选择合适的主题
5. **问题排查**：系统性解决技术问题

### 步骤3：确认发布

文章将发布到微信公众号草稿箱，获得媒体ID确认成功。

## 📂 项目文章路径

持续交卷项目的文章位于以下目录：

- `持续交卷/rule.md` - 项目主规则文档
- `持续交卷/算法/rule.md` - 算法学习规则
- `持续交卷/英语资讯/rule.md` - 英语资讯规则
- `持续交卷/技术写作/rule.md` - 技术写作规则
- `持续交卷/阅读笔记/rule.md` - 阅读笔记规则

## ✅ 最佳实践

### 内容优化

- **标题优化**：简洁明了，包含关键词
- **结构清晰**：使用合适的标题层级
- **图片处理**：确保图片清晰，格式合适
- **链接检查**：验证所有链接有效性

### 格式处理

- **Frontmatter**：确保每篇文章都有完整的 frontmatter
- **编码格式**：使用 UTF-8 编码
- **特殊字符**：注意微信公众号不支持的字符
- **长度控制**：单篇文章建议 3000-8000 字

### 发布策略

- **测试发布**：先在草稿箱测试效果
- **定时发布**：选择合适的发布时间
- **数据监控**：关注阅读量和用户反馈
- **内容规划**：制定长期的内容发布计划

## 🔍 常见问题

### Q: 图片上传失败

**A**: 检查图片路径是否正确，确保服务器有访问权限。Docker 模式下需正确挂载目录。

### Q: 文章格式错乱

**A**: 检查 Markdown 语法，使用 wenyan-mcp 支持的格式。避免复杂的表格和特殊符号。

### Q: 主题效果不佳

**A**: 尝试其他主题样式，不同主题对不同类型内容效果不同。

### Q: 发布频率限制

**A**: 微信公众号每天可发布1篇文章，注意频率控制。

## 🛠️ 调试工具

使用 Inspector 进行调试：

```bash
npx @modelcontextprotocol/inspector
```

访问调试页面测试 MCP 服务器连接和功能。

## 📊 使用统计

- 记录每次发布的数据
- 分析阅读量和用户反馈
- 优化内容策略和发布时间

## 🤔 流程反思与优化建议

### 📈 成功经验总结

**系统思维的应用**：
- 将简单笔记转换为结构化知识产品
- 从"有内容"到"有价值"的转化
- 自动化流程替代人工重复劳动

**技术栈整合**：
- MCP协议实现AI与外部工具的无缝对接
- Markdown作为通用内容格式
- 云服务提供弹性计算资源

**质量保证机制**：
- 标准化模板确保内容一致性
- 自动检查机制避免格式错误
- 逐步验证确保每步都正确

### 🔧 发现的问题与解决方案

**动态IP挑战**：
- Serverless环境的IP动态分配特性
- 需要在目标平台预先配置IP白名单
- 建议使用固定IP服务或定期更新白名单

**依赖服务稳定性**：
- MCP服务器可能存在连接问题
- 需要备用方案（手动上传）
- 建立监控和重试机制

**内容处理复杂度**：
- 从原始内容到发布内容的完整链路
- 需要模板化处理流程
- 考虑自动化内容处理脚本

### 🚀 未来优化方向

**智能化升级**：
- 自动识别内容类型选择主题
- 智能图片选择和插入
- 内容质量自动评估

**稳定性提升**：
- 多环境部署（本地+云端）
- 自动故障转移机制
- 完善的错误处理和重试逻辑

**效率优化**：
- 批量处理能力
- 定时自动发布
- 内容复用和模板继承

### 💡 核心洞察

这次上传流程体现了现代内容创作的新范式：
- **AI不是替代，而是增强**：AI帮助结构化和优化内容，但核心价值仍来自人的思考
- **自动化不等于智能化**：需要人在流程中进行关键决策和质量把关
- **系统思维创造价值**：单个工具的价值有限，系统性整合才能创造最大价值

---

*本文档持续更新，如有问题请及时反馈。*
