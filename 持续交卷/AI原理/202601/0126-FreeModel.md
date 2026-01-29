## 2026-01 仍可“免费用”的 LLM / AI Coding 工具全对比（含选型建议）

> 目标：把你列出的 “free 清单” 拆成 **工具层（体验/工作流）× 模型层（能力）× 免费层（配额/限制/隐私）**，最后输出一个你能直接用的选型结论。
>
> 时间基准：**2026-01-26**（以官方文档/公告为主，第三方评测只做参考）。

---

## 先给结论：怎么选最划算（按你的“免费优先”）

### 1）“稳定免费 + 能干正事”的组合（优先推荐）

- **主力（通用编码 + 长上下文）**：**Gemini CLI（Gemini 2.5 Pro）**
  - 免费额度大，且强调“很少会触顶”，**1M context** 对“读仓库/长文档/多文件定位问题”优势巨大。
- **主力（中文/代码 + terminal agent）**：**Qwen Code（Qwen OAuth 免费档）**
  - 免费额度明确，CLI 体验接近 Claude Code；中文开发语境很顺手。
- **副驾（IDE 内补全 + 少量多模型体验）**：**GitHub Copilot Free**
  - 适合作为“随手补全”和“低频对话”入口；但 **Free 的 premium request 很少**，别指望用它跑重任务。

> 如果你只想装 2 个：**Gemini CLI + Qwen Code**。

### 2）“想要 Claude 级别编码，但又想尽量省钱”

- **Claude Code + Kimi K2（路由/兼容接入）**：更像“低价替代”，**不等于官方长期免费**（多数情况下取决于 Kimi 账户/平台赠送额度/促销）。
  - 适合：你已经习惯 Claude Code 的 workflow，但要把“执行成本”打下来。

### 3）“国内免费力度大，但要非常在意隐私/合规”

- **Trae（国内版 Doubao/DeepSeek；国际版含 Claude）**
  - 体验好、可能“看起来很免费”，但涉及 **上传计算 embeddings** 等条款风险点；如果你的代码涉及商业机密/公司源代码，需要慎用或只用在非敏感仓库。

### 4）“想把开源/多供应商模型接到一个 agent 框架里（可玩性高）”

- **OpenCode（多 provider） + GLM / MiniMax 等**
  - 价值：把不同供应商模型（GLM、MiniMax…）接到同一套 agent、IDE 快捷键和 GitHub workflow。
  - 现实：**是否免费**更多取决于“模型供应商的活动/套餐”，不是 OpenCode 本身保证。

---

## 系统化拆解：你选的不是模型，而是一个“生产系统”

把 AI 编程看成一个系统，至少有三层：

- **工具层（Workflow）**：IDE/CLI、是否支持 agent、多文件改动、GitHub 工作流、可否接 MCP、是否可控（审批模式/沙箱/权限）。
- **模型层（能力）**：代码能力、推理稳定性、工具调用、长上下文、中文、前端审美、速度。
- **免费层（约束）**：配额/限速、是否“随时可能改”、是否需要绑账号/地区、数据如何处理（是否上传源码/embedding）。

选型的关键不是“谁分高”，而是：**你的瓶颈在哪一层**。

---

## 统一评估维度（后面所有对比都用这套口径）

- **代码能力（写/改/重构）**：能不能稳定做多文件改动、跑完一条任务链（读代码→定位→改→补测试）。
- **推理稳定性**：复杂任务是否会“跑偏”、是否会自相矛盾、是否会把没做的事说成做了。
- **工具/Agent 能力**：能否可靠执行 shell、搜索、读文件、调用工具（function calling）。
- **长上下文**：能否吃下大仓库/长日志/长 PR 讨论（context window + 实际可用性）。
- **速度/交互成本**：响应快不快、失败重试是否痛苦。
- **中文与本地生态**：中文需求描述、中文注释、国内框架/文档理解是否顺。
- **隐私与合规**：是否上传源码、是否只上传 embeddings、是否允许关闭数据上传/训练。
- **免费可持续性**：是“明确免费配额”，还是“促销/不承诺/随时变”。

