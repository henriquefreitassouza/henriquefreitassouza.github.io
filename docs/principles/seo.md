# SEO principles

The goal: people find the research through search engines and AI assistants, and the content is never used for AI training without consent. The [SEO agent](../../.claude/agents/seo.md) owns this document.

## Technical rules (already built in, keep them working)

- **Static, prerendered HTML** for every page. Every URL works without JavaScript.
- **Canonical URLs** with a trailing slash (`/blog/my-post/`). GitHub Pages serves `<path>/index.html`, so this avoids redirects. The policy lives in `site.trailingSlash` and in `experimental.defaults.nuxtLink`.
- **Localized friendly URLs.**
  - The folder name is the slug, written in the page's language: lowercase ASCII and hyphens, no accents, no dates or IDs. The build enforces this.
  - pt-BR has no prefix; English and Spanish use `/en/` and `/es/`. Example: `/blog/andei-20-km/` ↔ `/en/blog/i-walked-20-km/`.
  - Section slugs are localized too: `/sobre/`, `/en/about/`, `/es/acerca-de/`.
- **Translations are linked by `translationKey`.** Pages that share it get:
  - reciprocal `hreflang` tags, plus `x-default` pointing to pt-BR;
  - sitemap alternates;
  - a language switcher that lands on the translated page.
- **Changing a published slug breaks links.** Avoid it. If it must happen, follow [Redirects](#redirects).
- **One `sitemap.xml` for all languages.** Each page appears once, with its translations as `hreflang` alternates (`xhtml:link`), and `robots.txt` points to it. Drafts and `noindex` pages are excluded. Split it into a sitemap index only past the protocol's limits (50,000 URLs or 50 MB).
- **Structured data (schema.org):**
  - `WebSite` and `Person` (the author) on every page.
  - `ScholarlyArticle` on posts, with the headline, abstract, authors, dates, language and keywords.
  - `BreadcrumbList` on inner pages.
- **Feeds:** RSS 2.0 per language at `/feed/<locale>.xml`.
- **Speed:** no web fonts, no analytics, build-time rendering, and heavy scripts loaded only where they are used.

## Redirects

**The rule:** when a page moves, its old address must answer with a redirect status code in the HTTP response, not a page.

| Status | Meaning | When |
|---|---|---|
| `301` / `308` | Moved permanently. Search engines move the old URL's ranking signals to the new one and index the new URL. | Slug changes, merged pages, removed sections. |
| `302` / `307` | Moved temporarily. Search engines keep the old URL indexed. | Short-lived moves only. |

**The limit:** GitHub Pages can't send redirect status codes. It serves files only, with no server configuration, so every page it serves answers `200` (or `404`). The best it can do is an **instant meta refresh**:
- Google treats an instant meta refresh (0 seconds) as a permanent redirect, so this is the closest equivalent to a `301` ([Google Search Central: Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects)). Other engines may handle it less reliably.
- A delayed refresh (more than 0 seconds) counts as temporary. It also fails WCAG 2.2.1 (technique F41), because it moves the reader on a timer. It is never used here.
- **Consequence: GitHub Pages can't make temporary redirects.** For a temporary move, leave a normal page at the old address with a link to the new one.

**On this site, a permanent move needs all of the following:**
1. **Change the slug** (the folder name), and update every internal link. The build's link checker lists the broken ones.
2. **Add a redirect page** at the old address, in `public/<old path>/index.html`. It is a static file, so it is copied as it is, and it must stay accessible:

   ```html
   <!doctype html>
   <html lang="pt-BR">
   <head>
     <meta charset="utf-8">
     <title>Página movida</title>
     <meta http-equiv="refresh" content="0; url=/blog/new-slug/">
     <link rel="canonical" href="https://henriquefreitassouza.github.io/blog/new-slug/">
   </head>
   <body>
     <p>Esta página mudou para <a href="/blog/new-slug/">/blog/new-slug/</a>.</p>
   </body>
   </html>
   ```

   Use the old page's language, a real title and a visible link for readers whose browser ignores the refresh. Don't add `noindex`: it conflicts with the canonical link. Don't use Nitro's `routeRules` redirects: on a static host they produce a page with no title, language or link.
3. **Check the sitemap.** The new URL is in it automatically; the old one is not, because it is not content.
4. **Update `hreflang`.** If the page has translations, they already point to the new URL through `translationKey`.

**If real status codes become necessary** (many moves, or temporary redirects), the site needs a host that can send them: for example Cloudflare or Netlify (`_redirects` files), or a CDN with redirect rules in front of GitHub Pages. Moving hosts is an SEO decision that a human must approve.

## AI and crawler policy

| What | How |
|---|---|
| Search and answer engines may read and cite | `robots.txt` allows all agents by default, including `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot` and `Googlebot`. |
| Training crawlers are refused | `robots.txt` disallows `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `Bytespider` and `meta-externalagent`. Review this list every six months; crawler names change. |
| Usage signals | `Content-Signal: search=yes, ai-input=yes, ai-train=no` in `robots.txt`. |
| Legal reservation (EU TDM) | `<meta name="tdm-reservation" content="1">` on every page, plus `/.well-known/tdmrep.json`. |
| Discovery for agents | `/llms.txt` (an index of pages) and a Markdown copy of each page at `<path>.md`. There is deliberately no `llms-full.txt`. |

GitHub Pages cannot set HTTP headers, so every header-based signal uses its `<meta>`, `<link>` or file equivalent.

## Pre-publication checklist (every public page)

- [ ] **Title:** unique, descriptive, about 60 characters or fewer, with the main term first. It is the `h1`.
- [ ] **Description:** 50–160 characters (the build enforces this) and written as a summary, not a teaser.
- [ ] **Slug:** short, in the page's language, with meaningful words only.
- [ ] **Headings:** in order, each one describing its section.
- [ ] **Links:** descriptive link text (never "click here"), with at least one internal link to related content.
- [ ] **Media:** every item has the three accessibility layers. Image file names are descriptive.
- [ ] **Translations:** each version shares the same `translationKey`, and the switcher lands on the right page.
- [ ] **Posts:** tags reuse existing tags where possible (no near-duplicates). `datePublished` is set, and `dateModified` too when the content changes materially.
- [ ] **Not ready?** Keep `draft: true`. Set `noindex: true` only for pages that should exist but not be searchable.
- [ ] **Never use black-hat SEO:** no keyword stuffing, hidden text, doorway pages, cloaking (serving bots different content) or bought links.
