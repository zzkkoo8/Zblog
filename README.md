# Zblog

个人技术博客，基于 [Fuwari](https://github.com/saicaca/fuwari) + [Astro](https://astro.build/) 构建。

- Blog: <https://zzkkoo8.github.io/Zblog/>
- Zwiki: <https://zwiki.gitbook.io/zwiki-docs/>
- GitHub `main` 是唯一事实源（SSOT）。

## 写文章

文章统一放在：

```text
src/content/posts/
```

Frontmatter 示例：

```yaml
---
title: "文章标题"
published: 2026-09-03
description: "文章摘要"
tags: [Linux, Ubuntu]
category: "Linux"
lang: "zh_CN"
draft: false
---
```

## 本地验证

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

## 发布

合并到 `main` 后由 GitHub Actions 自动构建并发布到 GitHub Pages。