---

## 你的 free 清单逐项核验与对比（2026-01）

> 表格里“免费”默认指：**不付费也能用**。但要注意：很多产品是“免费配额/credits”，不是“无限免费”。

### 横向对比表（高信号版）

| 入口 | 你列的 free 模型/模式 | 免费额度/限制（能核验的写死；不能核验的标注） | 主要优势 | 主要风险/坑 | 适合你怎么用 |
|---|---|---|---|---|---|
| **Gemini CLI** | Gemini 2.5（官方表述：2.5 Pro） | 个人 Google 登录：**1000 req/天、60 req/分钟**（免费） | **1M context**、CLI agent、可接 MCP、适合大仓库理解 | 仍有“请求数”上限；模型由 CLI 可能自动选族内模型 | “读仓库/长日志/多文件定位 + 生成修复方案”当主力 |
| **Qwen Code（你称 Qwen CLI）** | Qwen Coder（官方：Qwen OAuth 推荐） | Qwen OAuth：**2000 req/天、60 req/分钟**（免费） | 中文强、terminal agent workflow 完整、开源可查 | 免费是配额制；企业/CI 场景要走 API key | “中文需求→多文件修改→补测试”当主力 |
| **GitHub Copilot Free** | 你标“？”（实际：Free 有固定限额） | **2000 completions/月 + 50 premium requests/月** | IDE 内体验稳；可体验部分模型/能力 | premium requests 太少；Free 可用模型不是“全开” | 作为“IDE 补全副驾”，重任务交给 CLI 主力 |
| **Trae** | 你列 Doubao-Code（官方：分国内/国际） | 多数报道为“免费且力度大”（需关注政策变化） | IDE 体验强，国内生态顺；可切 DeepSeek 等 | **隐私条款**（embedding/上传）对敏感代码不友好 | 用于“非敏感仓库”的快速原型/前端页面生成 |
| **Kiro** | 你标“？”（官方：Auto + Sonnet 4） | **Free：50 credits/月**；新用户 **500 credits/14天** | spec-driven 工作流（需求→设计→任务）强 | Free credits 很少；更像“偶尔用” | 用来做“需求拆解/规格文档/任务分解”，不当主力写码 |
| **OpenCode** | GLM-4.7、MiniMax M2.1、（big-pickle 未核验） | OpenCode 本身开源；模型费用看 provider（Z.AI/MiniMax…） | 多 provider 接入 + GitHub workflow，工程化强 | “免费”取决于供应商套餐/活动；Share 会同步对话到服务器 | 当“统一 agent 外壳”，把不同模型接进来做重活 |
| **Cursor** | Auto / Composer 1 / Grok Code（你列） | 免费限制**难以写死**（官方页面可见模型，但限额常动态） | 交互好、IDE 内多模型切换、agent/Composer 体验成熟 | 免费政策波动；限额/排队随供需变化 | 作为“体验最顺的 IDE”，但别把“免费主力”押它一个 |
| **Claude Code** | 你列 Kimi-K2 | 取决于 Kimi API/赠送额度；Claude Code 本体不保证“免费无限” | workflow 好；接入兼容 API 可替换模型 | 不同供应商稳定性/延迟/封控不同 | 你习惯 Claude Code 时，用它当“壳”，模型做路由 |
| **Qoder** | 你列 qwen-coder | 官方文档偏“分档位”而非公开具体模型名 | 产品化能力（agent/文档/任务）可能不错 | **模型黑箱**，很难做“模型层选型” | 如果你要“明确用 Qwen Coder”，优先用 Qwen Code CLI |
| **CodeBuddy（腾讯）** | 你标“？” | 支持 `models.json` 自定义 OpenAI 兼容接口；内置模型名单未在该页给出 | 能把你自己的模型/代理接进去（BYOK 思路） | 需要自己维护 key/端点；内置模型与免费策略需看区域/版本 | 适合你有“自建/代理模型”时做 IDE 入口 |

---

## 关键事实（可引用/可复查）

### Gemini CLI（免费额度与模型）

