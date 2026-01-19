# Gemini CLI 使用技巧指南

## 📋 目录

- [基本安装和配置](#基本安装和配置)
- [自动命令模式](#自动命令模式)
- [Thinking推理模式](#thinking推理模式)
- [中文模式优化](#中文模式优化)
- [效率提升技巧](#效率提升技巧)
- [自定义配置](#自定义配置)
- [最佳实践](#最佳实践)

## 基本安装和配置

### 安装方式

```bash
# 使用npm安装
npm install -g @google/gemini-cli

# 或使用pip
pip install gemini-cli

# 或直接下载二进制文件
# 从GitHub releases下载对应平台的二进制文件
```

### 环境变量配置

```bash
# 设置API密钥
export GEMINI_API_KEY="your-api-key-here"

# 设置默认模型
export GEMINI_MODEL="gemini-2.5-flash"

# 设置Google Cloud项目（可选）
export GOOGLE_CLOUD_PROJECT="your-project-id"
export GOOGLE_CLOUD_LOCATION="us-central1"

# 启用检查点功能
export GEMINI_CHECKPOINTING=true

# 禁用沙箱模式（谨慎使用）
export GEMINI_SANDBOX=false
```

## 自动命令模式

### 自动批准模式

Gemini CLI提供了几种自动批准模式，可以减少交互式确认：

```bash
# 自动批准文件编辑操作
gemini --approval-mode auto_edit

# 完全自动模式（高风险，谨慎使用）
gemini --yolo

# 指定允许的工具
gemini --allowed-tools ShellTool,ReadFileTool,GlobTool
```

### 批处理执行

```bash
# 非交互模式执行单个命令
echo "分析这个项目的代码结构" | gemini

# 使用prompt参数
gemini -p "帮我优化这段代码的性能"

# 批量处理多个任务
cat tasks.txt | gemini
```

### 脚本自动化

```bash
#!/bin/bash
# 自动代码审查脚本
gemini --yolo -p "审查以下代码：$(cat main.py)" > review.md

# 自动生成测试用例
gemini --yolo -p "为这个函数生成测试用例：$(cat utils.js)" > tests.js
```

## Thinking推理模式

### 开启Thinking模式

Gemini CLI支持高级推理模式，可以让AI进行更深入的思考和逐步推理：

#### 通过配置文件开启
在`.gemini/settings.json`中添加thinking配置：

```json
{
  "modelConfigs": {
    "overrides": [
      {
        "match": {
          "overrideScope": "global"
        },
        "modelConfig": {
          "generateContentConfig": {
            "thinkingConfig": {
              "thinkingBudget": 4096
            }
          }
        }
      }
    ]
  }
}
```

#### 特定场景配置
为特定任务配置不同的thinking预算：

```json
{
  "modelConfigs": {
    "overrides": [
      {
        "match": {
          "overrideScope": "codebaseInvestigator"
        },
        "modelConfig": {
          "generateContentConfig": {
            "thinkingConfig": {
              "thinkingBudget": 8192
            }
          }
        }
      },
      {
        "match": {
          "overrideScope": "debugAnalyzer"
        },
        "modelConfig": {
          "generateContentConfig": {
            "thinkingConfig": {
              "thinkingBudget": 2048
            }
          }
        }
      }
    ]
  }
}
```

### Thinking预算设置

#### 预算值说明
- **1024**: 基础推理模式，适合简单问题
- **2048**: 标准推理模式，适合中等复杂度问题
- **4096**: 深度推理模式，适合复杂分析任务
- **8192**: 专家级推理模式，适合专业领域深度分析
- **16384**: 最大推理模式，适合极复杂的问题

#### 动态调整预算
根据任务复杂度调整thinking预算：

```bash
# 简单任务
gemini -p "解释这个变量的作用" --thinking-budget 1024

# 复杂代码分析
gemini -p "分析这段代码的性能瓶颈" --thinking-budget 4096

# 系统架构设计
gemini -p "设计这个系统的微服务架构" --thinking-budget 8192
```

### 推理模式使用场景

#### 代码分析场景
```bash
# 深度代码审查
gemini --thinking-budget 4096 -p "进行深度代码审查，分析潜在问题和改进建议：$(cat main.py)"

# 架构分析
gemini --thinking-budget 8192 -p "分析项目架构，识别设计模式和潜在重构点：@src/"

# 性能优化
gemini --thinking-budget 4096 -p "分析性能瓶颈并提供优化建议：$(cat profiler.log)"
```

#### 问题解决场景
```bash
# 复杂算法问题
gemini --thinking-budget 4096 -p "逐步分析这个算法的时间复杂度：$(cat algorithm.js)"

# 系统调试
gemini --thinking-budget 2048 -p "分析错误日志并提供解决方案：$(cat error.log)"

# 设计决策
gemini --thinking-budget 8192 -p "权衡这两种架构设计的优缺点：方案A vs 方案B"
```

### 提示词优化Thinking

结合thinking模式使用优化的提示词：

```bash
# 结构化推理
gemini --thinking-budget 4096 -p "请逐步分析：
1. 理解问题背景
2. 识别关键因素
3. 分析可能的解决方案
4. 评估风险和收益
5. 给出推荐方案

问题：如何优化这个系统的并发性能？"

# 批判性思考
gemini --thinking-budget 4096 -p "请从以下角度分析：
- 技术可行性
- 业务价值
- 实施难度
- 潜在风险
- 替代方案

分析对象：迁移到微服务架构"
```

### Thinking模式最佳实践

#### 预算选择原则
- **任务复杂度**: 复杂任务使用更高预算
- **响应时间**: 高预算会增加响应时间
- **成本考虑**: thinking消耗更多tokens

#### 结合其他模式
```bash
# Thinking + 自动模式
gemini --thinking-budget 4096 --approval-mode auto_edit -p "重构这个模块"

# Thinking + 调试模式
gemini --thinking-budget 2048 --debug -p "调试这个错误"

# Thinking + 中文模式
gemini --thinking-budget 4096 -p "用中文详细分析这个算法的优缺点"
```

#### 性能监控
```bash
# 监控thinking消耗
gemini --thinking-budget 4096 --show-memory-usage -p "复杂分析任务"

# 分析推理过程
gemini --thinking-budget 4096 --debug -p "需要详细推理的任务"
```

---

## 中文模式优化

### 提示词优化

虽然Gemini CLI没有明确的中文语言设置，但可以通过优化提示词来改善中文交互：

```bash
# 明确指定中文响应
gemini -p "请用中文回答：解释这个项目的架构"

# 设置中文上下文
gemini -p "你是一个中文AI助手，请用中文回复所有问题"

# 中文代码生成
gemini -p "用中文注释的方式生成一个Python计算斐波那契数列的函数"
```

### 配置文件设置

在settings.json中添加中文相关的配置：

```json
{
  "model": "gemini-2.5-pro",
  "context": {
    "maxFilesAtOnce": 50,
    "fileFiltering": {
      "respectGitignore": true
    }
  },
  "general": {
    "customInstructions": "请始终用中文回复，除非用户明确要求使用其他语言。请确保代码注释使用中文。"
  }
}
```

### 环境变量设置
```bash
# 设置中文环境
export LANG="zh_CN.UTF-8"
export LC_ALL="zh_CN.UTF-8"

# Gemini CLI特定设置
export GEMINI_LANGUAGE="zh-CN"
export GEMINI_RESPONSE_LANGUAGE="chinese"
```

## 效率提升技巧

### 快捷命令
```bash
# 直接执行shell命令
gemini "!npm install && npm test"

# 文件引用
gemini "@src/main.py 解释这个文件的逻辑"

# 目录分析
gemini "@src/ 总结这个目录的代码结构"

# 切换到shell模式
gemini "!"
# 然后可以连续执行多个命令
# ls -la
# git status
# exit (输入 ! 退出shell模式)
```

### 工作区配置
```bash
# 包含额外目录
gemini --include-directories ../shared,../utils

# 包含所有文件（忽略gitignore）
gemini --all-files

# 启用调试模式
gemini --debug

# 启用检查点
gemini --checkpointing
```

### 自定义工具集成
创建`.gemini/settings.json`文件：

```json
{
  "mcpServers": {
    "my-tools": {
      "command": "node",
      "args": ["my-custom-tools.js"]
    }
  },
  "tools": {
    "includeTools": ["ReadFileTool", "ShellTool", "myCustomTool"],
    "excludeTools": []
  },
  "context": {
    "includeDirectories": ["./src", "../shared"],
    "maxFilesAtOnce": 100
  }
}
```

## 自定义配置

### 全局配置 (~/.gemini/settings.json)
```json
{
  "theme": "dark",
  "model": "gemini-2.5-flash",
  "approvalMode": "auto_edit",
  "sandbox": false,
  "checkpointing": true,
  "telemetry": {
    "enabled": false
  },
  "usageStatisticsEnabled": false,
  "maxSessionTurns": 50,
  "hideTips": false,
  "hideBanner": true,
  "summarizeToolOutput": {
    "run_shell_command": {
      "tokenBudget": 200
    }
  }
}
```

### 项目配置 (.gemini/settings.json)
```json
{
  "context": {
    "includeDirectories": ["./src", "./tests", "../docs"],
    "fileFiltering": {
      "respectGitignore": true,
      "includePatterns": ["*.js", "*.ts", "*.py", "*.md"],
      "excludePatterns": ["*.log", "*.tmp"]
    }
  },
  "tools": {
    "excludeTools": ["dangerous_command"],
    "includeTools": ["project_specific_tool"]
  },
  "mcpServers": {
    "project-tools": {
      "command": "./bin/project-tools.sh",
      "timeout": 30000
    }
  }
}
```

### 命令行覆盖
```bash
# 临时覆盖配置
gemini --model gemini-2.5-pro --theme light --sandbox=true

# 企业环境配置
gemini --telemetry-target gcp --telemetry-otlp-endpoint https://telemetry.example.com:4317
```

## 最佳实践

### 安全使用
```bash
# 总是启用沙箱模式进行shell操作
gemini --sandbox=docker

# 避免在生产环境中使用--yolo模式
# 优先使用auto_edit而不是完全自动模式

# 定期审查允许的工具列表
gemini --allowed-tools ShellTool(ls),ShellTool(cat),ReadFileTool
```

### 性能优化
```bash
# 限制上下文文件数量
gemini --max-files-at-once 20

# 使用合适的模型
gemini -m gemini-2.5-flash  # 快速响应
gemini -m gemini-2.5-pro    # 复杂任务

# 启用检查点以便恢复会话
gemini --checkpointing
```

### 中文开发环境
```bash
# 创建中文开发专用配置
cat > ~/.gemini/chinese-profile.json << 'EOF'
{
  "model": "gemini-2.5-flash",
  "context": {
    "maxFilesAtOnce": 30
  },
  "general": {
    "customInstructions": "你是一个专业的中文AI编程助手。请用中文回复所有问题，提供详细的代码注释和解释。优先使用中文变量名和注释，除非项目要求使用英文。"
  },
  "telemetry": {
    "enabled": false
  }
}
EOF

# 使用中文配置启动
gemini --config ~/.gemini/chinese-profile.json
```

### 工作流自动化
```bash
# 代码审查工作流
#!/bin/bash
echo "正在审查代码变更..."
git diff | gemini -p "审查这些代码变更，检查潜在问题："

# 文档生成工作流
gemini -p "根据这个项目的代码生成README文档" > README.md

# 测试生成工作流
gemini -p "为以下函数生成单元测试：$(cat src/utils.js)" > tests/utils.test.js
```

### 故障排除
```bash
# 启用调试模式
gemini --debug

# 查看内存使用
gemini --show-memory-usage

# 检查配置
gemini --list-extensions
gemini --version

# 重置配置
rm ~/.gemini/settings.json
rm .gemini/settings.json
```

---

*最后更新：2026-01-18 | Gemini CLI版本：最新版*