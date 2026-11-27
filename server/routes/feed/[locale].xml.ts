// RSS 2.0 feed per language: /feed/pt-BR.xml, /feed/en.xml, /feed/es.xml (prerendered).
import { queryCollection } from '@nuxt/content/server'

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export default defineEventHandler(async (event) => {
  const locale = getRouterParam(event, 'locale') ?? ''
  const site = getSiteConfig(event)
  const homePath = locale === site.defaultLocale ? '/' : `/${locale}`
  const home = await queryCollection(event, 'pages').path(homePath).first()
  if (!home) throw createError({ statusCode: 404, statusMessage: `No locale "${locale}"` })

  const posts = await queryCollection(event, 'posts').where('locale', '=', locale).where('draft', '=', false)
    .order('datePublished', 'DESC').limit(20).all()
  const absolute = (path: string) => `${site.url}${toUrlPath(path)}`
  const items = posts.map(post => `
    <item>
      <title>${escape(post.title)}</title>
      <link>${absolute(post.path)}</link>
      <guid>${absolute(post.path)}</guid>
      <description>${escape(post.description ?? '')}</description>
      <pubDate>${new Date(post.datePublished).toUTCString()}</pubDate>
    </item>`).join('')

  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name ?? '')}</title>
    <link>${absolute(homePath)}</link>
    <description>${escape(home.description ?? '')}</description>
    <language>${locale}</language>
    <atom:link href="${site.url}/feed/${locale}.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>
`
})
