---
author: "Zzkkoo8"
pubDatetime: 2026-10-10T00:00:00Z
title: "LLM Agent 十级成熟度：从会用模型到构建自进化系统"
featured: false
draft: false
tags:
  - AI
  - Agent
  - Harness
  - Engineering
description: "用十个层级梳理从 LLM 日常使用、Coding Agent、Harness 工程、多 Agent 协作，到数据驱动自我改进的实践路线。"
---

判断 Agent 工程能力，不能只看模型有多强、接入多少工具或并发启动多少个 Agent。更重要的是：**任务能否在明确的权限边界内完成，结果能否被验证，失败能否沉淀为下一次改进。**

这套十级划分是对一篇社区文章的工程化整理，用于自测和讨论，不是官方成熟度标准。

## 十级概览

| 层级 | 核心能力 | 主要挑战 |
| --- | --- | --- |
| L1 | 把 LLM 当搜索引擎 | 从聊天转向可复用产出 |
| L2 | 使用 API 与 Coding Agent | 让 Agent 改文件、运行测试并交付 Diff |
| L3 | 集成 MCP、Skill、API 与 RAG | 工具选择和上下文工程 |
| L4 | 交付并运行真实系统 | 权限、成本、可用性、故障恢复 |
| L5 | Harness、Trace 与系统调试 | 定位失败步骤，用评测验证改动 |
| L6 | 从失败中持续迭代 | 把 Badcase 转化为测试、规则和门禁 |
| L7 | 管理几十到上百个 Agent | 任务分工、冲突解决、协调成本 |
| L8 | 规模化运行数千个 Agent | 独立验证器和可扩展协作协议 |
| L9 | 进化 Agent 的外部执行结构 | 数据驱动地改进工具、流程和程序性知识 |
| L10 | 建立数据驱动改进飞轮 | 将运行轨迹转为改进或训练素材，并守住评测门禁 |

可以把它们归为四个阶段：

- **L1–L3：使用 AI。** 从提问走向工具集成和上下文工程。
- **L4–L6：设计系统。** 让 Agent 上线运行、可观测、可验证，并能从失败中改进。
- **L7–L8：组织规模化协作。** 通过任务协议、隔离工作区和独立验证器控制并发。
- **L9–L10：设计进化机制。** 让外部执行结构和运行数据持续改善系统。

## 关键认知

### 模型之外的工程层同样重要

模型负责理解、推理和生成；Harness 则组织任务、管理上下文、定义工具、约束权限、保存状态、恢复失败并验证结果。很多 Agent 的问题并非模型“智商不够”，而是环境缺少必要的工具、状态或验证机制。

### 每次失败都应留下系统性改进

如果 Agent 重复犯同一种错误，只追加一句提示通常不是长期解法。应把失败沉淀成回归测试、工具校验、工作流规则或明确的交接状态。长任务可以用结构化交接物启动干净的新上下文，避免历史越来越长却逐渐丢失目标。

### 多 Agent 不等于线性提效

并发越多，协调、冲突、重复劳动、集成和成本控制越重要。应先证明任务可以独立拆分，并且每个子结果可被可靠验证，再扩大并发规模。复杂任务中，规划、执行、评审职责分离通常比所有 Agent 平等共享状态更容易治理。

### 自我改进必须有不能被绕过的评测门禁

成熟的改进循环包括：采集轨迹、分析失败、提出变更、在留出评测集上验证、通过门禁后再发布。评测器不能被被优化对象自行放宽，否则系统可能只是在降低标准，而不是真正变强。

## 实用升级路线

1. **从 L2 开始建立交付闭环：** 每次代码任务都要求可审查 Diff、自动测试和明确的验收结果。
2. **进入 L3 后限制工具和上下文：** 只接入当前任务需要的 API、MCP、Skill 和知识源，避免盲目堆插件。
3. **达到 L4 时建立安全边界：** 最小权限、成本统计、人工接管、回滚和高危操作审批不可缺少。
4. **在 L5–L6 建立反馈机制：** 保存 Trace，把反复出现的失败转成测试和系统约束。
5. **在 L7–L8 扩大协作规模：** 先设计任务协议、工作区隔离、冲突策略和独立验证器，再增加 Agent 数量。
6. **在 L9–L10 探索受控进化：** 用经过筛选的数据优化 Harness 或训练流程，固定基线并保留回滚能力。

## 适用边界

这套层级是个人归纳的工程框架，不能替代正式评测标准。不同研究中的 Agent 数量、Token 消耗、成本和基准分数依赖具体任务及评测口径，引用时应以原始论文或官方发布为准。对于运维和生产系统，Agent 的自主程度必须受权限、风险等级和可回滚能力约束。

## 参考资料

- 用户提供：《从一级到十级？你能用 LLM 完成哪个层级的事情？》，含情社区剪藏 Markdown。剪藏文件未包含原始网页 URL。
- [OpenAI：Harness engineering](https://openai.com/index/harness-engineering/)
- [Anthropic：Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- [Anthropic：Scaling Managed Agents](https://www.anthropic.com/engineering/scaling-agents)
- [Cursor：Scaling long-running autonomous coding](https://cursor.com/blog/scaling-agents)
- [Chroma Research：Context Rot](https://research.trychroma.com/context-rot)
- [Agensh 项目](https://agens-harness.github.io/project)
- [arXiv:2609.26781](https://arxiv.org/abs/2609.26781)
- [arXiv:2609.09153](https://arxiv.org/abs/2609.09153)
- [Darwin Gödel Machine（arXiv:2505.22954）](https://arxiv.org/abs/2505.22954)
- [Hermes Agent](https://github.com/NousResearch/hermes-agent)
