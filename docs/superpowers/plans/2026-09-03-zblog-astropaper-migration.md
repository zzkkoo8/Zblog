# Zblog AstroPaper Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 AstroPaper 官方模板替换未完成的 Fuwari 初始化，并将 Zblog 发布到 GitHub Pages。

**Architecture:** GitHub `main` 是 SSOT。一次性迁移 workflow 从固定 AstroPaper commit 复制源码并应用 Zblog 配置；迁移完成后删除临时 workflow，由长期 CI 和 Pages workflow 维护。

**Tech Stack:** AstroPaper 6.1.0、Astro 7、Node 24、pnpm 11.3.0、Pagefind、GitHub Actions、GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-03-zblog-astropaper-migration-design.md`

## Global Constraints

- AstroPaper 固定提交：`35cfa7fbe0b897306d27670d3819e55d5205f3dd`。
- Pages origin：`https://zzkkoo8.github.io`。
- Astro base：`/Zblog`。
- 不保留 AstroPaper 演示文章或作者身份。
- 文章目录采用 AstroPaper v6 的 `src/content/posts/`。
- CI 运行时使用 AstroPaper 上游同款 Node 24 + pnpm 11.3.0。
- 不引入 CMS、数据库、评论系统或自定义域名。
- 只有验证通过的源码允许进入 `main`。

---

### Task 1: 迁移 AstroPaper 官方模板

**Files:**
- Create: `.github/workflows/migrate-astropaper.yml`
- Generate: AstroPaper application tree

**Interfaces:**
- Consumes: `satnaing/astro-paper@35cfa7fbe0b897306d27670d3819e55d5205f3dd`
- Produces: 可构建的 Zblog AstroPaper 分支

- [ ] 创建一次性 workflow，克隆固定 commit。
- [ ] 复制 AstroPaper 源码，排除上游 `.git`、`.github`、`docs` 和 `src/content/posts/`。
- [ ] 写入 Zblog `astro-paper.config.ts`、`astro.config.ts`、`AGENTS.md`、`README.md` 和 `src/content/posts/about-zblog.md`。
- [ ] 执行 `pnpm install --frozen-lockfile`、`pnpm lint`、`pnpm format:check`、`pnpm build`。
- [ ] 只有全部成功后才提交生成源码到功能分支。

### Task 2: 清理迁移脚手架并建立正式 CI

**Files:**
- Delete: `.github/workflows/migrate-astropaper.yml`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: 已生成 AstroPaper 源码
- Produces: PR/main 持续验证门禁

- [ ] 删除一次性迁移 workflow。
- [ ] CI 使用 Node 24、pnpm 11.3.0 和 frozen lockfile。
- [ ] 运行 `pnpm install --frozen-lockfile`、`pnpm lint`、`pnpm format:check`、`pnpm build`。

### Task 3: 配置 GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `astro.config.ts`
- Modify: `astro-paper.config.ts`

**Interfaces:**
- Consumes: buildable AstroPaper project
- Produces: `/Zblog/` Pages deployment

- [ ] `site` 使用 `https://zzkkoo8.github.io`。
- [ ] `base` 使用 `/Zblog`。
- [ ] Deploy workflow 使用 `withastro/action@v5` 和 `actions/deploy-pages@v4`。
- [ ] 仅 `main` push 和手动 dispatch 可部署。

### Task 4: PR 验收与合并

**Files:**
- Review: all changed files

**Interfaces:**
- Consumes: 完整功能分支
- Produces: 可发布 `main`

- [ ] 关闭旧 Fuwari PR，避免双方案并行。
- [ ] 新建 AstroPaper PR。
- [ ] 检查 PR 无 Fuwari 残留、无 AstroPaper demo 身份。
- [ ] 确认最终 CI 对 PR 最新 head 成功。
- [ ] squash merge 到 `main`。

### Task 5: Pages 实际发布验收

**Files:**
- Review: GitHub Actions / public site

**Interfaces:**
- Consumes: merged `main`
- Produces: 可访问博客

- [ ] 确认 deploy workflow 成功。
- [ ] 确认 `https://zzkkoo8.github.io/Zblog/` 返回成功页面。
- [ ] 验证首页、首篇文章、Archives、Tags、Search、RSS、Sitemap。
- [ ] 若 Pages Source 尚未启用 GitHub Actions，仅报告所需的唯一 GitHub Settings 操作。
