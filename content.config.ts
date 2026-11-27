import { defineCollection, defineContentConfig } from '@nuxt/content'
import { pageSchema, postSchema } from './shared/content-schema'

// Folder layout: content/<locale>/<slug>/<slug>.md (+ .yml), and content/<locale>/blog/<slug>/ for posts.
// Only .md files are collected; the content pipeline merges each sibling .yml in at build time.
export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: { include: '*/**/*.md', exclude: ['*/blog/*/**'] },
      schema: pageSchema,
    }),
    posts: defineCollection({
      type: 'page',
      source: '*/blog/*/*.md',
      schema: postSchema,
    }),
  },
})
