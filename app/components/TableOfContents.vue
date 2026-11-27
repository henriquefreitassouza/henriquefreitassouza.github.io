<script setup lang="ts">
import type { PostsCollectionItem } from '@nuxt/content'

defineProps<{ links: NonNullable<PostsCollectionItem['body']['toc']>['links'] }>()
const { t } = useI18n()
const id = useId()
</script>

<template>
  <nav :aria-labelledby="id">
    <h2 :id="id">
      {{ t('post.toc') }}
    </h2>
    <ol>
      <li
        v-for="link in links"
        :key="link.id"
      >
        <a :href="`#${link.id}`">{{ link.text }}</a>
        <ol v-if="link.children?.length">
          <li
            v-for="child in link.children"
            :key="child.id"
          >
            <a :href="`#${child.id}`">{{ child.text }}</a>
          </li>
        </ol>
      </li>
    </ol>
  </nav>
</template>