- **免费额度**：个人 Google 登录可免费使用，**1000 次/天、60 次/分钟**（Gemini CLI 文档）
- **模型**：官方公告明确写到“个人账号可免费访问 **Gemini 2.5 Pro**”，且强调 **1M token context**

来源：
- `https://google-gemini.github.io/gemini-cli/docs/quota-and-pricing.html`
- `https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/`

### Qwen Code（免费额度）

- **Qwen OAuth（推荐 & 免费）**：**2000 次/天、60 次/分钟**；文档更新时间 **2026-01-19**

来源：
- `https://qwenlm.github.io/qwen-code-docs/en/users/configuration/auth/`
- `https://github.com/QwenLM/qwen-code?tab=readme-ov-file`

### GitHub Copilot Free（限额与模型可用性）

- **Free 限额**：**2000 completions/月、50 premium requests/月**
- **可用模型**：Copilot 支持很多模型，但 **Free 并非全可用**（文档里“Model multipliers for Copilot Free: Not applicable” 即意味着 Free 不可用）
  - 文档明确：**Grok Code Fast 1 的“complimentary access”在延长**（但“可随时结束促销”）

来源：
- `https://github.blog/changelog/2024-12-18-announcing-github-copilot-free/`
- `https://docs.github.com/en/copilot/managing-copilot/managing-copilot-as-an-individual-subscriber/about-github-copilot-free`
- `https://docs.github.com/en/copilot/reference/ai-models/supported-models`
- `https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot`

### Kiro（免费 credits）

- **Free：50 credits/月**；新用户首次访问有 **500 credits（14 天有效）**
- **Auto**：官方描述为混合多模型（例如 Sonnet 4 + 专项模型）以权衡成本/质量

来源：
- `https://kiro.dev/blog/new-pricing-plans-and-auto/`
- `https://kiro.dev/blog/introducing-kiro/`

### Trae（免费与隐私风险提示）

- 报道指出：Trae 提供 DeepSeek R1 / Claude（国际版）等“免费使用”，并提到其隐私策略：本地存储代码，但会临时上传用于 embeddings 计算，保留 embeddings 与元数据（对敏感代码需要谨慎）

来源：
- `https://www.infoq.com/news/2025/03/trae-bytedance-claude-37-free/`

### OpenCode（多 provider 接入）

- Z.AI 官方文档给出 OpenCode 安装、登录、选择模型（例如 GLM-4.7）流程，并提示默认模型已升级到 GLM-4.7
- MiniMax 官方文档给出在 OpenCode 中配置 MiniMax-M2.1 的流程

来源：
- `https://docs.z.ai/scenario-example/develop-tools/opencode`
- `https://docs.z.ai/devpack/tool/opencode`
- `https://platform.minimax.io/docs/coding-plan/opencode`

### CodeBuddy（腾讯）：可配置模型（BYOK）

- 官方说明 `models.json` 支持用户级/项目级配置，并强调“当前仅支持 OpenAI 接口格式 API”

来源：
- `https://www.codebuddy.ai/docs/cli/models`

---

## 模型能力 & 价格全面对比（重点：GLM / Kimi / Qwen / MiniMax / Doubao / Big Pickle vs GPT / Gemini / Claude / Grok）

> 说明：下面所有“价格”尽量引用**官方 pricing**。但要注意同一个模型在不同“渠道/网关”（例如 OpenCode Zen、云厂商、官方 API）价格会不同；我会把**来源与可信度**写清楚。

### 1）先用一句话讲“差距”在哪里（你关心的点）

- **顶级闭环能力（规划→执行→反省→继续）**：一般仍是 **Claude Sonnet 4.5 / GPT-5.2（含 Codex 系）**最稳，尤其在复杂工程改动、边界条件与长期一致性上。
- **性价比追赶最快（接近前沿，但便宜很多）**：**GLM-4.7 / MiniMax-M2.1**属于“能交付、多语言、agent 友好、输出便宜”的代表。
- **中文+国内生态**：**Qwen / Doubao**更自然；但“全球定价 vs 国内定价”差异很大（尤其 Qwen 在不同部署模式）。
- **速度/低成本高吞吐**：**Grok Code Fast 1**通常主打“快+便宜”，适合大量改小点、跑高频 agent。
- **Big Pickle**：典型“促销/试验型免费模型”，成本几乎为 0，但质量与数据策略需要你特别小心（下文有说明）。

