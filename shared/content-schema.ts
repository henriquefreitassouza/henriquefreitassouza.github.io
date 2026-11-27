// Schemas for the metadata in each page's .yml file.
// Used twice: by content.config.ts (Nuxt Content collections) and by the content pipeline,
// which validates every .yml at build time so a typo fails the build instead of shipping.
import { z } from '@nuxt/content'

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const author = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
  orcid: z.string().optional(),
}).strict()

/** What an author writes in a page's .yml (institutional pages, home, blog index). */
export const pageMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(50).max(160),
  translationKey: z.string().regex(SLUG_PATTERN).optional(),
  noindex: z.boolean().default(false),
  draft: z.boolean().default(false),
  // Social sharing image. Width and height are required: platforms skip images without them.
  image: z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }).strict().optional(),
}).strict()

/** What an author writes in a blog post's .yml. */
export const postMetaSchema = pageMetaSchema.extend({
  datePublished: z.string().date(),
  dateModified: z.string().date().optional(),
  authors: z.array(author).min(1),
  tags: z.array(z.string().min(1)).default([]),
  abstract: z.string().min(1),
  plainLanguageSummary: z.string().min(1),
  citationStyle: z.enum(['abnt', 'apa']),
  // CSL-JSON entries, written as YAML. Cited in the markdown as [@id].
  references: z.array(z.object({ id: z.string().min(1), type: z.string().min(1) }).passthrough()).default([]),
}).strict()

// Fields the pipeline adds; Nuxt Content stores them with the rest.
const computed = { locale: z.string() }

export const pageSchema = pageMetaSchema.extend(computed)
export const postSchema = postMetaSchema.extend({
  ...computed,
  bibliography: z.string(),
  howToCite: z.string(),
  readingMinutes: z.number(),
})
