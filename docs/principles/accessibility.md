# Accessibility principles

Accessibility is not negotiable. When it conflicts with aesthetics, complexity or convenience, accessibility wins. The [design agent](../../.claude/agents/design.md) owns this document, and every agent applies it.

## Foundations

**Universal Design**, with its seven principles: equitable use, flexibility in use, simple and intuitive use, perceptible information, tolerance for error, low physical effort, and size and space for approach and use. In practice, the same page works for everyone, with no separate "accessible version".

**Universal Design for Learning (UDL, CAST guidelines 3.0).** Content is educational, so it offers:
- **Multiple means of representation.** Every post has an abstract and a plain-language summary. Every chart has a data table. Every image has text alternatives.
- **Multiple means of engagement.** Reading time, a table of contents and clear structure let readers choose how deep to go.
- **Multiple means of action and expression.** Every interaction works by keyboard, by pointer and with assistive technology. Content can be copied, printed, translated and read in Reader Mode.

**WCAG 2.2, level AA as the minimum.** The AAA criteria we also meet:
- 1.4.6 Contrast (Enhanced): 7:1 for body text.
- 2.4.13 Focus Appearance.
- 2.5.5 Target Size (Enhanced): 44 × 44 px for controls.
- 1.4.8 Visual Presentation: lines of about 70 characters, no justified text, line height of at least 1.5.
- 2.4.10 Section Headings.
- 3.1.5 Reading Level: a plain-language summary for every post.

**WAI-ARIA 1.2.** The first rule of ARIA applies: use native HTML first. ARIA only adds what HTML cannot express, such as `aria-current` or `aria-labelledby`. No ARIA is better than bad ARIA.

## Page structure

- Every page has a skip link as its first focusable element, landmarks (`header`, `nav` with a label, `main`, `footer`), exactly one `h1`, and headings in order with no skipped levels.
- The `.yml` title is the `h1`. Markdown starts at `##`, and the build rejects `#`.
- `lang` is set on `<html>`, and also on any passage in another language (for example, post titles from another language in lists).
- After client-side navigation, focus moves to `<main>` and the route announcer reads the new title.
- No information depends on colour, shape, position or sound alone.

## Rich media alternatives (three layers)

Every non-text item must still make sense when it is missing, fails to load, is blocked, or cannot be read by assistive technology. Each item has:

1. **A short alternative** (`alt` or accessible name): what it is and its main point, in one or two sentences.
2. **A visible caption or label**: title and context for everyone, plus the source, date and units when relevant.
3. **A long description or equivalent data**, whenever the item carries more than the short alternative can hold (infographics, charts, diagrams, maps, complex images). This must be real HTML in the page, not only an attribute.

Decorative images use `alt=""` and must be explicitly marked `kind="decorative"`.

How each component enforces this (`assertAccessible` stops the build when a layer is missing):

| Item | Component | Layer 1 | Layer 2 | Layer 3 |
|---|---|---|---|---|
| Image or infographic | `::image-figure` | `alt` | `caption`, `credit` | `#description` (required for infographic, diagram or complex) |
| Chart | `::chart` | title + `summary` | `figcaption` with source | data table + CSV, present without JavaScript |
| Diagram | `::diagram` + ```` ```mermaid ```` | `alt` | `caption` | `#description` (text or list) |
| Table | `::data-table` | caption | caption | the table itself |
| Embed (video, map…) | `::external-embed` | `title` | figcaption + direct link | summary or transcript (required) |
| Plain markdown image | `![alt](src)` | alt (required) | — | use `::image-figure` instead when one is needed |
| Audio or video (future) | — | title | caption | captions **and** a transcript, with no autoplay |

The review and design agents reject any media that fails this test: hide the image, block scripts and read the page with a screen reader. Is the information still all there?

## Reader settings we must respect

The site does not override any of these. It supports them and tests them:
- Browser zoom up to 400%, and reflow at 320 px wide with no horizontal scrolling (1.4.10).
- The browser's default text size. Text uses `rem`, never fixed pixel sizes.
- Text spacing overrides (1.4.12).
- `prefers-color-scheme` (light and dark), `forced-colors` (Windows high contrast) and `prefers-reduced-motion`.
- Reader Mode, translation tools, copy and paste, and printing.
- Keyboard only, switch access and voice control: visible labels match accessible names (2.5.3).

## Most common errors to avoid

The [WebAIM Million](https://webaim.org/projects/million/) report lists the errors found most often on home pages. Check each one:
- Low-contrast text.
- Missing alt text.
- Empty links.
- Missing form labels.
- Empty buttons.
- A missing `lang` on the document.

## Testing

Automated (in `pnpm check` and in CI):
- axe-core with the WCAG 2.0, 2.1 and 2.2 A/AA rules, on every page, in light mode, dark mode and forced colours.
- Reflow at 320 px, and the text-spacing override.
- Media alternatives with images and scripts blocked.
- Skip link and keyboard focus.
- HTML validity.

Manual, before every release that changes templates or components:
- Try the site with a screen reader: NVDA or Orca, plus VoiceOver.
- Use the keyboard only.
- Use 200% and 400% zoom.
- Check the [Site Seeing](https://lab.ishadeed.com/tools/site-seeing/) conditions (colour blindness, blur, low vision, zoom, narrow screens).

Automated tools find only part of the problems, so the manual pass is required.
