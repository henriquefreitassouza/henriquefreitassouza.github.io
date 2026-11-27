/**
 * Stops the build when a rich-media item is missing an accessible alternative.
 * During `nuxt generate` the thrown error fails prerendering; in `nuxt dev` it shows on the page.
 * The rule behind it: docs/principles/accessibility.md, "Rich media alternatives".
 */
export function assertAccessible(component: string, required: Record<string, unknown>) {
  const missing = Object.entries(required).filter(([, value]) => !value).map(([name]) => name)
  if (missing.length) {
    throw createError({
      statusCode: 500,
      statusMessage: `${component} is missing: ${missing.join(', ')}. See docs/principles/accessibility.md.`,
      fatal: true,
    })
  }
}
