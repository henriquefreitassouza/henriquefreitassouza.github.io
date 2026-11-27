<script setup lang="ts">
// ::image-figure{src="/media/x.png" alt="…" width="800" height="600" caption="…" kind="infographic"}
// #description
// Full text version of everything the image shows.
// ::
// Kinds that carry more than a sentence of information (infographic, diagram, complex) must have
// a #description. Decorative images use kind="decorative" and alt="".
const props = withDefaults(defineProps<{
  src: string
  alt?: string
  width: number | string
  height: number | string
  caption?: string
  credit?: string
  kind?: 'photo' | 'infographic' | 'diagram' | 'complex' | 'decorative'
}>(), { alt: undefined, caption: undefined, credit: undefined, kind: 'photo' })
const slots = useSlots()
const { t } = useI18n()
const descriptionId = useId()
const decorative = props.kind === 'decorative'
const needsDescription = ['infographic', 'diagram', 'complex'].includes(props.kind)

assertAccessible(`Image figure ${props.src}`, {
  'alt (short alternative)': decorative || props.alt,
  'caption': decorative || props.caption,
  'width and height (positive numbers, in px)': Number(props.width) > 0 && Number(props.height) > 0,
  '#description slot (long description)': !needsDescription || slots.description,
})
</script>

<template>
  <div>
    <figure>
      <ResponsivePicture
        :src="src"
        :alt="decorative ? '' : (alt ?? '')"
        :width="width"
        :height="height"
        :describedby="needsDescription ? descriptionId : undefined"
      />
      <figcaption v-if="caption">
        {{ caption }}
        <span v-if="credit"> {{ t('media.credit') }}: {{ credit }}</span>
      </figcaption>
    </figure>
    <details v-if="slots.description">
      <summary>{{ t('media.longDescription') }}</summary>
      <div :id="descriptionId">
        <slot name="description" />
      </div>
    </details>
  </div>
</template>
