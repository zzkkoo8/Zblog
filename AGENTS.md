# Zblog Agent Rules

## Source of truth

- GitHub `main` is the single source of truth (SSOT).
- Do not maintain a second authoritative copy of posts outside this repository.

## Content

- Blog posts live in `src/content/posts/`.
- Zblog is for technical articles, tutorials, retrospectives, solution analysis and engineering notes.
- Reusable commands, runbooks and troubleshooting manuals belong in Zwiki; link to Zwiki instead of duplicating them here.
- Never commit passwords, API keys, tokens, customer data or other sensitive information.

## Changes

- Keep each post focused on one topic.
- Preserve valid frontmatter and use `YYYY-MM-DD` for `published` / `updated` dates.
- Theme, dependency or build configuration changes require `pnpm check` and `pnpm build` before merge.
- Prefer small changes and do not upgrade Fuwari/Astro dependencies as part of unrelated article edits.
