<script setup lang="ts">
defineProps<{ alternates: Alternate[] }>()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const site = useSiteConfig()
const links = computed(() => useAppConfig().navigation[locale.value]?.main ?? [])
</script>

<template>
  <header class="site-header">
    <div>
      <p>
        <NuxtLink
          :to="localePath('/')"
          class="site-name"
        >
          {{ site.name }}
        </NuxtLink>
      </p>
      <nav :aria-label="t('a11y.mainMenu')">
        <ul class="link-list">
          <li
            v-for="link in links"
            :key="link.path"
          >
            <NuxtLink :to="link.path">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <LanguageSwitcher :alternates="alternates" />
    </div>
  </header>
</template>
