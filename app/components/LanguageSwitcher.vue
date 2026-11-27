<script setup lang="ts">
// Links to this page in the other languages. When a page has no translation, the link goes to that
// language's home page and says so, instead of silently landing somewhere unexpected.
const props = defineProps<{ alternates: Alternate[] }>()
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()

const options = computed(() => locales.value.map((l) => {
  const match = props.alternates.find(a => a.locale === l.code)
  return { code: l.code, name: l.name ?? l.code, to: match ? toUrlPath(match.path) : localePath('/', l.code), translated: Boolean(match) }
}))
</script>

<template>
  <nav :aria-label="t('language.label')">
    <ul class="link-list">
      <li
        v-for="option in options"
        :key="option.code"
      >
        <span
          v-if="option.code === locale"
          :lang="option.code"
          aria-current="true"
        ><strong>{{ option.name }}</strong></span>
        <NuxtLink
          v-else
          :to="option.to"
          :hreflang="option.code"
        >
          <span :lang="option.code">{{ option.name }}</span>
          <template v-if="!option.translated">
            {{ ` (${t('language.homeOnly')})` }}
          </template>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
