<script setup lang="ts">
import type { PostsCollectionItem } from '@nuxt/content'

defineProps<{
  posts: Pick<PostsCollectionItem, 'path' | 'title' | 'description' | 'datePublished' | 'locale' | 'draft'>[]
  headingLevel: 2 | 3
}>()
const { t, locale } = useI18n()
</script>

<template>
  <ul
    v-if="posts.length"
    class="post-list"
  >
    <li
      v-for="post in posts"
      :key="post.path"
      :lang="post.locale === locale ? undefined : post.locale"
    >
      <component :is="`h${headingLevel}`">
        <NuxtLink :to="toUrlPath(post.path)">
          {{ post.title }}
        </NuxtLink>
      </component>
      <p class="meta">
        <time :datetime="post.datePublished">{{ formatDate(post.datePublished, post.locale) }}</time>
        <template v-if="post.draft">
          · <strong :lang="locale">{{ t('post.draft') }}</strong>
        </template>
      </p>
      <p>{{ post.description }}</p>
    </li>
  </ul>
  <p v-else>
    {{ t('blog.empty') }}
  </p>
</template>
