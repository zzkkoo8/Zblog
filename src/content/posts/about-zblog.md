---
title: "Zblog：个人技术博客"
published: 2026-09-03
description: "Zblog 的定位、内容边界与维护方式。"
tags: [Zblog, Blog]
category: "随笔"
lang: "zh_CN"
draft: false
---

Zblog 用于记录技术实践、故障复盘、方案分析和工程思考。

## Zblog 与 Zwiki

两者使用同一种维护原则：**GitHub 是唯一事实源**。

- **Zblog**：适合阅读的技术文章、实践总结、教程和思考。
- **Zwiki**：可长期复用的命令、操作手册、知识条目和故障排查手册。

当博客内容涉及完整操作手册时，优先链接到 [Zwiki](https://zwiki.gitbook.io/zwiki-docs/)，避免两边维护重复内容。

## 发布流程

```text
ChatGPT / Codex / 人工
          ↓
    GitHub Markdown
          ↓
    GitHub Actions
          ↓
      Astro / Fuwari
          ↓
     GitHub Pages
```

后续文章统一维护在 `src/content/posts/`。
