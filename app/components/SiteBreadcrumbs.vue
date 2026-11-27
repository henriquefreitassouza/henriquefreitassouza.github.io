<script setup lang="ts">
// The last item is the current page and has no link.
const props = defineProps<{ items: { label: string, to?: string }[] }>()
const { t } = useI18n()

useSchemaOrg([defineBreadcrumb({ itemListElement: props.items.map(item => ({ name: item.label, item: item.to })) })])
</script>

<template>
  <nav :aria-label="t('a11y.breadcrumb')">
    <ol class="link-list">
      <li
        v-for="item in items"
        :key="item.label"
      >
        <NuxtLink
          v-if="item.to"
          :to="item.to"
        >
          {{ item.label }}
        </NuxtLink>
        <span
          v-else
          aria-current="page"
        >{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
