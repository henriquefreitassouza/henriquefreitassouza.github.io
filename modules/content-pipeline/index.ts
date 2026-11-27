// Local Nuxt module (auto-registered from modules/). Two jobs:
// 1. Merge each .md with its .yml before Nuxt Content parses it, and localize the parsed result (see pipeline.ts).
// 2. Keep the published site free of any database: Nuxt Content emits a SQL dump and a SQLite
//    WebAssembly engine for the browser. Every page reads its data from prerendered payloads
//    instead, so those files are deleted once the build is written.
import { existsSync, readFileSync } from 'node:fs'
import { readdir, rm } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'
import { parse } from 'yaml'
import { localizeFootnotes, prepareMarkdown, readSiteConfig } from './pipeline'

export default defineNuxtModule({
  meta: { name: 'content-pipeline' },
  setup(_options, nuxt) {
    const contentDir = join(nuxt.options.rootDir, 'content')
    const config = readSiteConfig(join(contentDir, 'config.yml'))

    nuxt.hook('content:file:beforeParse', ({ file }) => {
      if (!file.path.endsWith('.md')) return
      const relPath = relative(contentDir, file.path)
      const ymlPath = file.path.replace(/\.md$/, '.yml')
      if (!existsSync(ymlPath)) throw new Error(`[content] ${relPath}: missing its metadata file ${relative(contentDir, ymlPath)}.`)
      file.body = prepareMarkdown({ relPath, markdown: file.body, yml: readFileSync(ymlPath, 'utf8'), config })
    })

    const uiStrings = (locale: string) => parse(readFileSync(join(nuxt.options.rootDir, 'i18n/locales', `${locale}.yml`), 'utf8'))
    nuxt.hook('content:file:afterParse', ({ content }) => {
      if (typeof content.locale === 'string') localizeFootnotes(content.body as never, uiStrings(content.locale).post)
    })

    nuxt.hook('nitro:init', (nitro) => {
      nitro.hooks.hook('compiled', async () => {
        const publicDir = nitro.options.output.publicDir
        await rm(join(publicDir, '__nuxt_content'), { recursive: true, force: true })
        const assetsDir = join(publicDir, nuxt.options.app.buildAssetsDir)
        const files = existsSync(assetsDir) ? await readdir(assetsDir) : []
        await Promise.all(files.filter(f => f.startsWith('sqlite3')).map(f => rm(join(assetsDir, f))))
      })
    })
  },
})
