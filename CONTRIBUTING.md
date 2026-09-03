# Zblog 协作与反馈

Zblog 以 GitHub `main` 为唯一事实源，公开站点由 GitHub Actions 自动构建并发布。

## 读者反馈

- 文章事实错误、命令错误、失效链接：提交 GitHub Issue，优先使用“内容纠错”模板。
- 已知正确修改方式：可以直接编辑对应 Markdown 并发起 Pull Request。
- 讨论、补充经验和评论：使用文章评论区；评论数据由 GitHub Discussions 承载。

## 多人编辑

正式协作统一走：

```text
branch → 修改 Markdown → Pull Request → CI → review → merge main → 自动发布
```

文章文件统一位于：

```text
src/content/posts/
```

不要把同一篇文章维护成多个权威副本。

## 修改文章

小修改可以直接在 GitHub Web 中打开文章源码，点击编辑按钮并创建分支/PR。

新增文章时保持 AstroPaper frontmatter 合法，至少包含：

```yaml
---
title: 文章标题
author: zzkkoo8
pubDatetime: 2026-09-03T22:00:00+08:00
draft: false
tags:
  - Linux
description: 文章摘要
---
```

技术操作手册、长期维护的 SOP 和命令速查优先沉淀到 Zwiki；Zblog 主要记录技术实践、教程、故障复盘、方案分析和工程思考。

## 合并要求

- 内容修改不顺带升级 Astro/AstroPaper 依赖。
- 涉及主题、组件、配置或依赖的修改必须通过 CI。
- 不提交密码、Token、私钥、客户数据、内网敏感信息或未脱敏日志。
