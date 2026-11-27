# Coding principles

These rules apply to every change, by people or by AI agents. The [review agent](../../.claude/agents/review.md) checks each one before a pull request is opened.

## 1. Keep it simple (KISS)

- This is a static blog. Prefer the simplest thing that works: a template over a component, a component over a composable, a composable over a plugin, a plugin over a module.
- Use what Nuxt and its official modules already do before you write code. Read their docs first.
- No speculative features. Build what a page or post needs today.
- A reader who knows Vue should understand any file in a single read. If a file needs a long explanation, simplify it.

## 2. Don't repeat yourself (DRY), without over-abstracting

- Extract shared logic once it is **used at least twice, in a meaningful way**. Don't extract code that might be reused someday.
- **No one- or two-line helpers** used in one place. Inline them.
- One source of truth for each fact:
  - Site settings, locales and navigation: `content/config.yml`.
  - Interface text: `i18n/locales/*.yml`.
  - Metadata schemas: `shared/content-schema.ts`.
  - Colours and fonts: `app/assets/css/tokens.css`.
- Shared helpers live where Nuxt auto-imports them: `app/utils/` (browser and prerender), `shared/utils/` (app and server), `app/composables/` (code that uses Vue or Nuxt context).

## 3. Design patterns: only when they are the simplest fit

Use a pattern when it removes complexity, never to look sophisticated. The patterns this codebase already relies on:

| Pattern | Where | Why it is the simplest fit |
|---|---|---|
| Pipeline (pure functions) | `modules/content-pipeline/pipeline.ts` | Each `.md` + `.yml` pair goes through the same steps (route → validate → cite → front matter), and each step can be tested on its own. |
| Provide/inject | `Diagram` → `ProsePre`, `DataTable` → `ProseTable` | Markdown nests the code block or table inside the wrapper; this is the only way for the wrapper to pass along its accessible name. |
| Guard (fail fast) | `assertAccessible`, schema validation | A missing alternative or a bad `.yml` stops the build instead of shipping. |

New patterns must be justified in the pull request description.

## 4. TypeScript everywhere

