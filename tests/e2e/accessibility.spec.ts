// Automated WCAG 2.2 A/AA checks (axe-core) on every generated page, under the conditions readers
// actually use: light and dark mode, forced colours, a 320 px wide screen and enlarged text spacing.
// Automated checks find only part of the problems; the manual checks are in docs/principles/accessibility.md.
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { pagePaths } from './pages'

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

async function expectNoViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(wcagTags).analyze()
  const summary = violations.map(v => `${v.id}: ${v.help}\n  ${v.nodes.map(n => n.target.join(' ')).join('\n  ')}`)
  expect(summary, summary.join('\n')).toEqual([])
}

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
}

for (const path of pagePaths) {
  test.describe(path, () => {
    for (const colorScheme of ['light', 'dark'] as const) {
      test(`has no WCAG violations in ${colorScheme} mode`, async ({ page }) => {
        await page.emulateMedia({ colorScheme })
        await page.goto(path)
        await expectNoViolations(page)
      })
    }

    test('has no WCAG violations with forced colours', async ({ page }) => {
      await page.emulateMedia({ forcedColors: 'active' })
      await page.goto(path)
      await expectNoViolations(page)
    })

    test('reflows at 320 px without horizontal scrolling (WCAG 1.4.10)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 })
      await page.goto(path)
      await expectNoHorizontalScroll(page)
    })

    test('survives text spacing overrides (WCAG 1.4.12)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 })
      await page.goto(path)
      await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }' })
      await expectNoHorizontalScroll(page)
    })
  })
}
