<script setup lang="ts">
// Every markdown table: captioned, and scrollable by keyboard when wider than the screen.
const caption = inject<string | undefined>('table-caption', undefined)
assertAccessible('Table', { 'caption (wrap the table in ::data-table{caption="…"})': caption })
const id = useId()
</script>

<template>
  <section
    class="table-scroll"
    :aria-labelledby="id"
    tabindex="0"
  >
    <table>
      <caption :id="id">
        {{ caption }}
      </caption>
      <slot />
    </table>
  </section>
</template>
