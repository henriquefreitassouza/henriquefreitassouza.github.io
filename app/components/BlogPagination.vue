<script setup lang="ts">
// Numbered pages instead of infinite scroll: readers always know where they are and where the list ends.
const props = defineProps<{ page: number, totalPages: number }>()
const { t } = useI18n()
const localePath = useLocalePath()
const pathOf = (n: number) => n === 1 ? localePath('/blog') : localePath(`/blog/page/${n}`)
const pages = computed(() => Array.from({ length: props.totalPages }, (_, i) => i + 1))
</script>

<template>
  <nav
    v-if="totalPages > 1"
    :aria-label="t('pagination.label')"
  >
    <ul class="link-list">
      <li v-if="page > 1">
        <NuxtLink
          :to="pathOf(page - 1)"
          rel="prev"
        >
          {{ t('pagination.previous') }}
        </NuxtLink>
      </li>
      <li
        v-for="n in pages"
        :key="n"
      >
        <NuxtLink
          :to="pathOf(n)"
          :aria-current="n === page ? 'page' : undefined"
          :aria-label="t('pagination.page', { page: n })"
        >
          {{ n }}
        </NuxtLink>
      </li>
      <li v-if="page < totalPages">
        <NuxtLink
          :to="pathOf(page + 1)"
          rel="next"
        >
          {{ t('pagination.next') }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
