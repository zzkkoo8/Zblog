# Zblog Initialization Implementation Plan

> **Status:** Tasks 1–3 complete. Task 4 is in PR validation.

**Goal:** 初始化一个可在 `https://zzkkoo8.github.io/Zblog/` 自动发布的 Fuwari + Astro 中文个人技术博客。

**Architecture:** GitHub `main` 是源码与文章 SSOT。初始化阶段从固定的 Fuwari 提交生成源码、应用 Zblog 配置并完成构建验证；一次性 workflow 已在生成完成后删除。正常开发由 CI 验证，Pages workflow 从 `main` 发布 `dist/`。

**Tech Stack:** Astro 5.13.10（跟随 Fuwari 锁定提交）、Fuwari、pnpm 9.14.4、Pagefind、GitHub Actions、GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-03-zblog-initialization-design.md`

## Global Constraints

- 上游 Fuwari 固定为 `415fb97054e57bb85da86e2ca4ea4a1ae7266219`；该提交已在 Node 22 下通过 `pnpm check` 与 `pnpm build`。
- GitHub Pages URL 为 `https://zzkkoo8.github.io/Zblog/`。
- Astro `site` 为 `https://zzkkoo8.github.io`，`base` 为 `/Zblog`。
- 文章统一位于 `src/content/posts/`。
- 首版不引入 CMS、评论、统计、数据库或自定义域名。
- 主题、依赖和构建配置修改必须通过 `pnpm check` 与 `pnpm build`。

---

### Task 1: Bootstrap Fuwari scaffold — COMPLETE

- [x] 固定并验证可构建的 Fuwari 基线。
- [x] 生成 Fuwari 源码并删除上游演示文章。
- [x] 设置 Zblog 站点标题、中文语言、GitHub/Zwiki 导航和通用头像。
- [x] 配置 `site=https://zzkkoo8.github.io` 与 `base=/Zblog`。
- [x] 创建 `README.md`、`AGENTS.md`、关于页和首篇文章。
- [x] 在 Node 22 / pnpm 9.14.4 下通过 frozen install、`pnpm check`、`pnpm build`。
- [x] 将验证后的源码提交到 `feat/bootstrap-zblog`。
- [x] 删除 bootstrap 与诊断用的一次性 workflow。

### Task 2: CI and GitHub Pages deployment — COMPLETE

- [x] 新增 `.github/workflows/ci.yml`。
- [x] CI 在 PR 和 `main` 上执行 frozen install、`pnpm check`、`pnpm build`。
- [x] 新增 `.github/workflows/deploy.yml`。
- [x] Pages workflow 仅在 `main` push 或手工触发时部署 `dist/`。
- [x] 使用 GitHub Pages 官方 `configure-pages`、`upload-pages-artifact`、`deploy-pages` Actions。

### Task 3: Source and content review — COMPLETE

- [x] 验证 `astro.config.mjs` 的 Pages 子路径配置。
- [x] 验证 `src/content/posts/` 仅保留 `about-zblog.md`。
- [x] 验证 `AGENTS.md` 明确 GitHub `main` 为 SSOT、文章目录、敏感信息禁令和构建门禁。
- [x] 将根包名从 `fuwari` 改为 `zblog`，其余依赖保持验证通过的稳定基线。
- [x] 删除无用的 `vercel.json`；保留 Fuwari MIT `LICENSE` 和来源说明。

### Task 4: PR validation and merge — IN PROGRESS

- [x] Open PR #1: `feat: initialize Zblog with Fuwari`.
- [x] Review changed-file inventory and remove temporary/unrelated deployment configuration.
- [ ] Confirm final PR CI succeeds against the latest head commit.
- [ ] Squash merge PR #1 to `main`.
- [ ] Confirm GitHub Pages deployment succeeds.
- [ ] Smoke-test `/Zblog/`, the first post, archive, RSS and search-related assets on the published site.
