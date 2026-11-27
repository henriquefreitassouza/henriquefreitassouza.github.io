<script setup lang="ts">
import type { NuxtError } from '#app'

// GitHub Pages answers every missing address, in any language, with the same prerendered
// 404.html. So the "not found" page offers help in all three languages at once, each section
// marked with its own `lang`, and the header and footer stay in the default language: that way
// the HTML is identical with or without JavaScript, whatever the address was.
const props = defineProps<{ error: NuxtError }>()
const notFound = props.error.statusCode === 404
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const site = useSiteConfig()
const nuxtApp = useNuxtApp()
type LatestPost = { path: string, title: string, description: string, datePublished: string, locale: string }

const { data: latest } = await useFetch<Record<string, LatestPost[]>>('/latest-posts.json', {
  key: 'latest-posts',
  immediate: notFound,
  default: () => ({}),
})
if (notFound) {
  await Promise.all(locales.value.map(l => nuxtApp.$i18n.loadLocaleMessages(l.code)))
  locale.value = site.defaultLocale ?? locale.value
}

// Interface text in one language, whatever the current locale is.
const tIn = (code: typeof locale.value, key: string) => t(key, {}, { locale: code })
const title = notFound ? locales.value.map(l => tIn(l.code, 'error.notFound')).join(' · ') : t('error.generic')
// The locale is already the default one here (set above), so plain t() gives the default language.
const description = notFound ? t('error.notFoundHelp') : t('error.generic')
usePageHead({ title, description, noindex: true })
// @nuxtjs/seo leaves og:url as `false` on error pages, which unhead reports; give it the requested address.
useSeoMeta({ ogUrl: `${site.url}${useRoute().path}` })
useHead({ htmlAttrs: { lang: locale } })
</script>

<template>
  <a
    class="skip-link"
    href="#main"
  >{{ t('a11y.skipToContent') }}</a>
  <SiteHeader :alternates="[]" />
  <main
    id="main"
    tabindex="-1"
  >
    <div v-if="notFound">
      <h1>
        <template
          v-for="(l, index) in locales"
          :key="l.code"
        >
          <template v-if="index">
            ·
          </template>
          <span :lang="l.code">{{ tIn(l.code, 'error.notFound') }}</span>
        </template>
      </h1>
      <ul class="link-list">
        <li
          v-for="l in locales"
          :key="l.code"
        >
          <a
            :href="`#not-found-${l.code}`"
            :lang="l.code"
          >{{ l.name }}</a>
        </li>
      </ul>
      <section
        v-for="l in locales"
        :id="`not-found-${l.code}`"
        :key="l.code"
        :lang="l.code"
        :aria-labelledby="`not-found-${l.code}-heading`"
      >
        <h2 :id="`not-found-${l.code}-heading`">
          {{ l.name }}
        </h2>
        <p>{{ tIn(l.code, 'error.notFoundHelp') }}</p>
        <template v-if="latest[l.code]?.length">
          <h3>{{ tIn(l.code, 'error.latest') }}</h3>
          <ul>
            <li
              v-for="post in latest[l.code]"
              :key="post.path"
            >
              <NuxtLink :to="toUrlPath(post.path)">
                {{ post.title }}
              </NuxtLink>
              (<time :datetime="post.datePublished">{{ formatDate(post.datePublished, l.code) }}</time>)
            </li>
          </ul>
        </template>
        <ul class="link-list">
          <li>
            <NuxtLink :to="localePath('/blog/', l.code)">
              {{ tIn(l.code, 'error.allPosts') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/', l.code)">
              {{ tIn(l.code, 'error.home') }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>
    <div v-else>
      <h1>{{ t('error.generic') }}</h1>
      <p v-if="error.statusMessage">
        {{ error.statusMessage }}
      </p>
      <p>
        <NuxtLink :to="localePath('/')">
          {{ t('error.home') }}
        </NuxtLink>
      </p>
    </div>
  </main>
  <SiteFooter />
</template>
