// How pages get their data and <head>. Every query runs inside useAsyncData, so prerendering stores
// the result in the page payload and the browser never needs a database.

export type Alternate = { locale: string, path: string }

/** Title, description, robots and Open Graph tags for any page. */
type PageHeadMeta = { title: string, description?: string, noindex?: boolean, image?: { src: string, alt: string, width: number, height: number } }
export function usePageHead({ title, description, noindex, image }: PageHeadMeta) {
  const site = useSiteConfig()
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    // Image tags only when the page has an image: empty og:image tags are invalid.
    ...(image && { ogImage: { url: `${site.url}${image.src}`, alt: image.alt, width: image.width, height: image.height } }),
    robots: noindex ? 'noindex, follow' : undefined,
  })
}

/**
 * The current page in every language it exists in (linked by `translationKey`), plus hreflang tags.
 * Called once in app.vue, so the header's language switcher has the data before it renders.
 */
export async function useAlternates() {
  const route = useRoute()
  const site = useSiteConfig()
  const { includeDrafts } = useRuntimeConfig().public

  // Not awaited yet: useHead below must be registered before any await (it needs the app context).
  const request = useAsyncData(() => `alternates:${toContentPath(route.path)}`, async () => {
    const path = toContentPath(route.path)
    const [page, post] = await Promise.all([
      queryCollection('pages').path(path).select('path', 'locale', 'translationKey').first(),
      queryCollection('posts').path(path).select('path', 'locale', 'translationKey').first(),
    ])
    const entry = page ?? post
    if (!entry?.translationKey) return entry ? [{ locale: entry.locale, path: entry.path }] : []
    const versions = await queryCollection(page ? 'pages' : 'posts').where('translationKey', '=', entry.translationKey)
      .select('path', 'locale', 'draft').all()
    return versions.filter(v => includeDrafts || !v.draft).map(v => ({ locale: v.locale, path: v.path }))
  })

  useHead(() => {
    const alternates = request.data.value ?? []
    const fallback = alternates.find(a => a.locale === site.defaultLocale)
    const link = (hreflang: string, path: string) => ({ rel: 'alternate' as const, hreflang, href: `${site.url}${toUrlPath(path)}` })
    return {
      link: alternates.length > 1
        ? [...alternates.map(a => link(a.locale, a.path)), ...(fallback ? [link('x-default', fallback.path)] : [])]
        : [],
    }
  })
  await request
  return computed<Alternate[]>(() => request.data.value ?? [])
}

/** Loads the content entry for the current route (404 if missing or an unpublished draft) and sets its head. */
export async function useContentPage<C extends 'pages' | 'posts'>(collection: C) {
  const path = toContentPath(useRoute().path)
  const { includeDrafts } = useRuntimeConfig().public
  const nuxtApp = useNuxtApp()

  const { data: page } = await useAsyncData(`${collection}:${path}`, () => queryCollection(collection).path(path).first())
  if (!page.value || (page.value.draft && !includeDrafts)) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
  }
  // Composables after an await need the app context restored; script setup does this, plain functions don't.
  nuxtApp.runWithContext(() => usePageHead(page.value!))
  return page.value
}

/** Published posts in one locale (or in every other locale), newest first. */
export function queryPosts(locale: string, operator: '=' | '<>' = '=') {
  const query = queryCollection('posts').where('locale', operator, locale).order('datePublished', 'DESC')
  return useRuntimeConfig().public.includeDrafts ? query : query.where('draft', '=', false)
}
