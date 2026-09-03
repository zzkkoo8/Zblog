# Zblog AstroPaper 迁移设计

## 目标

将 `zzkkoo8/Zblog` 从未完成的 Fuwari 初始化方案切换为 AstroPaper 官方模板，保持 GitHub `main` 为唯一事实源，并通过 GitHub Actions 自动发布到 `https://zzkkoo8.github.io/Zblog/`。

## 选型结论

- 模板：`satnaing/astro-paper`
- 固定上游提交：`35cfa7fbe0b897306d27670d3819e55d5205f3dd`
- 选择原因：公开 GitHub Template、持续维护、约 4.9k stars、Markdown/MDX、Pagefind、RSS、Sitemap、SEO、亮暗主题、无数据库依赖，并有 2026 年更新的 GitHub Pages 部署文档。
- 不继续 Fuwari：当前 Zblog 已实际遇到上游依赖/构建回归，继续维护私有补丁不符合“复制成熟模板、最少改动”的目标。
- 不选择 Hugo PaperMod：成熟度和 star 更高，但会引入 Hugo/Go 体系迁移；当前 Astro 工作流与 AI 维护已经建立，AstroPaper 的收益/改动比更优。

## 架构

```text
ChatGPT / Codex / 人工
        ↓
zzkkoo8/Zblog (GitHub SSOT)
        ↓
Markdown / MDX
        ↓
AstroPaper / Astro
        ↓
GitHub Actions
        ↓
GitHub Pages
```

## 源码策略

不手工拼主题。首次迁移从固定的 AstroPaper commit 克隆官方源码，删除其 `.git`、`.github`、演示文章和作者配置后复制到 Zblog。后续 Zblog 独立维护，不自动跟随上游更新；需要升级时单独开 PR 对比并验证。

## Zblog 配置

- 站点标题：`Zblog`
- 描述：`个人技术博客，记录技术实践、故障复盘与工程思考。`
- 作者：`zzkkoo8`
- 语言：`zh-CN`
- 时区：`Asia/Singapore`
- GitHub Pages origin：`https://zzkkoo8.github.io`
- Astro base：`/Zblog`
- GitHub：`https://github.com/zzkkoo8/Zblog`
- Zwiki：`https://zwiki.gitbook.io/zwiki-docs/`
- 搜索：Pagefind
- 文章目录：采用 AstroPaper v6 默认 `src/content/posts/`

## 发布策略

- CI 运行时与 AstroPaper 上游一致：Node 24、pnpm 11.3.0。
- PR CI：`pnpm install --frozen-lockfile`、`pnpm lint`、`pnpm format:check`、`pnpm build`。
- Pages：使用 Astro 官方推荐 `withastro/action@v5` + `actions/deploy-pages@v4`。
- 仅 `main` push 触发正式部署。
- GitHub Pages Source 必须为 `GitHub Actions`。

## 内容边界

- Zblog：技术文章、教程、复盘、方案分析、工程思考。
- Zwiki：长期复用的操作手册、命令、故障排查和知识条目。
- Blog 可链接 Zwiki，但避免复制维护同一份权威文档。

## 验收

1. `main` 中为 AstroPaper 基线，不再混有 Fuwari 组件。
2. 无 AstroPaper 演示文章和原作者身份配置。
3. `site=https://zzkkoo8.github.io`、`base=/Zblog` 正确。
4. 首页、文章、Archives、Tags、Search、RSS、Sitemap 均可构建。
5. CI 从干净 runner 使用 frozen lockfile 构建成功。
6. Pages workflow 成功部署。
7. `https://zzkkoo8.github.io/Zblog/` 实际 HTTP 可访问。
