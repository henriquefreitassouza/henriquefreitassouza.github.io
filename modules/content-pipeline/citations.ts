// Build-time citation formatting with citation-js (CSL). Nothing here ships to the browser.
// In the markdown, cite like Pandoc: [@id], [@id, p. 23] or [@a; @b].
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Cite, plugins } from '@citation-js/core'
import '@citation-js/plugin-csl'

export type CitationStyle = 'abnt' | 'apa'
export type CslItem = { id: string, type: string, [key: string]: unknown }

// CSL files come from github.com/citation-style-language (styles and locales repositories).
const cslDir = fileURLToPath(new URL('./csl/', import.meta.url))
const csl = plugins.config.get('@csl')
csl.styles.add('abnt', readFileSync(`${cslDir}abnt.csl`, 'utf8'))
csl.styles.add('apa', readFileSync(`${cslDir}apa.csl`, 'utf8'))
const cslLocales: Record<string, string> = { 'pt-BR': 'pt-BR', 'en': 'en-US', 'es': 'es-ES' }
for (const lang of Object.values(cslLocales)) csl.locales.add(lang, readFileSync(`${cslDir}locales-${lang}.xml`, 'utf8'))

const CITATION = /\[(@[^\]\n]+)\]/g
const CITE_ITEM = /^@([\w:.#$%&+?<>~/-]+)(?:,\s*(.+))?$/
const CODE_FENCE = /(```[\s\S]*?```)/

/**
 * Replaces [@id] citations with formatted in-text citations that link to the reference list,
 * and returns the reference list as HTML. Throws on a citation whose id is not in `references`.
 */
export function renderCitations(markdown: string, references: CslItem[], style: CitationStyle, locale: string) {
  const cite = new Cite(references)
  const options = { template: style, lang: cslLocales[locale] ?? 'en-US' }
  const known = new Set(references.map(ref => ref.id))
  const cited = new Set<string>()

  const replaceIn = (text: string) => text.replace(CITATION, (match, group: string) => {
    const entries = group.split(';').map((part) => {
      const [, id, locator] = part.trim().match(CITE_ITEM) ?? []
      if (!id) throw new Error(`Malformed citation "${match}". Use [@id] or [@id, p. 12].`)
      if (!known.has(id)) throw new Error(`Citation "${match}" has no matching entry in references.`)
      cited.add(id)
      const page = locator?.match(/^pp?\.\s*(.+)$/)
      if (page) return { id, locator: page[1]!, label: 'page' as const }
      return locator ? { id, locator, label: 'section' as const } : { id }
    })
    return `[${cite.format('citation', { ...options, entry: entries, citationsPre: [], citationsPost: [] })}](#ref-${entries[0]!.id})`
  })
  // Leave code blocks untouched: [@...] inside code is code, not a citation.
  const body = markdown.split(CODE_FENCE).map(part => part.startsWith('```') ? part : replaceIn(part)).join('')

  const uncited = [...known].filter(id => !cited.has(id))
  if (uncited.length) console.warn(`[content] References never cited: ${uncited.join(', ')}`)

  const bibliography = references.length
    ? (cite.format('bibliography', { ...options, format: 'html' }) as string)
        .replace(/data-csl-entry-id="([^"]+)"/g, 'id="ref-$1" data-csl-entry-id="$1"')
    : ''
  return { markdown: body, bibliography }
}

/** The "how to cite this article" entry for a post, in the post's citation style. */
export function formatHowToCite(post: { title: string, authors: { name: string }[], datePublished: string, url: string, siteName: string }, style: CitationStyle, locale: string) {
  const item: CslItem = {
    'id': 'this-post',
    'type': 'post-weblog',
    'title': post.title,
    'container-title': post.siteName,
    'URL': post.url,
    'issued': { 'date-parts': [post.datePublished.split('-').map(Number)] },
    // ABNT and APA index authors by their last surname.
    'author': post.authors.map(({ name }) => {
      const parts = name.trim().split(/\s+/)
      return { family: parts.pop(), given: parts.join(' ') }
    }),
  }
  return new Cite([item]).format('bibliography', { template: style, lang: cslLocales[locale] ?? 'en-US', format: 'html' }) as string
}
