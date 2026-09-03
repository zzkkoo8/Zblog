---
title: "关于 Zblog"
description: "Zblog 的定位、内容边界与维护方式。"
---

Zblog 是我的个人技术博客，用于记录技术实践、故障复盘、方案分析和工程思考。

## 内容定位

这里主要发布适合连续阅读的内容：

- 技术实践与教程
- 故障复盘与问题定位
- 架构、产品和方案分析
- AI Coding 与工程效率实践
- 值得长期记录的技术思考

## Zblog 与 Zwiki

Zblog 与 [Zwiki](https://zwiki.gitbook.io/zwiki-docs/) 都以 GitHub 为唯一事实源，但职责不同：

- **Zblog**：面向阅读，强调完整背景、思路、过程和结论。
- **Zwiki**：面向查询和复用，保存命令、操作手册、知识条目与故障排查手册。

同一主题如果需要完整操作手册，权威版本优先维护在 Zwiki，博客只引用对应条目，避免重复维护。

## 技术实现

本站基于 [AstroPaper](https://github.com/satnaing/astro-paper) 和 [Astro](https://astro.build/) 构建，文章以 Markdown / MDX 保存在 [Zblog GitHub 仓库](https://github.com/zzkkoo8/Zblog)，通过 GitHub Actions 自动构建并发布到 GitHub Pages。
