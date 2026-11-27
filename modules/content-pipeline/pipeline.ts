// Turns a .md + .yml pair into what Nuxt Content parses. The files on disk stay free of front matter:
// the validated metadata is injected in memory, right before Nuxt Content reads the markdown.
import { readFileSync } from 'node:fs'
import { parse, stringify } from 'yaml'
import { pageMetaSchema, postMetaSchema, SLUG_PATTERN } from '../../shared/content-schema'
import { formatHowToCite, renderCitations, type CslItem } from './citations'

type NavLink = { label: string, path: string }
export type SiteConfig = {
  site: { url: string, name: string, defaultLocale: string, postsPerPage: number }
  locales: { code: string, name: string }[]
  navigation: Record<string, { main: NavLink[], footer: NavLink[] }>
  pageDefaults: Record<string, unknown>
  postDefaults: Record<string, unknown>
}

function contentError(relPath: string, reason: string): never {
  throw new Error(`[content] ${relPath}: ${reason}`)
}

export function readSiteConfig(file: string): SiteConfig {
  return parse(readFileSync(file, 'utf8')) as SiteConfig
}

/**
 * Derives locale and URL from a path relative to content/.
 * `pt-BR/blog/andei-20-km/andei-20-km.md` → `/blog/andei-20-km`; `en/index.md` → `/en`.
 */
export function routeFromFile(relPath: string, config: SiteConfig) {
  const folders = relPath.split('/')
  const name = folders.pop()!.replace(/\.md$/, '')
  const locale = folders.shift()!
  const fail = (reason: string) => contentError(relPath, reason)

  if (!config.locales.some(l => l.code === locale)) fail(`"${locale}" is not a locale listed in content/config.yml.`)
  if (folders.length === 0 && name !== 'index') fail('only index.md may sit at the root of a locale folder.')
  if (folders.length > 0 && name !== folders.at(-1)) fail(`the file must be named after its folder ("${folders.at(-1)}.md").`)
  for (const slug of folders) {
    if (!SLUG_PATTERN.test(slug)) fail(`"${slug}" is not a friendly slug (lowercase letters, digits and hyphens, no accents).`)
  }

  const prefix = locale === config.site.defaultLocale ? '' : `/${locale}`
  const path = `${prefix}${folders.map(f => `/${f}`).join('')}` || '/'
  return { locale, path, isPost: folders[0] === 'blog' && folders.length === 2 }
}

/** Validates the metadata, renders citations and returns the markdown with its front matter injected. */
export function prepareMarkdown({ relPath, markdown, yml, config }: { relPath: string, markdown: string, yml: string, config: SiteConfig }) {
  const { locale, path, isPost } = routeFromFile(relPath, config)
  const fail = (reason: string) => contentError(relPath, reason)

  if (markdown.trimStart().startsWith('---')) fail('remove the front matter; metadata belongs in the .yml file.')
  if (/^# /m.test(markdown.replace(/```[\s\S]*?```/g, ''))) fail('do not use a level-1 heading (#); the .yml title is the page heading, so start sections at ##.')

  const defaults = isPost ? { ...config.pageDefaults, ...config.postDefaults } : config.pageDefaults
  const input = { ...defaults, ...(parse(yml) ?? {}) }
  const invalid = (error: { issues: { path: PropertyKey[], message: string }[] }) =>
    fail(`invalid .yml\n${error.issues.map(i => `  - ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')}`)
  const withFrontMatter = (data: object, body: string) => `---\n${stringify({ ...data, locale, path })}---\n\n${body}`

  if (!isPost) {
    const page = pageMetaSchema.safeParse(input)
    return page.success ? withFrontMatter(page.data, markdown) : invalid(page.error)
  }

  const post = postMetaSchema.safeParse(input)
  if (!post.success) return invalid(post.error)
  const meta = post.data
  const { markdown: body, bibliography } = renderCitations(markdown, meta.references as CslItem[], meta.citationStyle, locale)
  return withFrontMatter({
    ...meta,
    bibliography,
    howToCite: formatHowToCite({ ...meta, url: `${config.site.url}${path}/`, siteName: config.site.name }, meta.citationStyle, locale),
    readingMinutes: Math.max(1, Math.round(markdown.split(/\s+/).length / 200)),
  }, body)
}

type MinimarkBody = { value?: unknown[], toc?: { links: { id: string }[] } }

/**
 * GFM footnotes arrive with English labels ("Footnotes", "Back to reference 1"). This swaps in the
 * page's own language (strings from i18n/locales) and keeps the hidden footnotes heading out of the TOC.
 */
export function localizeFootnotes(body: MinimarkBody | undefined, labels: { footnotes: string, footnoteBack: string }) {
  const visit = (node: unknown): void => {
    if (!Array.isArray(node)) return
    const props = node[1] as Record<string, unknown> | undefined
    if (props?.id === 'footnote-label') node.splice(2, node.length - 2, labels.footnotes)
    if (props && 'dataFootnoteBackref' in props) props.ariaLabel = labels.footnoteBack
    node.slice(2).forEach(visit)
  }
  body?.value?.forEach(visit)
  if (body?.toc) body.toc.links = body.toc.links.filter(link => link.id !== 'footnote-label')
}
