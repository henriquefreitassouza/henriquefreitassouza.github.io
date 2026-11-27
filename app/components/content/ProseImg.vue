<script setup lang="ts">
// Plain markdown images: ![alt](src){width="800" height="450"}. Prefer ::image-figure, which also
// takes a caption and a long description. Width and height reserve the space before the image
// loads, so the text never jumps under the reader (and screen magnifier users don't lose their place).
const props = defineProps<{ src: string, alt?: string, width?: string | number, height?: string | number }>()
assertAccessible(`Image ${props.src}`, { 'alt text': props.alt, 'width and height (positive numbers, in px)': Number(props.width) > 0 && Number(props.height) > 0 })
</script>

<template>
  <ResponsivePicture
    :src="src"
    :alt="alt!"
    :width="width!"
    :height="height!"
  />
</template>
