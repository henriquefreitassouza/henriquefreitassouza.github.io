<script setup lang="ts">
// ::callout{type="warning"} … :: — a labelled box for notes, warnings and definitions.
const props = withDefaults(defineProps<{ type?: 'note' | 'warning' | 'definition', title?: string }>(), { type: 'note', title: undefined })
const { t } = useI18n()
const id = useId()
</script>

<template>
  <div
    class="callout"
    role="note"
    :aria-labelledby="id"
  >
    <p
      :id="id"
      class="callout-label"
    >
      {{ props.title ?? t(`callout.${props.type}`) }}
    </p>
    <slot />
  </div>
</template>
