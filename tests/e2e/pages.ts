// Every HTML page in the generated site, as URL paths (e.g. /en/about/), plus the 404 page.
import { readdirSync } from 'node:fs'

export const outputDir = '.output/public'

export const pagePaths = (readdirSync(outputDir, { recursive: true }) as string[])
  .filter(file => file.endsWith('index.html') && !file.startsWith('_'))
  .map(file => `/${file.replace(/index\.html$/, '')}`)
  .concat('/404.html')
  .sort()
