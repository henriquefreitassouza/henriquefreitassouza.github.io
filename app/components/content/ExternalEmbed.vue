<script setup lang="ts">
// ::external-embed{src="https://…" title="…" provider="YouTube"}
// Text summary or transcript of what the embedded content shows.
// ::
// Nothing loads from the third party until the reader asks for it (privacy and performance).
// Without JavaScript, the reader gets the direct link and the summary.
const props = withDefaults(defineProps<{ src: string, title: string, provider: string, aspectRatio?: string }>(), { aspectRatio: '16 / 9' })
const slots = useSlots()
const { t } = useI18n()

assertAccessible(`External embed ${props.src}`, {
  'title': props.title,
  'provider': props.provider,
  'https src': props.src?.startsWith('https://'),
  'summary or transcript (component content)': slots.default,
})

const mounted = ref(false)
const loaded = ref(false)
const frame = ref<HTMLIFrameElement>()
onMounted(() => (mounted.value = true))

async function load() {
  loaded.value = true
  await nextTick()
  frame.value?.focus()
}
</script>

<template>
  <figure>
    <iframe
      v-if="loaded"
      ref="frame"
      :src="src"
      :title="title"
      :style="{ aspectRatio, width: '100%', border: 0 }"
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    />
    <div
      v-else
      class="media-placeholder"
    >
      <p>{{ t('media.embedNotice', { provider }) }}</p>
      <button
        v-if="mounted"
        type="button"
        @click="load"
      >
        {{ t('media.embedLoad', { provider }) }}
      </button>
    </div>
    <slot />
    <figcaption>
      {{ title }} —
      <a :href="src">{{ t('media.embedOpen', { provider }) }}</a>
    </figcaption>
  </figure>
</template>
