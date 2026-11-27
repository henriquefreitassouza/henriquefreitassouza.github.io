<script setup lang="ts">
const page = await useContentPage('pages')
const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: latest } = await useAsyncData(`latest:${locale.value}`, () =>
  queryPosts(locale.value).limit(5).select('path', 'title', 'description', 'datePublished', 'locale', 'draft').all())
</script>

<template>
  <div>
    <h1>{{ page.title }}</h1>
    <ContentRenderer :value="page" />
    <section aria-labelledby="latest-heading">
      <h2 id="latest-heading">
        {{ t('blog.latest') }}
      </h2>
      <PostList
        :posts="latest ?? []"
        :heading-level="3"
      />
      <p>
        <NuxtLink :to="localePath('/blog')">
          {{ t('blog.allPosts') }}
        </NuxtLink>
      </p>
    </section>
  </div>
</template>
