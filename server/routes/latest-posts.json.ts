// The three newest posts in each language, for the 404 page (prerendered to /latest-posts.json).
// A static file, not a content query: the 404 page can also appear after client-side navigation,
// where a query would need the database in the browser.
import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const { includeDrafts } = useRuntimeConfig(event).public
  const query = queryCollection(event, 'posts')
    .select('path', 'title', 'description', 'datePublished', 'locale')
    .order('datePublished', 'DESC')
  const posts = await (includeDrafts ? query : query.where('draft', '=', false)).all()
  const latest: Record<string, typeof posts> = {}
  for (const post of posts) {
    latest[post.locale] ??= []
    if (latest[post.locale]!.length < 3) latest[post.locale]!.push(post)
  }
  return latest
})
