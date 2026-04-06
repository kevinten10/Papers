# 三虾团队小红书配图生图提示词

> 对应文章：核心经验与思路 (core-experience.md)
> 创建日期：2026-04-06

---

## 封面图

### 方案一：杂志封面风（推荐）

```
A magazine cover style photograph of a developer workspace with three laptops on a wooden desk, screens showing code editors, soft natural light through window blinds. The image must include these Chinese text elements directly rendered on the image:
- Top banner: "🦐 三虾团队" in bold white sans-serif font with subtle drop shadow
- Center headline: "24/7 AI协作开发" in large modern Chinese typography, white color with soft glow effect
- Bottom subtitle: "旧电脑 → Agent集群" in smaller clean font, cyan accent color
Professional editorial photography, cinematic lighting, 3:4 aspect ratio, text clearly legible and integrated into the composition like a real magazine cover, 8k quality
```

### 方案二：海报宣传风

```
Tech poster design featuring three laptops arranged on a desk showing programming interfaces, dark moody lighting with blue accent glow. Directly render this Chinese text on the image:
- Top: "三虾团队" in bold futuristic font, neon cyan color
- Middle large text: "24/7 无休协作" in white with outer glow
- Bottom three lines: "孔明·决策开发" "卧龙·深度思考" "凤雏·快速原型" in smaller organized layout
Cyberpunk aesthetic, dramatic lighting, text is part of the scene like LED signage, high contrast for readability, poster art style, 4k
```

### 方案三：社交媒体卡片风

```
Instagram-style tech content creator photo, flat lay of three laptops with code on screens, coffee cup, clean desk aesthetic. Overlay these Chinese text elements directly:
- Header: "三虾团队" with computer emoji, modern rounded font, white with black outline
- Main: "用旧电脑打造AI Agent集群" in large friendly typography, centered
- Footer: "经验分享｜全程实录" in smaller text with arrow symbol
Warm lighting, lifestyle photography, text appears as if added by a professional social media designer, cohesive color palette, 3:4 ratio, crisp text rendering
```

### 方案四：极简文字风（文字最清晰）

```
Minimalist workspace photography, three laptops in a row on clean desk, screens displaying dark code editors, neutral gray background. Simple bold Chinese text directly on image:
- "三虾团队" at top in large black sans-serif font
- "24/7 AI协作" in center in extra bold white font on semi-transparent dark rectangle
- "旧电脑·新玩法" at bottom
Clean graphic design aesthetic, ample spacing around text, maximum legibility, modern tech company style, professional photography with graphic overlay, 4k sharp
```

---

## 内页配图

### 配图 1：三虾分工角色图

```
Three cute shrimp characters as AI agents, each with distinct personality and tech accessories:
- Left: "孔明" wearing glasses, holding a MacBook, wise leader pose, golden glow
- Center: "卧龙" meditating with floating code holograms, deep blue aura, thoughtful expression
- Right: "凤雏" rapidly typing on keyboard with motion blur, orange energy trails, dynamic pose
Clean modern illustration style, soft gradient background in cyan-purple tones, Chinese character labels under each shrimp, minimalist tech aesthetic, 3:4 aspect ratio, 4k quality
```

**Gemini参数**: `--ar 3:4 --q 2 --s 250`

---

### 配图 2：24/7 无休运转概念图

```
A futuristic command center with three computer stations glowing in dark room, circular arrangement, each screen showing different stages of AI processing (planning, thinking, coding). Large digital clock showing all hours, "24/7" text glowing in center, "三虾团队" logo at top. Cinematic blue lighting, holographic data streams connecting the stations, never-sleep concept visualization, sci-fi movie aesthetic, 8k render, 3:4 ratio
```

**Gemini参数**: `--ar 3:4 --q 2 --s 250`

---

### 配图 3：三虾 vs 大规模Agent集群 对比图

```
Split-screen comparison infographic style:
Left side: "Kimi Agent集群" showing dozens of identical small robot icons in grid, chaotic arrows, label "数量换覆盖率"
Right side: "三虾团队" showing three distinct shrimp characters with clear connection lines, organized workflow, label "角色换决策质量"
Center dividing line with "VS" symbol. Clean flat design, blue vs orange color scheme, Chinese text labels, modern tech presentation style, data visualization aesthetic, 4k crisp graphics, 3:4 ratio
```

**Gemini参数**: `--ar 3:4 --q 2 --s 250`

---

### 配图 4：Git协作流程图

```
Three laptop screens arranged in a triangle, connected by glowing Git branch lines showing collaboration flow. Each screen displays:
- Top: Code repository interface
- Left: Markdown documentation
- Right: Terminal with commit messages
"三虾协作" title at top, Git logo in center, arrows showing code push/pull directions. Dark background with neon accent lines, developer workflow visualization, clean tech illustration style, professional diagram aesthetic, 4k
```

**Gemini参数**: `--ar 3:4 --q 2 --s 250`

---

### 配图 5：产出成果数据墙

```
Impressive data dashboard visualization showing project statistics:
- "35 commits" badge
- "346 commits" star badge
- "75 PRs merged" trophy icon
- "500+ 创意评估" counter
- "20个新项目" project cards
"三虾战绩" header at top. Three shrimp mascot silhouettes in background. Dark theme with glowing cyan numbers, achievement gaming aesthetic, modern UI design, inspirational progress visualization, 4k quality, 3:4 ratio
```

**Gemini参数**: `--ar 3:4 --q 2 --s 250`

---

### 配图 6：旧电脑重生概念图

```
Three old laptops with visible wear and stickers, transforming into sleek AI-powered machines with glowing upgrades. Phoenix/metamorphosis visual metaphor, "旧电脑·新价值" Chinese text integrated, before/after split composition. Warm to cool color transition, magical transformation particles, tech revival concept, inspirational poster style, cinematic lighting, 8k quality, 3:4 aspect ratio
```

**Gemini参数**: `--ar 3:4 --q 2 --s 250`

---

### 配图 7：大学生福利场景图

```
A grateful college student at graduation ceremony, holding laptop with code on screen, surrounded by floating project icons and GitHub logos. Background shows three shrimp mascots as guardian angels. "毕业设计不用愁" Chinese text prominently displayed, warm celebratory atmosphere, success story illustration, inspirational poster style, soft pastel colors with gold accents, lifestyle photography meets illustration, 4k, 3:4 ratio
```

**Gemini参数**: `--ar 3:4 --q 2 --s 250`

---

## 配图使用顺序建议

| 顺序 | 配图 | 用途 |
|------|------|------|
| 1 | 封面图 | 首图吸引点击 |
| 2 | 三虾分工角色图 | 介绍团队架构 |
| 3 | 24/7运转概念图 | 展示核心特点 |
| 4 | Git协作流程图 | 说明工作方式 |
| 5 | 三虾vs大规模Agent | 差异化对比 |
| 6 | 产出成果数据墙 | 证明效果 |
| 7 | 旧电脑重生 | 呼应硬件配置 |
| 8 | 大学生福利场景 | 结尾升华 |

---

## Gemini 使用技巧

### 如果中文渲染效果不佳

添加以下提示增强文字渲染：
```
Important: All text must be clearly readable and properly rendered as part of the image, not added separately. Text should be crisp and high contrast against the background.
```

### 备选英文方案

如果中文渲染不稳定，可用英文生成后自行替换：
```
Text overlay in English: "THREE SHRIMP TEAM" at top, "24/7 AI COLLABORATION" as main headline, "OLD LAPTOPS → AGENT SWARM" as subtitle
```

然后用美图秀秀/Canva添加中文。
