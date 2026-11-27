<script setup lang="ts">
// ::diagram{alt="…" caption="…"}
// ```mermaid
// graph TD; A --> B
// ```
// #description
// The same information as text or a list.
// ::
const props = defineProps<{ alt: string, caption: string }>()
const slots = useSlots()
const { t } = useI18n()

assertAccessible('Diagram', { 'alt (short alternative)': props.alt, 'caption': props.caption, '#description slot (text version)': slots.description })
provide('diagram-alt', props.alt)
</script>

<template>
  <div>
    <figure>
      <slot />
      <figcaption>{{ caption }}</figcaption>
    </figure>
    <details>
      <summary>{{ t('media.longDescription') }}</summary>
      <slot name="description" />
    </details>
  </div>
</template>
