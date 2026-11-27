# Content principles (editorial rules)

This is an academic blog, so accuracy comes before speed, style or reach. The [content agent](../../.claude/agents/content.md) owns this document.

## 1. Every borrowed claim has a source

- Any claim that does not come from the author's own reasoning or data needs **at least one reference**. This covers facts, numbers, quotes, findings and paraphrases.
- Cite where the claim appears, with `[@id]`, and add a page or section for quotes: `[@id, p. 25]`. The build fails on a citation with no matching reference. It warns about references that are never cited, because the reference list holds only cited works.
- Use the most direct source. Cite the study, not the news article about it, unless the article is the point.
- Never cite a source you have not read. Never cite an AI tool as the source of a factual claim.

## 2. Source quality

In order of preference:
1. **Peer-reviewed articles and scholarly books.** Prefer ones with a DOI, and look for retractions.
2. **Official statistics and reports:** Inep, IBGE, MEC, CNE, OECD, UNESCO, World Bank, and state education departments.
3. **Theses and dissertations** from recognised programmes (for example, the CAPES catalogue).
4. **Reputable newspapers and magazines** (Folha de S.Paulo, O Estado de S. Paulo, O Globo, Valor, Nexo, El País…) for events and context.
5. **Institutional websites and reports** from think tanks or NGOs (Todos Pela Educação, Fundação Lemann…), with their perspective stated.

Avoid anonymous pages, content farms, unsourced social media posts and predatory journals. Record the access date for web pages (`accessed` in CSL).

## 3. Citation standards

- **The default is ABNT:** NBR 10520 for in-text citations and NBR 6023 for references. `citationStyle: abnt` is set in `content/config.yml`.
- **APA 7** is allowed per post with `citationStyle: apa`, for example for English posts aimed at international readers.
- References are written as **CSL-YAML** in the post's `.yml` (see the [writing guide](../writing-guide.md)). The build formats them, so never format references by hand.
- Each post shows "How to cite this article" automatically.

## 4. Structure of a post

Required metadata:
- `title`, `description`, `datePublished`, `abstract` and `plainLanguageSummary`.
- `tags` (recommended).
- `references` whenever anything is cited.

Recommended body (adapt it to the genre):
1. Introduction: the problem and why it matters.
2. Context or literature.
3. Method, for research posts.
4. Findings or argument.
5. Discussion and limitations.
6. Conclusion.

Separate findings from opinion explicitly ("In my view…", "The data show…").

## 5. Language

- **pt-BR by default.** English and Spanish when the post is aimed at international readers. Each language version is a full text, not a machine translation published unchecked. Any translation must be reviewed by a fluent person.
- Follow the current norms of each language (for Portuguese, the Acordo Ortográfico de 1990).
- Use plain language:
  - short sentences;
  - active voice;
  - terms defined on first use;
  - acronyms spelled out on first use, for example "Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (Inep)".
- The `plainLanguageSummary` is written for a non-specialist (about the level of a secondary-school graduate), in 2–4 sentences.
- Use inclusive and respectful language. Name groups the way they name themselves. Use person-first or identity-first language as the community prefers, and avoid ableist metaphors.
- Mark any passage in another language: wrap it in a `lang` span, `[text]{lang="en"}`.

## 6. Data and media

- Data in charts and tables comes with its source and date. Fictional or illustrative data says so in its title.
- Use images only with the right to use them, and name the credit and licence in `credit`.
- Every media item follows the [three-layer accessibility rule](accessibility.md#rich-media-alternatives-three-layers).

## 7. Corrections and updates

- **Correct errors openly.** Fix the text, set `dateModified`, and add a dated correction note at the end ("Correção em 2027-03-02: …") saying what changed.
- **Never silently change a claim** that others may already have cited.
- **Unpublish only in exceptional cases.** Prefer a correction note.

## 8. Ethics

- Research with people follows research ethics: consent, anonymity and approval by an ethics committee (CEP/CONEP) where needed. Never publish data that identifies minors or students.
- Declare conflicts of interest and funding at the end of the post.
- AI tools may help with drafting, translation or review. The author remains responsible for every claim and every reference, and must check each one against the original source.
