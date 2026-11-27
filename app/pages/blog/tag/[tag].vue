<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const slug = String(useRoute().params.tag)

const { data: posts } = await useAsyncData(`tag:${locale.value}:${slug}`, async () => {
  const all = await queryPosts(locale.value).select('path', 'title', 'description', 'datePublished', 'locale', 'draft', 'tags').all()
  return all.filter(post => post.tags?.some(tag => slugify(tag) === slug))
})
const label = posts.value?.[0]?.tags?.find(tag => slugify(tag) === slug)
if (!label) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const title = t('blog.tag', { tag: label })
usePageHead({ title, description: t('blog.tagDescription', { tag: label }) })
</script>

<template>
  <div>
    <SiteBreadcrumbs :items="[{ label: t('a11y.home'), to: localePath('/') }, { label: 'Blog', to: localePath('/blog') }, { label: title }]" />
    <h1>{{ title }}</h1>
    <PostList
      :posts="posts ?? []"
      :heading-level="2"
    />
  </div>
</template>
