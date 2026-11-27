<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const page = Number(useRoute().params.page)
if (!Number.isInteger(page) || page < 2) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const title = t('blog.page', { page })
usePageHead({ title, description: t('blog.pageDescription', { page }) })
</script>

<template>
  <div>
    <SiteBreadcrumbs :items="[{ label: t('a11y.home'), to: localePath('/') }, { label: 'Blog', to: localePath('/blog') }, { label: title }]" />
    <h1>{{ title }}</h1>
    <PostListing :page="page" />
  </div>
</template>
