## What changed

<!-- Describe the change in detail: what, why, and any trade-off or deviation from the principles.
     New hand-written HTML/CSS/JS feature? Give its caniuse link, Baseline status, accessibility notes and fallback. -->

## How it was tested

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test` (unit)
- [ ] `INCLUDE_DRAFTS=1 pnpm generate`
- [ ] `pnpm validate:html`
- [ ] `pnpm test:e2e` (axe WCAG 2.2 A/AA in light, dark and forced colours; reflow; text spacing; navigation; no-database guard)
- [ ] Manual: keyboard only · screen reader · 200%/400% zoom · Site Seeing conditions · Lighthouse mobile (scores) · isitagentready.com (after deploy) <!-- say which were done -->

## Principles

| Area | Result | Notes |
|---|---|---|
| Coding (KISS, DRY, patterns, TypeScript, no runtime DB, images, browser support) | | |
| Accessibility (WCAG 2.2 AA, ARIA, UD/UDL, media alternatives) | | |
| Information design (layout, data viz, no deceptive patterns) | | |
| SEO (URLs, hreflang, metadata, structured data, crawler policy) | | |
| Content (sources, citations, language, plain-language summary) | | |

## Reviewed by

- [ ] review agent
- [ ] design / seo / content agent (when relevant)
- [ ] human approval
