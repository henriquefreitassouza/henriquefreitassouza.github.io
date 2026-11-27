@AGENTS.md

## Claude Code notes

- The five roles are subagents in `.claude/agents/` (coding, review, design, seo, content). Delegate to the matching one, and always finish with `review`.
- After `await` inside a composable, Nuxt context is lost: call composables first, or use `nuxtApp.runWithContext` (see `app/composables/usePage.ts`).
- The Nuxt build directory for `generate` is `node_modules/.cache/nuxt/.nuxt`, while `nuxt prepare`/dev use `.nuxt`. If `sitemap.md` shows stale entries after a drafts build, delete `node_modules/.cache/nuxt/.nuxt/cache`.
