<script setup lang="ts">
const { t, locale } = useI18n()
const site = useSiteConfig()
const alternates = await useAlternates()

useHead({
  htmlAttrs: { lang: locale },
  link: [{ rel: 'alternate', type: 'application/rss+xml', title: `${site.name} (RSS)`, href: `/feed/${locale.value}.xml` }],
})

// After client-side navigation, move focus to the new page so keyboard and screen reader users
// start reading from the top instead of from the link they clicked.
useNuxtApp().hook('page:finish', () => {
  if (history.state?.back) document.getElementById('main')?.focus({ preventScroll: true })
})
</script>

<template>
  <a
    class="skip-link"
    href="#main"
  >{{ t('a11y.skipToContent') }}</a>
  <NuxtRouteAnnouncer />
  <SiteHeader :alternates="alternates" />
  <main
    id="main"
    tabindex="-1"
  >
    <NuxtPage />
  </main>
  <SiteFooter />
</template>