---

### 2）能力对比（按“工程可用性”维度）

| 模型 | 代码/重构（工程闭环） | 多语言/全栈 | 工具调用（agent） | 长上下文 | 中文体验 | 主要短板 |
|---|---|---|---|---|---|---|
| **Claude Sonnet 4.5** | 很强（稳定、少跑偏） | 强 | 强（工具生态成熟） | 200K（可开 1M，但 >200K 价格更贵） | 很好 | 贵（尤其输出） |
| **GPT-5.2** | 很强（coding+agent） | 强 | 强 |（以 OpenAI 官方模型页为准） | 很好 | 输出极贵、易“过度输出”导致成本飙升 |
| **Gemini 2.5 Pro** | 强（推理/编码都强） | 强 | 强（Google 生态工具多） | 官方按 ≤200K / >200K 计费；免费层 token 免收费 | 很好 | 输出价格高；免费层内容用于改进产品（见条款） |
| **Grok Code Fast 1** | 中上（偏执行/补洞） | 中上 | 强（主打 agentic coding） | 256K（常见规格） | 中 | “快”优先时，复杂架构/长期一致性可能不如 Claude/GPT |
| **GLM-4.7** | 中上~强（官方宣称接近 Sonnet 4.5） | 强（尤其前端审美/完整 demo） | 强（官方给出 τ²-Bench 优势） | 200K | 很好 | 极复杂任务仍可能弱于 Claude/GPT 的“顶级稳定性” |
| **MiniMax-M2.1** | 中上~强（强调真实复杂任务、多语言） | 很强（Rust/Java/Go 等） | 强（强调框架泛化） |（参考其 M2/M2.1 文档与工具生态，常见 200K 级） | 很好 | 公开 benchmark 数字分散在新闻稿图表里，不如“定价表”那样一眼可抄 |
| **Qwen3-Coder（Plus/480B 等）** | 中上（能力强但“价格/上下文分档”需要规划） | 强 | 强（多工具/多入口） | 最高可到 1M（不同型号/部署模式） | 很好 | 超长上下文分档会导致成本陡增（尤其输出） |
| **Kimi K2 / K2 Thinking** | 中上（agent/coding 不错） | 中上 | 支持 ToolCalls / JSON / Partial / WebSearch | 256K（K2 系） | 很好 | 不支持视觉；Turbo 版本输出很贵（$8/MTok） |
| **Doubao-Seed-Code** | 中上（专攻 Bugfix/前端；支持深度思考/缓存） | 中上~强 | 强（Function Calling/缓存/多 API 兼容） | 256K（官方给出） | 很好 | 计费按“输入长度分档”，长上下文会明显变贵（输出尤其） |
| **Big Pickle（OpenCode Zen）** | “看运气”（促销/试验型免费） | 未知 | 支持（Zen OpenAI-compatible） | 200K（Zen 标注） | 未知 | 质量不确定；免费期可能采集数据改进模型 |

---

### 2.5）用“公开 benchmark 信号”对齐差距（不追求绝对，只看方向）

> 你要记住一个现实：**同一个模型，用不同 agent 框架/不同提示词/不同工具权限，SWE-bench 这类结果能差一大截**。所以这里我只放“可公开引用”的信号，并标注是否 self-reported。

- **LiveCodeBench v6（airank.dev，标注为 self-reported）**
  - GLM-4.6：82.8%
  - Kimi K2 Instruct：53.7%
  - （Qwen3 系若干模型在 50%~74% 区间，但这不是 Qwen Coder 专项模型）
  - 来源：`https://airank.dev/benchmarks/livecodebench-v6`