- Write all code in TypeScript (`.ts`, or `<script setup lang="ts">` in `.vue` files), with `strict` on. Avoid `any`. Use `as` casts only at real boundaries (for example, parsed YAML), and say why.
- Types come from the schemas (`shared/content-schema.ts` → Nuxt Content's generated types), not from hand-written copies.

## 5. Static site and data rules

- **No database at runtime.** A database is allowed during the build (Nuxt Content indexes the content with SQLite). The published site must never query one:
  - Every content query in pages and components runs inside `useAsyncData`, so prerendering stores its result in the page payload.
  - The build deletes the SQL dumps and the SQLite WebAssembly files.
  - A Playwright test fails if any page requests a database file.
  - The 404 page can also appear after client-side navigation, where no prerendered payload exists for it. So it reads a prerendered static file (`/latest-posts.json`, from `server/routes/latest-posts.json.ts`) instead of querying content.
- **No visitor data on a server.** GitHub Pages has no server to write to. Reader preferences, if any are ever added, go in `localStorage`, and the page must still work when storage is unavailable.
- **Context after `await`.** Nuxt composables lose their context after an `await` inside a plain function. In `<script setup>`, Nuxt restores it automatically. In composables, call composables before the first `await`, or use `nuxtApp.runWithContext` (see `app/composables/usePage.ts`).

## 6. Performance

- Build-time work beats runtime work: highlighting, math (MathML), citations and charts (SVG) are all rendered during prerendering.
- **Heavy libraries load only when they are needed:**
  - Use a dynamic `import()`, and start it only when the element that needs it comes near the screen (`IntersectionObserver`). Example: Mermaid in `ProsePre.vue`, about 2 MB that most readers of a page never scroll to.
  - **No prefetch hints for lazily imported code.** They are turned off in `nuxt.config.ts` (`build:manifest` hook). Links prefetch the next page only on hover or focus.
- No web fonts, no CSS framework, no client-side analytics.
- **Budget (mobile Lighthouse, on `pnpm preview`):**
  - Performance score of 90 or more on every page type, and 100 in the other categories.
  - Under about 200 KiB transferred before the reader scrolls.
  - Record the scores in the pull request when a change touches the layout, the components or the build.

### Caching and compression

What GitHub Pages does, checked against the live site on 2026-11-27:
- It serves every file from a CDN (Fastly) over HTTP/2 and compresses text files with gzip.
- It sends `Cache-Control: max-age=600` on **every** file, plus `ETag` and `Last-Modified`. After 10 minutes the browser revalidates and gets a cheap `304 Not Modified` if nothing changed.
- **These headers can't be changed on GitHub Pages.** Lighthouse will keep reporting "Use efficient cache lifetimes"; that is a known hosting limit, not a bug to fix in the code.

How the build is prepared for long caching anyway:
- **Code is split into files with a content hash in their names** (`/_nuxt/<hash>.js`, `/_nuxt/entry.<hash>.css`). A changed file gets a new name, so these files could safely be cached for a year.
- **Don't bundle everything into one file.** One edit would invalidate all of it, and every page would download code it doesn't use. Small shared chunks cost little over HTTP/2.
- **If the site moves behind a CDN that allows cache rules** (for example Cloudflare in front of GitHub Pages; a human decides):
  - `/_nuxt/*`: `Cache-Control: public, max-age=31536000, immutable`.
  - HTML pages, `_payload.json`, feeds, `sitemap.xml`, `robots.txt`, `llms.txt` and the `.md` copies: short or revalidated (`max-age=600` or `no-cache` with `ETag`). Their names never change.
  - `/media/*` and `/_ipx/*`: short (`max-age=86400`) or revalidated. Their names don't change when the image changes.

**`pnpm preview` imitates GitHub Pages** (gzip, `max-age=600`, `304` responses, `404.html`), so local Lighthouse runs show production behaviour. Only HTTP/2 and the CDN are missing, so real pages load somewhat faster than the local results.

## 7. Images

### Choose the format by the content

| Content | Format | Why |
|---|---|---|
| Charts, diagrams, icons, logos, simple drawings | **SVG** (vector) | Sharp at any size and density, usually a few KB, and its text can be read and searched. `::chart` and Mermaid already produce SVG. |
| Photos, screenshots, scans | **Raster.** Upload one JPEG (photos) or PNG (screenshots, flat colours); the build makes the AVIF and WebP versions. | Raster formats are the only practical way to store photographic detail. |

- **Optimise SVG files** before committing them, for example with SVGO: remove editor metadata and hidden layers.
- **Prefer SVG to `<canvas>`.** A canvas is a bitmap with no structure that assistive technology can read. Use it only when SVG can't do the job (tens of thousands of marks), and then with the same three layers of alternatives as any other media.
- **No text inside raster images** (see the accessibility principles).

### Size images for the screen that shows them

- **Layout uses CSS pixels; screens have device pixels.**
  - The device pixel ratio (DPR) is how many device pixels a screen uses for each CSS pixel, per side.
  - Typical values: 1 on most external monitors; 2 on Retina Macs, iPads and many laptops; 2 to 3 (sometimes more) on phones. Browser zoom raises it too.
- **Pixels a file needs = the width of its slot in CSS px × DPR.** The viewport width alone doesn't decide it.
  - A 1440 px wide window on a Retina Mac still shows a 640 CSS px column, which needs 1280 device px.
  - A phone 390 CSS px wide with DPR 3 needs 1170 px.
- **On this site:**
  - Content images fill the text column: at most **640 CSS px** wide (`70ch` at the default 16 px font), and the full screen width below that.
  - **The largest useful file is therefore 1280 px wide (2×).** Above 2× the visible gain is small, while the file keeps growing with the pixel count: a 3× file has 2.25 times the pixels of a 2× one.
- **`ResponsivePicture` does this for you** (used by `::image-figure` and markdown images):
  - It lists 320, 640, 960 and 1280 px versions, never wider than the source, in a `srcset`.
  - Its `sizes` attribute describes the slot, so the browser downloads only the smallest file that covers the slot × DPR.
    - A standard desktop gets the 640 px file.
    - A DPR 2 phone 360 px wide gets the 960 px file.
    - A Retina laptop gets the 1280 px file.
  - It serves AVIF, then WebP, then the source format as a fallback.
  - It serves SVG unchanged.
- **Authors:**
  - Upload photos **at least 1280 px wide**; a smaller source is served at its own size.
  - Give the source's real `width` and `height`.
- **If the column width changes** (`--measure` in `tokens.css`), update `COLUMN` in `ResponsivePicture.vue` and the numbers above.

### Load images without slowing or shifting the page

- **Always set `width` and `height`.** The browser reserves the space before the file arrives, so the text doesn't jump (Cumulative Layout Shift). That jump also makes screen-magnifier users lose their place. The build fails without them.
- **Images in the body use `loading="lazy"` and `decoding="async"`.** An image that is the largest thing on the first screen (the LCP element) should load eagerly with `fetchpriority="high"` instead; no template has one today.
- **Budget:** the largest generated file of a photo should stay under about 200 KB. Check the output in `.output/public/_ipx/`.

Further reading:
- [Serve responsive images (web.dev)](https://web.dev/articles/serve-responsive-images)
- [Responsive images (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Responsive_images)

## 8. Browser support for features we write ourselves

Nuxt, Vue and the official modules handle browser support for what they generate. Anything written by hand outside them must be checked before use: HTML elements and attributes, CSS properties, selectors and at-rules, and JavaScript or Web APIs.

1. **Accessibility comes first.**
   - Check that the feature works with assistive technology: read its notes on [a11ysupport.io](https://a11ysupport.io/) and MDN, and test it with a screen reader and the keyboard.
   - If it isn't accessible, don't use it, however well browsers support it. Use an accessible alternative, usually native HTML.
2. **Then check browser support on [caniuse.com](https://caniuse.com/),** using its Baseline status, which covers current Chrome, Edge, Firefox and Safari on desktop and mobile.
   - **Baseline "widely available"** (supported everywhere for 30 months or more): use freely.
   - **Baseline "newly available" or limited:** use only as a progressive enhancement. The page must still work fully without it. Detect support with `@supports` in CSS or a feature check in JavaScript.
3. **Record the check in the pull request:** the feature, its caniuse link, its Baseline status, the accessibility notes and the fallback.

Features chosen by hand so far (checked against the Baseline data on 2026-11-27):

| Feature | Where | Baseline | Notes |
|---|---|---|---|
| CSS system colours, `color-scheme`, `color-mix()` | `tokens.css` | Widely available | |
| Logical properties, flexbox `gap`, `clip-path` | `main.css` | Widely available | |
| `text-decoration-thickness`, `text-underline-offset` | `main.css` | Widely available | |
| `:focus-visible` | `main.css` | Widely available | |
| `prefers-color-scheme`, `prefers-reduced-motion`, `forced-colors` | `main.css`, tests | Widely available | |
| `scroll-behavior` | `main.css` | Widely available | Only when `prefers-reduced-motion: no-preference`. |
| `text-size-adjust` | `main.css` | Limited (Chromium only) | A harmless hint: browsers without it ignore it. |
| `<details>` / `<summary>` | Charts, figures, diagrams | Widely available | |
| MathML | Math (KaTeX output) | Widely available | |
| `<picture>`, `srcset`, WebP | `ResponsivePicture` | Widely available | |
| AVIF | `ResponsivePicture` | Widely available (since 2026-07) | WebP and the source format are fallbacks. |
| `loading="lazy"` on images | `ResponsivePicture` | Widely available (since 2026-06) | |
| `IntersectionObserver` | Loading Mermaid in `ProsePre` | Widely available | |
| Async Clipboard API | Copy button in `ProsePre` | Newly available | The button appears only when `navigator.clipboard` exists; code can always be copied by hand. |

## 9. Workflow

1. Create a branch from `main` (`feat/…`, `fix/…`, `docs/…`, `content/…`).
2. Make the change and run `pnpm check`. It runs lint, typecheck, unit tests, the drafts build, HTML validation and the accessibility and navigation tests. Then run the relevant [manual checks](#10-manual-checks).
3. Ask the review agent, and the design, SEO or content agent when relevant, to review the change.
4. A human approves the change. Only then do you push the branch and open a pull request, using the [template](../../.github/pull_request_template.md).
5. Describe what changed, why, and which tests and principle checks ran.

## 10. Manual checks

These need a person or a public URL, so `pnpm check` can't run them. Run them before a release and after any change to their area, and record the results in the pull request.

| Check | When | How |
|---|---|---|
| Screen reader and keyboard only | Layout, components, content structure | Orca (Linux), NVDA (Windows) or VoiceOver (macOS, iOS). |
| [Site Seeing](https://lab.ishadeed.com/tools/site-seeing/) conditions | Layout, styles | Each condition, on the home page, a post and the 404 page. |
| Lighthouse, mobile | Layout, components, build | On `pnpm preview`; see the budget under Performance. |
| [Is It Agent Ready?](https://isitagentready.com/) | Routing, head tags, robots, sitemap, `llms.txt`, deployment | On the **deployed** site (it needs a public URL), with the "Content Site" scan. |

Agent-readiness results that are expected, because of GitHub Pages:
- **Pass:** robots.txt, Sitemap, AI bot rules, Content Signals.
- **"Link headers":** expected to fail. GitHub Pages can't send HTTP headers, so the same links are in each page's HTML (`<link rel="alternate" type="text/markdown">` and `<link rel="describedby" href="/llms.txt">`).
- **"Markdown negotiation"** (serving Markdown when asked with `Accept: text/markdown`): expected to fail. It needs a server; each page's Markdown copy is linked at `<path>.md` instead.
- **"DNS for AI Discovery":** not possible on a `github.io` address; it needs our own domain.
- **API, authentication, MCP and commerce checks:** not applicable to a content site.

Any other failure must be fixed, or justified in the pull request.

## 11. Tooling

- Use **pnpm only**, never npm or yarn. The pnpm version is pinned in `package.json` (`packageManager`).
- Node is pinned in `.nvmrc`: run `nvm use`.
- When a dependency needs an install script, allow it explicitly in `pnpm-workspace.yaml` (`allowBuilds`) and say why in the pull request.
