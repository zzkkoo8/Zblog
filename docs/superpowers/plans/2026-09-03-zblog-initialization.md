# Zblog Initialization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 初始化一个可在 `https://zzkkoo8.github.io/Zblog/` 自动发布的 Fuwari + Astro 中文个人技术博客。

**Architecture:** GitHub `main` 是源码与文章 SSOT。首次 bootstrap workflow 从固定的 Fuwari 提交生成源码、应用 Zblog 配置并完成构建验证；正常开发后由 CI 验证、Pages workflow 发布 `dist/`。

**Tech Stack:** Astro 5.13.10（跟随 Fuwari 锁定提交）、Fuwari、pnpm 9.14.4、Pagefind、GitHub Actions、GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-03-zblog-initialization-design.md`

## Global Constraints

- 上游 Fuwari 固定为 `6d39b0dec41282e7852e23e032998a5789abee28`。
- GitHub Pages URL 为 `https://zzkkoo8.github.io/Zblog/`。
- Astro `site` 为 `https://zzkkoo8.github.io`，`base` 为 `/Zblog`。
- 文章统一位于 `src/content/posts/`。
- 首版不引入 CMS、评论、统计、数据库或自定义域名。
- 生成源码必须先通过 `pnpm check` 与 `pnpm build` 才能提交。

---

### Task 1: Bootstrap Fuwari scaffold

**Files:**
- Create: `.github/workflows/bootstrap.yml`
- Generate: Fuwari source tree from pinned upstream commit

**Interfaces:**
- Consumes: empty/new Zblog source tree and pinned Fuwari commit.
- Produces: buildable Astro/Fuwari project on `feat/bootstrap-zblog`.

- [ ] **Step 1: Add a guarded bootstrap workflow**

Workflow must exit without changes when `package.json` already exists; otherwise clone the pinned upstream commit into a temporary directory and copy the application source while excluding upstream `.git`, `.github`, docs and demo posts.

- [ ] **Step 2: Apply Zblog configuration before verification**

Set `site: "https://zzkkoo8.github.io"`, `base: "/Zblog"`, title `Zblog`, subtitle `个人技术博客`, language `zh_CN`, profile `zzkkoo8`, GitHub URL and Zwiki URL.

- [ ] **Step 3: Create Zblog-owned files**

Create `README.md`, `AGENTS.md`, and `src/content/posts/about-zblog.md`; remove Fuwari demo posts.

- [ ] **Step 4: Verify generated scaffold**

Run:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

Expected: all commands exit `0` and `dist/` is created.

- [ ] **Step 5: Commit generated scaffold**

```bash
git add -A
git commit -m "feat: bootstrap Zblog with Fuwari"
git push origin HEAD
```

### Task 2: Add CI and GitHub Pages deployment

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: buildable Fuwari project.
- Produces: repeatable verification on PR/main and Pages deployment from `main`.

- [ ] **Step 1: Add CI workflow**

Use Node 22, Corepack and pnpm cache; run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm build` on pull requests and pushes to `main`.

- [ ] **Step 2: Add Pages workflow**

Grant `contents: read`, `pages: write`, `id-token: write`; build the site and upload `dist/` with `actions/upload-pages-artifact`, then deploy with `actions/deploy-pages`.

- [ ] **Step 3: Ensure workflows do not deploy PRs**

Deployment workflow triggers only on pushes to `main` plus manual dispatch.

### Task 3: Review generated source and content boundaries

**Files:**
- Review: `astro.config.mjs`
- Review: `src/config.ts`
- Review: `src/content/posts/about-zblog.md`
- Review: `AGENTS.md`
- Review: `README.md`

**Interfaces:**
- Consumes: generated scaffold.
- Produces: final repository ready for normal article maintenance.

- [ ] **Step 1: Verify Pages subpath configuration**

Confirm exact values:

```js
site: "https://zzkkoo8.github.io",
base: "/Zblog",
```

- [ ] **Step 2: Verify no demo article remains**

Only Zblog-owned posts may remain under `src/content/posts/`.

- [ ] **Step 3: Verify maintenance rules**

`AGENTS.md` must state GitHub `main` is SSOT, posts live in `src/content/posts/`, sensitive information is prohibited, and theme/dependency changes require build verification.

### Task 4: PR validation and merge

**Files:**
- Review: all changed files

**Interfaces:**
- Consumes: completed implementation branch.
- Produces: merged `main` suitable for Pages deployment.

- [ ] **Step 1: Open PR to `main`**

Title: `feat: initialize Zblog with Fuwari`

- [ ] **Step 2: Review diff for unintended upstream demo/config files**

Reject any Fuwari author identity, demo posts, or Vercel production URL left in active configuration.

- [ ] **Step 3: Confirm required build checks succeed**

Expected: `pnpm check` and `pnpm build` are green.

- [ ] **Step 4: Squash merge**

Merge only after review and build validation.

- [ ] **Step 5: Verify Pages deployment**

Confirm Pages workflow succeeds. If repository Pages is not yet enabled for GitHub Actions, report the single required Settings → Pages action without changing architecture.