- **GLM-4.7（Z.AI 官方宣称）**
  - 宣称：LiveCodeBench v6 84.9、SWE-bench Verified 73.8%、Terminal Bench 2.0 41%、τ²-Bench 84.7（并声称超过 Claude Sonnet 4.5）
  - 来源：`https://docs.z.ai/guides/llm/glm-4.7`
- **MiniMax-M2.1（MiniMax 官方宣讲）**
  - 宣称：在多语言场景超过 Claude Sonnet 4.5，接近 Claude Opus 4.5；并在 SWE-bench Verified 上对多种 agent 框架做了评测（具体数值在图里）
  - 来源：`https://www.minimax.io/news/minimax-m21`

### 3）价格对比（统一口径：$/1M tokens）

#### A. 官方价格（优先）

| 模型 | 输入 $/MTok | 输出 $/MTok | 备注 | 来源 |
|---|---:|---:|---|---|
| **GLM-4.7** | 0.60 | 2.20 | Z.AI 还给出缓存价；并标注 Flash/FlashX 有“Free/更低价” | `https://docs.z.ai/guides/overview/pricing` |
| **MiniMax-M2.1** | 0.30 | 1.20 | lightning：输出更贵（2.4） | `https://platform.minimax.io/docs/pricing/pay-as-you-go` |
| **Kimi K2（cache miss）** | 0.60 | 2.50 | cache hit：0.15；K2 thinking 同价 | `https://platform.moonshot.ai/docs/pricing/chat` |
| **Qwen3-Coder-Plus（≤32K 档，Global）** | 1.00 | 5.00 | 更长上下文会涨价；>256K 时输出可到 60 | `https://www.alibabacloud.com/help/en/model-studio/billing-for-model-studio` |
| **Gemini 2.5 Pro（≤200K）** | 1.25 | 10.00 | Free tier：token 免费但“用于改进产品”；Paid：不用于改进 | `https://ai.google.dev/gemini-api/docs/pricing` |
| **Claude Sonnet 4.5（≤200K）** | 3.00 | 15.00 | 支持缓存/批处理；>200K 进入 long-context 更贵 | `https://platform.claude.com/docs/en/about-claude/pricing` |
| **OpenAI GPT-5.2** | 1.75 | 14.00 | 旗舰 coding/agent；另有 GPT-5 mini（0.25/2.0） | `https://openai.com/api/pricing` |
| **xAI Grok Code Fast 1** | 0.20 | 1.50 | xAI 官方列出 256K；并提示“Large contexts”会按更高价计费 | `https://x.ai/api` |
| **Doubao-Seed-Code（≤32K 档）** | ¥1.20 | ¥8.00 | **单位为 CNY/百万 token**；透明缓存命中 ¥0.24；更长输入会跳档（输出到 ¥16） | `https://www.volcengine.com/docs/82379/1949118` |

#### B. OpenCode Zen 作为“统一网关”时的价格（便于一眼对比）

> 价值：同一个入口下，把 **Kimi / Qwen / GLM / Big Pickle** 与 Claude/GPT/Gemini 放在同一套结算里。缺点：不是“官方直连价”，但这是 OpenCode 官方文档，可信度仍高。

| 模型（Zen） | 输入 $/MTok | 输出 $/MTok | 备注 | 来源 |
|---|---:|---:|---|---|
| **Big Pickle** | Free | Free | limited time free；免费期可能用于改进模型 | `https://opencode.ai/docs/zen/` |
| **GLM 4.7** | 0.60 | 2.20 | cached read 0.10 | `https://opencode.ai/docs/zen/` |
| **Kimi K2 / K2 Thinking** | 0.40 | 2.50 | 与 Moonshot 官方价不同：渠道价差 | `https://opencode.ai/docs/zen/` |
| **Qwen3 Coder 480B** | 0.45 | 1.50 | 明显低于阿里云官方全球定价（渠道价差） | `https://opencode.ai/docs/zen/` |

---

### 4）把价格换算成“你能感知的成本”（示例）

假设一次 agent 回合使用：
- **输入 50k tokens**（读了不少文件/日志）
- **输出 5k tokens**（给出方案+patch）

