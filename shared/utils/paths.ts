// URL helpers shared by the app and the server (auto-imported in both).
// Nuxt Content stores paths without a trailing slash; published URLs always end with one,
// because GitHub Pages serves every page as <path>/index.html.

/** `/en/about` → `/en/about/` */
export function toUrlPath(contentPath: string) {
  return contentPath.endsWith('/') ? contentPath : `${contentPath}/`
}

/** `/en/about/` → `/en/about` (and `/` stays `/`) */
export function toContentPath(urlPath: string) {
  return urlPath.replace(/\/+$/, '') || '/'
}

/** `Avaliação educacional` → `avaliacao-educacional` (used for tag URLs). */
export function slugify(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
