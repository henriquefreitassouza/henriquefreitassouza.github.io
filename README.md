# Educação e tecnologia no Brasil

An academic blog about education and technology in Brazilian schools, with posts in Portuguese, English and Spanish. It is published at **https://henriquefreitassouza.github.io**.

- **Nuxt 4 + Nuxt Content**, generated as a static site and deployed to GitHub Pages by GitHub Actions.
- **Content is separate from code.** Each page is a `.md` file (text) next to a `.yml` file (metadata) in `content/`.
- **Accessible by default:** WCAG 2.2 AA at minimum, every chart with its data table, every image and diagram with a text description.
- **Citations at build time:** write `[@id]` and get ABNT (or APA) in-text citations, a reference list and "how to cite this article".
- **No tracking, no cookies and no database in the browser.**

## Get started

Requires the Node version in `.nvmrc` (use nvm) and pnpm.

```bash
nvm use
pnpm install
pnpm dev            # http://localhost:3000
```

To write content, see [docs/writing-guide.md](docs/writing-guide.md).

## Quality checks

```bash
pnpm check          # lint, typecheck, unit tests, build, HTML validation, accessibility tests
```

The same checks run on every pull request (`.github/workflows/ci.yml`) and before every deploy (`.github/workflows/deploy.yml`).

## Principles and agents

Every change follows five sets of principles:
- [coding](docs/principles/coding.md)
- [accessibility](docs/principles/accessibility.md)
- [information design](docs/principles/information-design.md)
- [SEO](docs/principles/seo.md)
- [content](docs/principles/content.md)

AI agents start from [AGENTS.md](AGENTS.md), which defines five roles: coding, review, design, SEO and content. Their Claude Code versions are in `.claude/agents/`.

## Third-party files

- `modules/content-pipeline/csl/`: CSL styles (ABNT, APA) and locales from the [Citation Style Language](https://github.com/citation-style-language) project, under CC BY-SA 3.0.