成本估算公式：
\[
Cost \approx 0.05 \times InputPrice + 0.005 \times OutputPrice
\]

| 模型 | 估算成本（50k in + 5k out） | 直观解读 |
|---|---:|---|
| **MiniMax-M2.1**（0.3/1.2） | $0.021 | 非常省，适合高频 agent |
| **GLM-4.7**（0.6/2.2） | $0.041 | 仍然很省，且能力更均衡 |
| **Kimi K2**（0.6/2.5） | $0.043 | 与 GLM 接近；若 cache hit 多会更省 |
| **Doubao-Seed-Code**（¥1.2/¥8.0，≤32K 档） | ≈ ¥0.10（CNY） | 极省，但注意：输入变长会跳档，输出也按更高价计费 |
| **Grok Code Fast 1**（0.2/1.5） | $0.0175 | 极省且偏“高吞吐”；适合高频 agent 执行 |
| **Gemini 2.5 Pro**（1.25/10） | $0.113 | 能力强但输出贵一些 |
| **Qwen3-Coder-Plus**（1/5） | $0.075 | 还可以；注意超长上下文会跳档涨价 |
| **Claude Sonnet 4.5**（3/15） | $0.225 | 贵，但胜在稳定与成功率 |
| **GPT-5.2**（1.75/14） | $0.158 | 能力很强，但输出价格高 |

> 注：如果某模型价格单位不是 USD（例如 Doubao 是 CNY），按同一公式计算出来的成本也会是对应币种。
>
> 规律：跑高频 agent 时，最容易“烧钱”的通常是**输出**（Claude/GPT 尤其明显）。因此**控制输出长度**往往比“换模型”更有效。

---

### 5）Doubao-Seed-Code：官方能核验的价格/规格（以及为什么它“看起来便宜但可能不便宜”）

火山方舟官方模型页已经给出了 **doubao-seed-code** 的规格与按量计费表（按输入长度分档 + 透明缓存）：

- **上下文窗口**：256k；最大输入 224k；最大输出（含思维链）可到 64k（并区分 `max_tokens` / `max_completion_tokens` 的上限与含义）
- **价格（CNY/百万 token）**（节选最常见档位，完整见来源）：
  - 输入长度 \([0, 32]k\)：输入 ¥1.20 / 输出 ¥8.00
  - 输入长度 \((32, 128]k\)：输入 ¥1.40 / 输出 ¥12.00
  - 输入长度 \((128, 256]k\)：输入 ¥2.80 / 输出 ¥16.00
  - 缓存命中输入：¥0.24（不随档位变化）；缓存存储：¥0.017 / 百万 token*小时

这解释了一个关键点：**Doubao 的“输入”在短上下文档位很便宜，但输出单价并不低；而且一旦你把输入堆到超长（例如 100k+），会触发更高档位**。所以它很适合“多读少说、输出短”的 agent 流程（例如只让它输出 patch/diff，而不是输出长篇解释）。

来源：`https://www.volcengine.com/docs/82379/1949118`

---

### 6）5 分钟自检：你如何自己核对“模型名/价格/是否真免费”

- **OpenCode / OpenCode Zen**
  - 在 TUI 里运行：`/models`（看实际可用模型与 id）
  - 或直接看模型元数据列表：`https://opencode.ai/zen/v1/models`
  - 价格参考：`https://opencode.ai/docs/zen/`（注意“Free/limited time”说明）
- **Qwen（Qwen Code / 阿里云 Model Studio）**
  - 先确认你用的是哪个入口：Qwen OAuth（免费配额）还是 OpenAI-compatible（走 API key/订阅）
  - 价格以 Model Studio 的 `Model invocation pricing` 为准（注意不同 region/deployment 的价格完全不同）
- **xAI Grok**
  - 价格与上下文窗口在 `https://x.ai/api` 这页就能直接核对（页面写明“prices are per million tokens”）
