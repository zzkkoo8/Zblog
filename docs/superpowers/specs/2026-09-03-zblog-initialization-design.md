# Zblog 初始化设计

## 目标

将 `zzkkoo8/Zblog` 初始化为个人技术博客，使用 Fuwari + Astro，源码与文章统一保存在 GitHub `main`，通过 GitHub Actions 自动构建并发布到 GitHub Pages：`https://zzkkoo8.github.io/Zblog/`。

## 架构

```text
ChatGPT / Codex / 人工
        ↓
zzkkoo8/Zblog (SSOT)
        ↓
GitHub Actions
        ↓
Astro + Fuwari
        ↓
GitHub Pages
```

## 技术选型

- 上游主题：`saicaca/fuwari`，初始化时固定到已审核提交 `415fb97054e57bb85da86e2ca4ea4a1ae7266219`。
- Astro：跟随该 Fuwari 提交锁定版本，不单独升级。
- 包管理器：pnpm，跟随上游 `pnpm-lock.yaml`。
- 部署：GitHub Actions + GitHub Pages。
- 搜索：Fuwari 内置 Pagefind。
- 内容：Markdown / MDX，文章统一放 `src/content/posts/`。

## 首版范围

保留 Fuwari 的响应式布局、亮暗主题、搜索、归档、标签、分类、RSS 和文章目录。删除上游演示文章，不引入 CMS、评论、统计、数据库或自定义域名。

站点默认配置：

- 标题：`Zblog`
- 副标题：`个人技术博客`
- 语言：`zh_CN`
- 作者：`zzkkoo8`
- 简介：`记录技术实践、故障复盘与工程思考。`
- GitHub：`https://github.com/zzkkoo8/Zblog`
- Zwiki：`https://zwiki.gitbook.io/zwiki-docs/`
- Pages site：`https://zzkkoo8.github.io`
- Astro base：`/Zblog`

## 内容边界

- Zblog：经验总结、教程、实践复盘、方案分析与技术思考。
- Zwiki：可长期复用的命令、操作手册、知识条目和故障排查手册。
- 同一主题允许博客文章引用 Zwiki，但避免复制维护同一份权威操作文档。

## 自动化

- CI：每次 PR 和 `main` 更新执行 `pnpm install --frozen-lockfile`、`pnpm check`、`pnpm build`。
- Pages：`main` 通过构建后使用 GitHub Pages 官方 Actions 发布 `dist/`。
- 初始 bootstrap：仅当仓库尚无 `package.json` 时，从固定 Fuwari 提交生成源码；构建验证通过后才提交生成结果。

## AI 维护约束

新增 `AGENTS.md`：GitHub `main` 为唯一事实源；文章只写 `src/content/posts/`；修改主题或依赖必须先构建验证；不提交密钥或敏感信息。

## 验收

1. 仓库存在完整 Astro/Fuwari 源码和锁文件。
2. 无 Fuwari 演示文章，仅保留 Zblog 自有首篇文章。
3. `astro.config.mjs` 正确设置 `site` 与 `/Zblog` base。
4. `pnpm check` 和 `pnpm build` 成功。
5. GitHub Pages workflow 可成功发布。
6. 首页、文章页、搜索、RSS、归档在 `/Zblog/` 子路径下可正常访问。
