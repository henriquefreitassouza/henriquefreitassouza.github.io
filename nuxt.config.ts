import { readSiteConfig } from './modules/content-pipeline/pipeline'

// Site-wide settings live in content/config.yml so authors never need to touch code.
const { site, locales, navigation } = readSiteConfig('./content/config.yml')
const prefixOf = (code: string) => code === site.defaultLocale ? '' : `/${code}`

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxtjs/i18n', '@nuxt/content', '@nuxtjs/seo', '@nuxt/image'],
  devtools: { enabled: true },
  app: {
    head: {
      // TDMRep: text and data mining rights are reserved (a legal opt-out of AI training in the EU).
      meta: [{ name: 'tdm-reservation', content: '1' }],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  css: ['~/assets/css/tokens.css', '~/assets/css/main.css'],

  site: { url: site.url, name: site.name, defaultLocale: site.defaultLocale, trailingSlash: true },

  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        toc: { depth: 3 },
        remarkPlugins: { 'remark-math': {} },
        // MathML is read by screen readers and needs no extra font or stylesheet.
        rehypePlugins: { 'rehype-katex': { output: 'mathml' } },
        highlight: { theme: { default: 'github-light-high-contrast', dark: 'github-dark-high-contrast' } },
      },
    },
  },
  appConfig: { navigation },
  runtimeConfig: {
    public: { includeDrafts: process.env.INCLUDE_DRAFTS === '1', postsPerPage: site.postsPerPage },
  },

  // - Links keep the trailing slash GitHub Pages serves, and prefetch the next page only when the
  //   reader points at or focuses a link (not every link on screen), to keep requests down.
  // - The app manifest stays on (default): it tells the browser which pages are prerendered, so
  //   navigation reads their _payload.json instead of a database.
  // - 404.html: GitHub Pages serves it for any missing URL, so it is rendered as a real page
  //   (with language, title and content) instead of an empty shell that needs JavaScript.
  experimental: {
    defaults: { nuxtLink: { trailingSlash: 'append', prefetchOn: { visibility: false, interaction: true } } },
    prerenderErrorPages: true,
  },
  compatibilityDate: '2026-11-01',

  nitro: {
    preset: 'github_pages',
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: [...locales.map(l => `${prefixOf(l.code)}/`), ...locales.map(l => `/feed/${l.code}.xml`), '/latest-posts.json'],
    },
  },

  typescript: { strict: true },

  // No <link rel="prefetch"> hints for lazily imported code. Without this, every page with a
  // diagram hinted ~650 KiB of Mermaid chunks the reader may never need. Links already prefetch
  // the next page on hover or focus (see experimental.defaults above).
  hooks: {
    'build:manifest': (manifest) => {
      for (const chunk of Object.values(manifest)) chunk.prefetch = false
    },
  },
  aiReady: {
    contentSignal: { search: true, aiInput: true, aiTrain: false },
    // No llms-full.txt: one file with every article's full text mostly serves training scrapers.
    llmsFullTxt: false,
  },
  eslint: { config: { stylistic: true } },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: site.defaultLocale,
    locales: locales.map(l => ({ code: l.code, language: l.code, name: l.name, file: `${l.code}.yml` })),
    detectBrowserLanguage: false,
    baseUrl: site.url,
  },

  image: { format: ['avif', 'webp'] },
  linkChecker: { failOnError: true },
  // Off until the design agent defines a visual identity; pages may set `image` in their .yml.
  ogImage: { enabled: false },

  // SEO bundle (@nuxtjs/seo). Search and answer engines may read and cite; training crawlers may not.
  robots: {
    groups: [{
      userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider', 'meta-externalagent'],
      disallow: ['/'],
    }],
  },
  schemaOrg: { identity: { type: 'Person', name: site.name, url: site.url } },
  // No twitter:* tags: X reads Open Graph, and unhead flags twitter:card as deprecated.
  seo: { automaticTwitterTags: false },
  sitemap: { autoI18n: false, sources: ['/api/__sitemap__/urls'] },
  // Off for a static blog: it installs a service worker to keep old builds' assets.
  skewProtection: { enabled: false },
})
