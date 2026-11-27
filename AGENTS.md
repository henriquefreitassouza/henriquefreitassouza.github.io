# AGENTS.md

Instructions for any AI agent working on this repository (Claude Code, Codex, Copilot, Cursor and others). People can read it too.

## Project

An academic, trilingual (pt-BR default, en, es) blog on education and technology in Brazil, built with Nuxt 4 + Nuxt Content and published as a static site on GitHub Pages (`https://henriquefreitassouza.github.io`).

## Non-negotiables

1. **Accessibility first:** WCAG 2.2 AA at minimum. Every rich-media item has three layers of alternatives. → [docs/principles/accessibility.md](docs/principles/accessibility.md)
2. **Content and code are separate:**
   - Pages are `content/<locale>/…/<slug>/<slug>.md` (text only) plus `<slug>.yml` (metadata only), with no front matter.
   - Interface text is in `i18n/locales/`.
   - Site settings are in `content/config.yml`.
3. **No database at runtime.** SQLite is used only during the build. The site reads only prerendered payloads. → [docs/principles/coding.md](docs/principles/coding.md#5-static-site-and-data-rules)
4. **KISS and DRY, without over-abstraction:** no single-use helpers, and design patterns only when they are the simplest fit. → [docs/principles/coding.md](docs/principles/coding.md)
5. **Every borrowed claim is cited,** in ABNT by default. → [docs/principles/content.md](docs/principles/content.md)
6. **No deceptive patterns:** no infinite scroll, pop-ups, confirmshaming or tracking. → [docs/principles/information-design.md](docs/principles/information-design.md)
7. **SEO without black-hat tactics:** localized friendly URLs, hreflang, and an AI policy that allows search and refuses training. → [docs/principles/seo.md](docs/principles/seo.md)

## Agent roles

Each role owns one set of principles. A change touching several areas needs a sign-off from each relevant role. In Claude Code, these roles are subagents in `.claude/agents/`.

| Role | Responsible for | Reads first |
|---|---|---|
| **coding** | Full-stack implementation: Vue/Nuxt, the content pipeline, server routes, tests, CI. | coding.md, accessibility.md |
| **review** | Reviews every change against **all** principles, runs `pnpm check`, and reports pass/fail with evidence. It never approves its own code. | all principles |
| **design** | UX, UI and graphic design, and accessibility in both technical and content terms. Rejects media without alternatives. | accessibility.md, information-design.md |
| **seo** | Technical and content SEO, URLs and translations, structured data, crawler policy. | seo.md |
| **content** | Accuracy, references and source quality, citation style, language norms (pt-BR, en, es), plain-language summaries. | content.md, writing-guide.md |

## Commands

```bash
nvm use                       # Node version from .nvmrc
pnpm install                  # pnpm only, never npm or yarn
pnpm dev                      # http://localhost:3000 (INCLUDE_DRAFTS=1 to show drafts)
pnpm lint                     # ESLint (with stylistic rules)
pnpm typecheck                # vue-tsc, strict
pnpm test                     # unit tests (Vitest)
INCLUDE_DRAFTS=1 pnpm generate
pnpm validate:html            # html-validate on the generated site
pnpm test:e2e                 # Playwright + axe-core on the generated site
pnpm check                    # all of the above, in order
```

## Where things are

| Path | What |
|---|---|
| `content/` | All text and metadata (see [docs/writing-guide.md](docs/writing-guide.md)). |
| `modules/content-pipeline/` | Merges `.yml` into `.md` at build time, validates it, renders citations (CSL), and deletes the runtime database files. |
| `shared/content-schema.ts` | Metadata schemas (one source of truth for validation and types). |
| `app/components/content/` | Components usable in markdown (`::chart`, `::image-figure`…) and overrides of the default markdown elements (`Prose*`). |
| `app/composables/usePage.ts` | How pages load content, set `<head>`, and find their translations. |
| `server/` | Sitemap alternates and RSS feeds (prerendered). |
| `tests/` | `unit/` (pipeline, paths) and `e2e/` (accessibility, navigation, no-database guard). |
| `docs/principles/` | The five principle documents. |

## Workflow

1. Branch from `main`: `feat/…`, `fix/…`, `docs/…` or `content/…`.
2. Implement, then run `pnpm check` until everything passes.
3. Run the **review** role, plus design, SEO or content when their area is touched.
4. **Wait for a human to approve** before pushing.
5. Push and open a pull request using `.github/pull_request_template.md`. Describe the changes in detail, list the tests run and record each principle check.

Never commit secrets. Never push to `main` directly. Never merge your own pull request.
