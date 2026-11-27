# Information design principles (UX, UI and graphic design)

This document builds on the [accessibility principles](accessibility.md). Every rule here must pass those first.

## Current baseline (v1): text first

v1 has no visual identity yet: no brand colours, no theme, no web fonts and no decorative images. It uses:
- **The system font stack**, so the reader's own fonts and settings apply.
- **CSS system colours** (`Canvas`, `CanvasText`, `LinkText`…), which follow light, dark and high-contrast modes automatically.
- **One readable column** (about 70 characters), left-aligned text, a line height of 1.6, and underlined links.

A future visual identity changes only `app/assets/css/tokens.css`, and must meet every rule below.

## Rules for any future theme, font or colour

- **Body text contrast of at least 7:1** in light and dark modes. Large text, icons and component boundaries: at least 3:1.
- **Follow `prefers-color-scheme`** and keep working under `forced-colors`.
- **A web font must earn its request:** at most one family and two files (regular and italic, or one variable file). It needs Latin Extended coverage (pt, es), `font-display: swap`, and an x-height and letterforms that stay readable. Hyperlegible typefaces are preferred.
- **Never use colour alone** to carry meaning: also use text, patterns, line styles or position.
- **Motion** only where `prefers-reduced-motion: no-preference` applies. Anything that moves for more than 5 seconds has a pause control (WCAG 2.2.2).
- **No text inside images**, except in charts and diagrams that have their text alternatives.

## Layout and reading

- Content comes first. Navigation stays short (a few links in the header, institutional links in the footer).
- Headings describe their sections. Put the main point first in each paragraph.
- Use lists for sequences, and tables for data with two dimensions.
- Long posts (three or more sections) get a table of contents.
- Every post shows, before the body: the authors, dates, reading time, tags, abstract and plain-language summary.

## Data visualisation

These rules follow Tamara Munzner's framework for visualisation design (MUNZNER, 2014, ch. 5 "Marks and channels" and ch. 6 "Rules of thumb"), adapted to this site's accessibility rules.

### Marks and channels

- A **mark** is the basic shape that stands for an item or a link: a point, a line or an area.
- A **channel** is a visual property that changes a mark's appearance: its position, length, angle, colour, shape and so on.
- Two principles decide which channel encodes which data:
  - **Expressiveness:** the channel must match the type of data.
    - *Ordered* data (quantities, ranks, years) needs a **magnitude channel**, which reads as "how much".
    - *Categorical* data (school network, region, country) needs an **identity channel**, which reads as "what or where".
    - Never imply an order that the data doesn't have, or hide one that it does. Example: don't use five hues for five income bands.
  - **Effectiveness:** the most important attribute gets the most effective channel. The ranks below say which one that is.

