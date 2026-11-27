import { expect, test } from '@playwright/test'

const demoPost = '/blog/guia-de-componentes/'

test('the published site never requests a database file', async ({ page }) => {
  const requests: string[] = []
  page.on('request', request => requests.push(request.url()))

  await page.goto('/')
  await page.getByRole('navigation', { name: 'Menu principal' }).getByRole('link', { name: 'Blog' }).click()
  await page.getByRole('link', { name: 'Guia de componentes dos artigos' }).first().click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Guia de componentes dos artigos')
  await page.getByRole('navigation', { name: 'Idioma' }).getByRole('link', { name: 'English' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Article component guide')

  expect(requests.filter(url => /sql_dump|sqlite|\.db(\?|$)/.test(url))).toEqual([])
})

test('the language switcher goes to the translated page, with a localized URL', async ({ page }) => {
  await page.goto(demoPost)
  const switcher = page.getByRole('navigation', { name: 'Idioma' })
  await expect(switcher.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/en/blog/component-guide/')
  // No Spanish version: the link says it goes to the Spanish home page instead.
  await expect(switcher.getByRole('link', { name: /Español \(página inicial\)/ })).toHaveAttribute('href', '/es/')
})

test('hreflang links are reciprocal and point to localized URLs', async ({ page }) => {
  const alternates = async (path: string) => {
    await page.goto(path)
    return page.locator('link[rel="alternate"][hreflang]').evaluateAll(links => links.map(l => `${l.getAttribute('hreflang')} ${new URL(l.getAttribute('href')!).pathname}`).sort())
  }
  const fromPortuguese = await alternates(demoPost)
  const fromEnglish = await alternates('/en/blog/component-guide/')
  expect(fromPortuguese).toEqual(['en /en/blog/component-guide/', 'pt-BR /blog/guia-de-componentes/', 'x-default /blog/guia-de-componentes/'])
  expect(fromEnglish).toEqual(fromPortuguese)
})

test('the skip link is the first stop and moves focus to the content', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})

test.describe('rich media still makes sense without images and scripts', () => {
  test.use({ javaScriptEnabled: false })

  test('every item keeps its text alternative', async ({ page }) => {
    await page.route(/\.(png|jpe?g|webp|avif|svg)(\?|$)|\/_ipx\//, route => route.abort())
    await page.goto(demoPost)

    // Image: alt text, caption and long description are in the HTML.
    await expect(page.getByRole('img', { name: 'Três barras cinza de alturas crescentes, da esquerda para a direita.' })).toHaveCount(1)
    await expect(page.getByText('Infográfico de exemplo: três barras de alturas diferentes.')).toBeVisible()
    await expect(page.getByText('A imagem mostra três barras verticais')).toBeAttached()

    // Charts: title, takeaway and the full data table.
    await expect(page.locator('table caption', { hasText: 'Matrículas em duas redes de ensino' })).toBeAttached()
    await expect(page.getByText('Nos dados fictícios, a rede A cresce todos os anos')).toBeVisible()

    // Diagram: without its script, the alt text shows and the text version remains.
    await expect(page.getByText('Diagrama: Fluxo de revisão de um artigo')).toBeVisible()
    await expect(page.getByText('Passa pela revisão de conteúdo.')).toBeAttached()

    // Embed: nothing loaded from the third party; a direct link and a summary instead.
    await expect(page.locator('iframe')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Abrir em OpenStreetMap' })).toBeVisible()
    await expect(page.getByText('O mapa mostra a região central de Brasília')).toBeVisible()
  })
})

test('a missing address in any language gets help in all three languages', async ({ page }) => {
  const errors: string[] = []
  page.on('console', message => ['error', 'warning'].includes(message.type()) && errors.push(message.text()))
  const response = await page.goto('/en/no-such-page/')
  expect(response?.status()).toBe(404)
  await page.waitForLoadState('networkidle')

  for (const [lang, latest] of [['pt-BR', 'Guia de componentes dos artigos'], ['en', 'Article component guide']]) {
    const section = page.locator(`section[lang="${lang}"]`)
    await expect(section.getByRole('link', { name: latest })).toBeVisible()
  }
  await expect(page.locator('section[lang="es"]').getByRole('link', { name: 'Ver todas las publicaciones' })).toHaveAttribute('href', '/es/blog/')
  // The header stays in the default language, so the prerendered HTML and the hydrated page match.
  await expect(page.getByRole('navigation', { name: 'Menu principal' })).toBeVisible()
  // The only error allowed is the browser's note about the 404 status itself.
  expect(errors.filter(text => !text.includes('status of 404'))).toEqual([])
})

test('pages load and hydrate without console errors or warnings', async ({ page }) => {
  const errors: string[] = []
  page.on('console', message => ['error', 'warning'].includes(message.type()) && errors.push(`${page.url()}: ${message.text()}`))
  for (const path of ['/', '/sobre/', '/blog/', demoPost, '/en/blog/component-guide/', '/blog/tag/acessibilidade/']) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
  }
  expect(errors).toEqual([])
})
