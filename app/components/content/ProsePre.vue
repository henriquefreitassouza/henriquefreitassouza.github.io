<script setup lang="ts">
// Code blocks (highlighted at build time) with a copy button; ```mermaid blocks become diagrams.
const props = defineProps<{ code?: string, language?: string | null, filename?: string | null, class?: string | null }>()
const { t } = useI18n()
const isMermaid = props.language === 'mermaid'
const diagramAlt = inject<string | undefined>('diagram-alt', undefined)
if (isMermaid) assertAccessible('Mermaid diagram', { 'a ::diagram wrapper with alt, caption and #description': diagramAlt })

// The copy button needs the Clipboard API (Baseline 2024, HTTPS only), so it appears only where that
// API exists; everywhere else the code can still be selected and copied by hand.
const canCopy = ref(false)
const copied = ref(false)
const diagram = ref<HTMLElement>()
const renderId = `mermaid-${useId()}`

let observer: IntersectionObserver | undefined

onMounted(() => {
  canCopy.value = Boolean(navigator.clipboard)
  if (!isMermaid || !diagram.value) return
  // Mermaid is about 2 MB of JavaScript, so it loads only when a diagram comes near the screen
  // (never on pages without one). Until then, and if it fails, the alt text and description remain.
  observer = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting)) return
    observer?.disconnect()
    renderDiagram()
  }, { rootMargin: '50% 0px' })
  observer.observe(diagram.value)
})
onBeforeUnmount(() => observer?.disconnect())

async function renderDiagram() {
  try {
    const { default: mermaid } = await import('mermaid')
    const dark = matchMedia('(prefers-color-scheme: dark)').matches
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: dark ? 'dark' : 'neutral' })
    const { svg } = await mermaid.render(renderId, props.code ?? '')
    // The reader may have left the page while Mermaid loaded.
    if (!diagram.value) return
    diagram.value.innerHTML = svg
    const element = diagram.value.querySelector('svg')
    element?.setAttribute('role', 'img')
    element?.setAttribute('aria-label', diagramAlt ?? '')
  }
  catch {
    // Network or syntax error: keep the text placeholder, and remove any error box Mermaid added.
    document.getElementById(`d${renderId}`)?.remove()
  }
}

async function copy() {
  // The browser may refuse (for example, permission denied): then the label stays "Copy".
  try {
    await navigator.clipboard.writeText(props.code ?? '')
  }
  catch {
    return
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 3000)
}
</script>

<template>
  <div
    v-if="isMermaid"
    ref="diagram"
  >
    <p class="media-placeholder">
      {{ t('media.diagram') }}: {{ diagramAlt }}
    </p>
  </div>
  <div v-else>
    <div class="code-block-header">
      <span>{{ filename ?? language }}</span>
      <button
        v-if="canCopy"
        type="button"
        @click="copy"
      >
        <span aria-live="polite">{{ copied ? t('code.copied') : t('code.copy') }}</span>
      </button>
    </div>
    <pre
      :class="props.class"
      tabindex="0"
    ><slot /></pre>
  </div>
</template>
