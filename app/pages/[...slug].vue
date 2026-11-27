<script setup lang="ts">
// Institutional pages: content/<locale>/<slug>/<slug>.md
const page = await useContentPage('pages')
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div>
    <SiteBreadcrumbs :items="[{ label: t('a11y.home'), to: localePath('/') }, { label: page.title }]" />
    <h1>{{ page.title }}</h1>
    <ContentRenderer :value="page" />
  </div>
</template>
