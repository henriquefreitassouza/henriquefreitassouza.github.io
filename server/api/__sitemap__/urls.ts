// Sitemap entries with hreflang alternates. Translations have different slugs
// (/blog/andei-20-km ↔ /en/blog/i-walked-20-km), so they are linked by translationKey, not by path.
import { queryCollection } from '@nuxt/content/server'

export default defineSitemapEventHandler(async (event) => {
  const { defaultLocale } = getSiteConfig(event)
  const pages = await queryCollection(event, 'pages').select('path', 'locale', 'translationKey', 'draft', 'noindex').all()
  const posts = await queryCollection(event, 'posts').select('path', 'locale', 'translationKey', 'draft', 'noindex', 'datePublished', 'dateModified').all()
  const entries = [
    ...pages.map(page => ({ ...page, lastmod: undefined })),
    ...posts.map(post => ({ ...post, lastmod: post.dateModified ?? post.datePublished })),
  ].filter(entry => !entry.draft && !entry.noindex)

  return entries.map((entry) => {
    const versions = entry.translationKey ? entries.filter(other => other.translationKey === entry.translationKey) : []
    const fallback = versions.find(v => v.locale === defaultLocale)
    return {
      loc: toUrlPath(entry.path),
      lastmod: entry.lastmod,
      alternatives: versions.length > 1
        ? [
            ...versions.map(v => ({ hreflang: v.locale, href: toUrlPath(v.path) })),
            ...(fallback ? [{ hreflang: 'x-default', href: toUrlPath(fallback.path) }] : []),
          ]
        : undefined,
    }
  })
})
