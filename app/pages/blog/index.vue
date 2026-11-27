<script setup lang="ts">
// Blog index: intro text from content/<locale>/blog/blog.md, then page 1 of the posts.
const page = await useContentPage('pages')
const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: others } = await useAsyncData(`posts:others:${locale.value}`, () =>
  queryPosts(locale.value, '<>').select('path', 'title', 'description', 'datePublished', 'locale', 'draft').all())
</script>

<template>
  <div>
    <SiteBreadcrumbs :items="[{ label: t('a11y.home'), to: localePath('/') }, { label: page.title }]" />
    <h1>{{ page.title }}</h1>
    <ContentRenderer :value="page" />
    <PostListing :page="1" />
    <section
      v-if="others?.length"
      aria-labelledby="other-languages-heading"
    >
      <h2 id="other-languages-heading">
        {{ t('blog.otherLanguages') }}
      </h2>
      <PostList
        :posts="others"
        :heading-level="3"
      />
    </section>
  </div>
</template>
