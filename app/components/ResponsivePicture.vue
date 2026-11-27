<script setup lang="ts">
// The <picture> behind ::image-figure and plain markdown images. Why these numbers: "Images" in
// docs/principles/coding.md.
// - The text column is at most 640 CSS px wide (70ch at the default 16 px font); on smaller
//   screens images fill the width. `sizes` tells the browser so before it downloads anything.
// - Files are 320, 640, 960 and 1280 px wide: half to twice the column. The browser picks the
//   smallest one that covers its slot × the screen's pixel density. 2× (1280 px) is the cap:
//   denser screens gain almost nothing visible for the extra bytes.
// - No file is wider than the source: a larger one would only repeat the source.
// - SVG is served as it is: vectors are sharp at any size.
const props = defineProps<{ src: string, alt: string, width: number | string, height: number | string, describedby?: string }>()
const COLUMN = 640
const WIDTHS = [320, 640, 960, 1280]

const img = useImage()
const vector = props.src.endsWith('.svg')
const widths = [...new Set([...WIDTHS.filter(w => w < Number(props.width)), Math.min(Number(props.width), COLUMN * 2)])]
const srcset = (format?: string) => widths.map(w => `${img(props.src, { width: w, format })} ${w}w`).join(', ')
const sizes = `(max-width: ${COLUMN}px) 100vw, ${COLUMN}px`
</script>

<template>
  <img
    v-if="vector"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :aria-describedby="describedby"
    loading="lazy"
    decoding="async"
  >
  <picture v-else>
    <source
      v-for="format in ['avif', 'webp']"
      :key="format"
      :type="`image/${format}`"
      :srcset="srcset(format)"
      :sizes="sizes"
    >
    <!-- Fallback in the source format (JPEG or PNG) for browsers without AVIF or WebP. -->
    <img
      :src="img(src, { width: widths.at(-1) })"
      :srcset="srcset()"
      :sizes="sizes"
      :alt="alt"
      :width="width"
      :height="height"
      :aria-describedby="describedby"
      loading="lazy"
      decoding="async"
    >
  </picture>
</template>