The ranking below reproduces the [figure for chapter 5 of the book](https://www.cs.ubc.ca/~tmm/vadbook/eamonn-figs/fig5.6.pdf) (CC BY 4.0). Channels are listed from most to least effective.

**Magnitude channels (for ordered data)**

| Rank | Channel | Use on this site |
|---|---|---|
| 1 | Position on a common scale | The default. Bars and lines on one shared axis (what `::chart` draws). |
| 2 | Position on unaligned scales | Small multiples: separate panels with identical scales, side by side. |
| 3 | Length (1D size) | Bar charts. This is why bars always start at zero: a truncated bar misreports its length. |
| 4 | Tilt or angle | Slopes in line charts. It is also why pie charts are avoided: angles are hard to compare. |
| 5 | Area (2D size) | Only for rough magnitudes, such as bubble sizes. Always label the exact values. |
| 6 | Depth (3D position) | Not used (see "no unjustified 3D"). |
| 7 (tied) | Colour luminance | Sequential scales, such as heat maps and choropleth maps. |
| 7 (tied) | Colour saturation | Same, in combination with luminance. Never on its own. |
| 9 (tied) | Curvature | Not used. |
| 9 (tied) | Volume (3D size) | Not used. |

**Identity channels (for categorical data)**

| Rank | Channel | Use on this site |
|---|---|---|
| 1 | Spatial region | Separate panels, groups or table sections for each category. |
| 2 | Colour hue | Telling series apart, but **never alone** (see below). Few categories only: just a handful of hues can be told apart. |
| 3 | Motion | Not used: it distracts, and it conflicts with `prefers-reduced-motion`. |
| 4 | Shape | Point markers, fill patterns and line dash styles: what `::chart` already uses. |

**Accessibility adjustments to the ranking**

- Hue ranks second among identity channels, but WCAG 1.4.1 forbids using colour as the only way to convey information. Colour blindness, monochrome printing and forced-colours mode all remove or change hue. So hue is always paired with shape (patterns, dashes, markers) and with direct labels.
- Luminance and saturation encode magnitude only together with printed values or a data table.
- Every chart must still be readable in black and white (see the rules of thumb below).

**Other criteria from the same chapter**

- **Accuracy:** how exactly a reader can estimate a value. Position and length beat area and colour.
- **Discriminability:** how many distinct values a channel can show. If the data has more categories than the channel can separate, regroup the data or use spatial regions (panels).
- **Separability:** some channel pairs interfere, such as width and height (both read as area). Combine channels that stay separable, like position and shape.
- **Popout:** a single mark that differs in one channel (for example, one highlighted bar) is found at a glance. Use popout for the takeaway, not for decoration.
- **Grouping:** proximity, containment (boxes) and similarity (shared shape or hue) make marks read as a group. Use these on purpose, never by accident.

### Rules of thumb

Adapted from chapter 6 of the same book.

- **No unjustified 3D, and no 3D effects:** depth hides marks and distorts length and angle.
- **Eyes beat memory:** show what must be compared side by side, in one view. Don't make readers memorise one state to compare it with another (no toggles or animations that replace a view).
- **Get it right in black and white:** the chart must work with luminance alone before any hue is added. This also covers forced-colours mode and printing.
- **Function first, form next:** choose the encoding that answers the question, then refine how it looks.
- **Overview first, details on demand:** the summary sentence and the chart give the overview; the data table (inside `<details>`) gives the details.

### Site rules

- **Choose the chart by the question:**
  - Bars compare categories.
  - Lines show change over time.
  - Small multiples compare many series.
  - Avoid pie charts, 3D charts and double axes.
- **Bars start at zero.** Never truncate the axis to exaggerate a difference.
- **Write the takeaway as the summary:** one sentence that says what the reader should notice.
- **Label lines directly** at their ends. Show the units, the source and the date.
- **Mark fictional or illustrative data** as such in the title.
- **Share the data:** every chart has its table and a CSV download.

**Reference:** MUNZNER, Tamara. **Visualization analysis and design**. Boca Raton: CRC Press, 2014. (A K Peters Visualization Series). Book website: https://www.cs.ubc.ca/~tmm/vadbook/.

## Error pages

Errors are dead ends, and a dead end is a usability failure. The 404 page (`app/error.vue`) must get readers moving again, in the spirit of [Help Scout's 404 page](https://www.helpscout.com/404/): a short, plain message, then a few useful ways forward.

- **Say what happened** plainly: the page isn't available here. Don't blame the reader, and don't use jokes that hide the message.
- **Offer ways forward:**
  - the latest posts;
  - the full list of posts;
  - the home page;
  - the normal header and footer navigation.

  If a site search is ever added, it goes on this page too.
- **All three languages at once.** GitHub Pages serves one `404.html` for every missing address, so the page can't know the reader's language before JavaScript runs. Each language gets its own section, marked with `lang`, with links to jump between them. The header and footer stay in the default language, so the page is identical with and without JavaScript.
- **Never redirect automatically** to the home page. It disorients readers (the address changes with no explanation), and search engines treat it as a "soft 404".
- **The status stays 404,** and the page is `noindex`.

## Interaction patterns

- Use native elements: `<a>` to go somewhere, `<button>` to do something, `<details>` to disclose.
- Controls are at least 44 × 44 px and always have a visible focus indicator.
- Nothing loads from third parties until the reader asks (click-to-load embeds).
- Links open in the same tab. Never force `target="_blank"`.

## Banned deceptive patterns

Following [deceptive.design](https://www.deceptive.design/types), this site never uses:

| Pattern | What it means here |
|---|---|
| Infinite scroll or doom-scrolling | Lists are paginated, so the reader always knows where the end is. |
| Confirmshaming | No guilt-tripping copy such as "No thanks, I don't care about education". |
| Nagging and pop-ups | No newsletter pop-ups, overlays, or interstitials. |
| Fake urgency or scarcity | No countdowns, "only today" or fake counters. |
| Hidden costs and sneaking | Nothing is added or loaded behind the reader's back. |
| Disguised ads | No sponsored content dressed as editorial. Any sponsorship must be labelled. |
| Forced action | No content is gated behind sign-up, sharing or cookies. |
| Obstruction and hard to cancel | Every setting has a visible way back (for example, "restore defaults"). |
| Preselection and trick wording | Any future choice defaults to the most private option, in plain words. |
| Visual interference | No content is hidden by banners. The most important action is never made to look less important. |
| Comparison prevention | Data is always shown with its source and can be downloaded. |

If a feature request needs any of these, it is rejected.