- **通用：用账单反推**
  - 你只要记住：\(\text{cost} \approx \text{inTokens}/10^6\times P_{in} + \text{outTokens}/10^6\times P_{out}\)
  - 然后用控制台的 usage/billing 里的 token 统计去对账，就能判断“是否暗含加价/是否跳档计费/是否把 reasoning tokens 算进 output”

## “性能”怎么比：别只看榜单，先看你要解决的任务

### 1）最重要的性能指标：SWE-bench 等榜单只能当“信号”

你真正想要的是：**在你的仓库里，能不能稳定完成任务闭环**（读→改→测→解释）。

建议你用 3 个真实任务做 A/B：

- **任务 A（定位 bug）**：给一段报错日志 + 相关目录，要求定位根因 + 提 PR 级别修复方案。
- **任务 B（多文件重构）**：把某个模块拆分/重命名，要求改动覆盖测试。
- **任务 C（长上下文）**：把一个大目录的 README/架构写出来，并列出关键入口与数据流。

### 2）基于现有资料的“能力画像”（只做方向性参考）

- **长上下文读仓库**：Gemini 2.5 Pro（1M）通常占优势（尤其在“把一堆文件一起塞进去”时）
- **中文 + 国内生态**：Qwen 系、Doubao 系通常更顺
- **Agent 执行稳定性**：Copilot/成熟 IDE/成熟 CLI 往往更稳，但 Free 配额会限制“把活干完”

---

## 场景化选型建议（你可以直接照抄到自己的工作流）

### 场景 1：我想“免费把活干完”（写功能/修 bug/做小重构）

- **首选**：Qwen Code（2000/day）做“执行主力”
- **备选**：Gemini CLI（1000/day）做“高难定位/长上下文理解”
- **IDE 内体验**：Copilot Free 只负责补全；重活交给 CLI

### 场景 2：我想读一个很大的 repo（或长 PR/长日志）

- **首选**：Gemini CLI（1M context）
- **策略**：先让 Gemini 抽“目录树 + 关键入口 + 数据流”，再把要改的点交给 Qwen Code/IDE 去落地

### 场景 3：前端页面/视觉审美要更好（快速原型）

- **可选**：Trae（但只在非敏感代码仓库）
- **保守做法**：生成 UI 代码后，自己再用本地工具做二次审查（避免隐私/合规风险）

### 场景 4：我要“一套壳接很多模型”（自己做路由）

- **OpenCode / Claude Code / CodeBuddy** 这类工具作为“壳”
- 把模型当“可插拔引擎”，按任务路由：
  - **规划/拆解**：更强推理/更稳定的模型
  - **执行/改代码**：更快更便宜的 coding 模型

---

## 不确定项（我明确标出来，避免你被“伪 free”误导）

- **Cursor Free 的固定配额/限速**：Cursor 官网展示了模型列表（Auto/Composer 1/Grok Code 等），但其“免费限额”页面在静态抓取中不可用，且社区常提“动态限额/排队”。所以我建议你把 Cursor 当“体验入口”，不要把它当“免费稳定主力”。
- **Qoder 默认模型是否就是 Qwen-Coder**：现有公开文档更多是“档位/tiers”，没有明确写具体模型名；若你要确定是 Qwen，请优先用 Qwen Code CLI。
- **OpenCode 的 big-pickle**：已在 OpenCode Zen 官方文档中列为可用模型，且当前为“限时免费”。但它属于“stealth/试验型”，免费期可能会采集数据用于改进模型，建议只在非敏感项目试用。来源：`https://opencode.ai/docs/zen/`

---

## 你下一步该怎么做（最省时间的验证法）

### 1）建立你的“免费主力栈”

- **安装/常驻**：Gemini CLI + Qwen Code
- **IDE**：Copilot Free（只用于补全/低频聊天）

### 2）给自己做一个 30 分钟的 A/B 基准（用真实仓库任务）

跑我上面那 3 个任务（A/B/C），记录：

- 是否一次跑通（成功率）
- 总耗时（含你来回补充信息的次数）
- 改动质量（是否能直接合 PR）

你会非常直观看到：哪个“系统”（工具+模型+额度）才是真正适合你的。

---

*文档更新：2026-01-26*
