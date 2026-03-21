# 🚀 Kevin's Advanced Knowledge Base

> 个人技术知识库 - 每天至少一小时阅读学术和业界论文，持续学习相关程序知识

[![Live Site](https://img.shields.io/badge/Site-Live-brightgreen)](https://paper.rxcloud.group)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.txt)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/kevinten10/Papers/deploy.yml?label=Deploy)](https://github.com/kevinten10/Papers/actions)
[![Articles](https://img.shields.io/badge/Articles-170+-orange.svg)](#)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-20+-purple.svg)](#)

## 🎯 项目简介

这是一个现代化的个人技术知识库系统，收录了Java、大数据、并发编程、数据库、架构设计等多个技术领域的学习笔记、论文研读和项目实践。

### ✨ 核心特性

- 🚀 **智能知识库系统** - AI驱动的现代化知识管理
- 📚 **多种浏览方式** - 传统分类浏览 + 智能搜索
- 📄 **专业阅读器** - Markdown渲染 + 代码高亮
- 🎨 **现代化界面** - 响应式设计 + 优雅交互
- 🔍 **智能搜索** - 全文搜索 + 标签过滤
- 📊 **统计分析** - 学习进度 + 知识图谱

## 🌐 在线访问

### 主要入口
- **🏠 首页**: [https://paper.rxcloud.group](https://paper.rxcloud.group)
- **🎯 导航中心**: [https://paper.rxcloud.group/navigation.html](https://paper.rxcloud.group/navigation.html)

### 功能页面
- **🚀 智能知识库**: [knowledge-base.html](https://paper.rxcloud.group/knowledge-base.html)
- **📚 传统浏览**: [articles.html](https://paper.rxcloud.group/articles.html)
- **📄 文章阅读器**: [viewer.html](https://paper.rxcloud.group/viewer.html)
- **🕸️ 知识图谱**: [knowledge-graph.html](https://paper.rxcloud.group/knowledge-graph.html)

## 📚 知识体系

### 🔥 核心技术领域

| 领域 | 文章数 | 主要内容 |
|------|--------|----------|
| ☕ **Java技术** | 30+ | JDK新特性、JVM调优、源码解析 |
| 🔄 **并发编程** | 25+ | AQS、线程池、锁机制、无锁编程 |
| 📊 **大数据** | 20+ | Hadoop、Spark、Flink、实时计算 |
| 💾 **数据库** | 15+ | MySQL、Redis、分布式存储 |
| 🏗️ **架构设计** | 18+ | 微服务、分布式系统、设计模式 |
| ⚡ **响应式编程** | 12+ | RxJava、WebFlux、异步编程 |
| 🐳 **容器化** | 10+ | Docker、Kubernetes、DevOps |
| 🤖 **AI/ML** | 8+ | 机器学习、深度学习、算法 |

### 📖 学习资源类型

- **📝 技术博客** - 原创技术文章和学习心得
- **📄 论文研读** - 学术论文解读和分析
- **🔬 源码分析** - 开源框架源码深度解析
- **💡 实践项目** - 技术实践和项目总结
- **📚 读书笔记** - 技术书籍阅读笔记
- **🎯 面试准备** - 技术面试题目和解答

## 🛠️ 技术架构

### 前端技术栈
- **HTML5 + CSS3** - 现代化网页标准
- **JavaScript ES6+** - 交互逻辑实现
- **Marked.js** - Markdown渲染引擎
- **Highlight.js** - 代码语法高亮
- **响应式设计** - 适配各种设备

### 部署方案
- **Vercel** - 主要部署平台
- **GitHub Actions** - 自动化CI/CD部署
- **GitHub Pages** - 备用静态网站托管
- **HTTPS安全** - 安全访问保障

## 🚀 快速开始

### 本地运行
```bash
# 克隆仓库
git clone https://github.com/kevinten10/Papers.git

# 进入目录
cd Papers

# 启动本地服务器（可选）
python -m http.server 8000
# 或使用 Node.js
npx serve .

# 访问 http://localhost:8000
```

### 部署到GitHub Pages
项目已配置GitHub Actions自动部署：

1. **自动部署**: 推送到 `master` 分支时自动触发部署
2. **手动部署**: 在GitHub仓库的Actions页面手动触发
3. **自定义域名**: 已部署至 `paper.rxcloud.group`（Vercel托管）

**部署状态**: 查看 [GitHub Actions](https://github.com/kevinten10/Papers/actions)

### 文件结构
```
Papers/
├── index.html              # 主页
├── navigation.html          # 导航中心
├── knowledge-base.html      # 智能知识库
├── articles.html           # 传统文章浏览
├── viewer.html             # 文章阅读器
├── knowledge-graph.html    # 知识图谱可视化
├── assets/                 # 静态资源
│   ├── css/               # 样式文件
│   ├── js/                # JavaScript文件
│   └── fonts/             # 字体文件
├── images/                # 图片资源
├── 博客文章/               # 博客文章目录
├── article/               # 技术文章目录
├── Concurrent/            # 并发编程资料
├── Database/              # 数据库相关
└── ...                    # 其他技术领域
```

## 📈 更新日志

### 🚀 v2.1.0 (2026-01-12)
- 🤖 **GitHub Actions自动化部署**: 全自动CI/CD流程，推送即部署
- 📊 **智能知识库索引生成器**: 自动扫描138个文档，生成完整的知识索引
- 🔍 **增强搜索功能**: 支持全文搜索、标签过滤、智能分类
- 📱 **响应式设计优化**: 完美适配移动设备，提升用户体验
- 🔧 **SEO全面优化**: Meta标签、结构化数据、robots.txt、sitemap.xml
- 🎨 **现代化UI设计**: 优雅的视觉效果和交互体验
- 📝 **自动文档管理**: Node.js构建脚本，智能文档分类
- 🚀 **性能优化**: 加载速度提升，CDN加速支持
- 🔗 **favicon和图标**: 专业网站图标设计

### 🎉 v2.0.0 (2024-01)
- ✨ 全新智能知识库系统上线
- 🎨 界面全面重新设计，现代化视觉体验
- 🔍 增强搜索功能，支持全文检索
- 📱 完全响应式设计，完美适配移动端
- 📊 新增统计分析功能
- 🚀 性能优化，加载速度提升50%

### 📚 v1.0.0 (2023)
- 📝 基础文章分类浏览功能
- 📄 Markdown文章阅读器
- 🎯 GitHub Pages部署

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 贡献方式
1. **Fork** 本仓库
2. **创建** 特性分支 (`git checkout -b feature/AmazingFeature`)
3. **提交** 更改 (`git commit -m 'Add some AmazingFeature'`)
4. **推送** 到分支 (`git push origin feature/AmazingFeature`)
5. **创建** Pull Request

### 文章贡献
- 📝 原创技术文章
- 📄 论文解读分析
- 🔬 源码分析文档
- 💡 实践经验分享

## 📞 联系方式

- **GitHub**: [@kevinten10](https://github.com/kevinten10)
- **Email**: 596823919@qq.com
- **Website**: [Knowledge Base](https://paper.rxcloud.group)

## 📄 许可证

本项目采用 [MIT License](LICENSE.txt) 开源协议。

---

<div align="center">

**🌟 如果这个项目对你有帮助，请给个Star支持一下！**

[![Star History Chart](https://api.star-history.com/svg?repos=kevinten10/Papers&type=Date)](https://star-history.com/#kevinten10/Papers&Date)

</div>
