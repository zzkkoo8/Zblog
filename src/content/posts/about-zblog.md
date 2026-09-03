---
title: Zblog：个人技术博客
author: zzkkoo8
pubDatetime: 2026-09-03T13:00:00+08:00
slug: about-zblog
featured: true
draft: false
tags:
  - Zblog
  - 技术博客
description: Zblog 的定位、内容边界与维护方式。
---

Zblog 用于记录技术实践、故障复盘、方案分析和工程思考。

## Zblog 与 Zwiki

两者都以 GitHub 为唯一事实源，但承担不同职责：

- **Zblog**：适合阅读的技术文章、教程、实践总结和工程思考。
- **Zwiki**：长期复用的命令、操作手册、知识条目和故障排查手册。

完整操作手册优先维护在 [Zwiki](https://zwiki.gitbook.io/zwiki-docs/)，博客文章只引用，不重复维护同一份权威内容。

## 维护方式

```text
ChatGPT / Codex / 人工
          ↓
    GitHub Markdown
          ↓
    GitHub Actions
          ↓
     AstroPaper
          ↓
    GitHub Pages
```

后续文章统一维护在 `src/content/posts/`。
