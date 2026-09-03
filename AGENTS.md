# Zblog Agent Rules

## Source of truth

- GitHub `main` is the single source of truth (SSOT).
- Do not maintain another authoritative copy of posts outside this repository.

## Content

- Blog posts live in `src/content/posts/`.
- Zblog is for technical articles, tutorials, retrospectives, solution analysis and engineering notes.
- Reusable commands, runbooks and troubleshooting manuals belong in Zwiki; link to Zwiki instead of duplicating them here.
- Never commit passwords, API keys, tokens, customer data or other sensitive information.

## Changes

- Preserve valid AstroPaper frontmatter.
- Theme, dependency or build changes require a clean CI build before merge.
- Prefer small changes and never upgrade AstroPaper/Astro dependencies as part of unrelated article edits.
- Treat `satnaing/astro-paper@35cfa7fbe0b897306d27670d3819e55d5205f3dd` as the initial upstream baseline.
