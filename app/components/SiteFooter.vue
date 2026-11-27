<script setup lang="ts">
const { t, locale } = useI18n()
const site = useSiteConfig()
const links = computed(() => useAppConfig().navigation[locale.value]?.footer ?? [])
</script>

<template>
  <footer class="site-footer">
    <div>
      <nav :aria-label="t('a11y.footerMenu')">
        <ul class="link-list">
          <li
            v-for="link in links"
            :key="link.path"
          >
            <NuxtLink :to="link.path">
              {{ link.label }}
            </NuxtLink>
          </li>
          <li>
            <a :href="`/feed/${locale}.xml`">{{ t('blog.feed') }}</a>
          </li>
        </ul>
      </nav>
      <p>© {{ new Date().getFullYear() }} {{ site.name }}</p>
    </div>
  </footer>
</template>
