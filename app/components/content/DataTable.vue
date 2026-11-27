<script setup lang="ts">
// ::data-table{caption="…"}
// | Year | Value |
// |------|-------|
// ::
// Markdown tables have no caption syntax; this wrapper gives the table its name (read by screen readers).
const props = defineProps<{ caption: string }>()
provide('table-caption', props.caption)
</script>

<template>
  <slot />
</template>
