# AI 工具教学网站建设方案 (2026 增强版)

基于您的反馈，我将方案优化为**“数据驱动型”架构**，以确保极致的可扩展性，并大幅扩充初始覆盖的工具范围。

## 1. 高可扩展架构设计 (Extensibility First)
*   **配置化内容管理**: 采用 `Content-as-Data` 模式。所有工具信息、模型参数、对比数据将存储在结构化的 JSON/Markdown 文件中。
*   **动态渲染引擎**: 网站前端将根据数据文件自动生成页面。未来新增工具只需在 `data/` 目录下新增一个文件，无需修改代码逻辑。
*   **标准化 Schema**: 为所有 AI 工具定义统一的属性（分类、定价模型、核心优势、个人评分、教程路径），确保对比的一致性。

## 2. 初始覆盖范围 (Comprehensive Initial Coverage)
我将一次性集成超过 30 款主流 AI 工具与模型，涵盖：
*   **AI IDE (12+款)**: Cursor, Windsurf, Trae, Qoder, Codebuddy, Antigravity, Kiro, Zed, Replit, VS Code+Copilot, JetBrains AI, Sourcegraph Cody, Continue.
*   **AI CLI (8+款)**: Claude Code, OpenAI Codex CLI, Aider, Gemini CLI, Qwen CLI, Cline, OpenCode, OpenHands.
*   **LLM 模型 (10+款)**: GPT-4o/o3/o4, Claude 3.5/4.5 系列, Gemini 2.5/3 系列, DeepSeek V3/R1, Qwen 3, Llama 3.3, Grok 3.
*   **垂类与辅助应用 (10+款)**: NotebookLM (知识库), Nano Banana (图示), Perplexity (搜索), Coze (智能体), Meshy (3D), Kling/Sora (视频), 氢离子 (医疗) 等。

## 3. 核心功能模块
1.  **AI 工具雷达**: 按分类展示所有工具，支持多维度过滤（免费/付费、国产/海外、IDE/CLI）。
2.  **选型对比矩阵**: 动态生成的对比表，支持横向对比不同工具的上下文长度、支持模型、计费模式等。
3.  **场景化实战**: “我想写个网页”、“我想重构后端”、“我想做个视频”等场景对应的推荐工具链路。
4.  **订阅与成本指南**: 汇总各大平台的 Pro/Team/Enterprise 定价及“最省钱组合”。

## 4. 技术栈实现
*   **前端**: Vue 3 (Composition API) + Vite + Tailwind CSS。
*   **数据层**: 采用本地 JSON/Markdown，支持静态部署 (SSG)，确保极致的加载速度和极低的维护成本。
*   **自动化**: 编写脚本辅助从您的调研文档中提取并格式化数据。

## 5. 任务清单 (Todolist)
1.  **[P0] 数据建模**: 定义工具与模型的标准化 JSON Schema。
2.  **[P0] 资料大提炼**: 遍历所有调研文档，将 30+ 工具信息结构化录入。
3.  **[P1] 网站开发**: 搭建基于 Vue 3 的动态展示模板。
4.  **[P1] 智能选型器**: 开发“Tool Matcher”互动组件。
5.  **[P2] 个人经验集成**: 将您的个人避坑指南与偏好注入到对应工具的数据项中。

**您可以先确认此方案。确认后我将立即开始 30+ 工具的数据提取与项目初始化。**
