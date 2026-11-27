import { describe, expect, it } from 'vitest'
import { localizeFootnotes, prepareMarkdown, readSiteConfig, routeFromFile } from '../../modules/content-pipeline/pipeline'

const config = readSiteConfig('content/config.yml')
const pageYml = 'title: Sobre\ndescription: Uma descrição com tamanho suficiente para passar na validação do schema.\n'
const postYml = `${pageYml}datePublished: 2026-01-15
abstract: Resumo.
plainLanguageSummary: Resumo simples.
references:
  - id: freire1996
    type: book
    title: Pedagogia da autonomia
    author: [{ family: Freire, given: Paulo }]
    issued: { date-parts: [[1996]] }
`
const frontMatterOf = (output: string) => output.split('---')[1]!

describe('routeFromFile', () => {
  it('maps the default locale without a prefix and other locales with one', () => {
    expect(routeFromFile('pt-BR/blog/andei-20-km/andei-20-km.md', config)).toEqual({ locale: 'pt-BR', path: '/blog/andei-20-km', isPost: true })
    expect(routeFromFile('en/blog/i-walked-20-km/i-walked-20-km.md', config)).toEqual({ locale: 'en', path: '/en/blog/i-walked-20-km', isPost: true })
    expect(routeFromFile('es/acerca-de/acerca-de.md', config)).toEqual({ locale: 'es', path: '/es/acerca-de', isPost: false })
  })

  it('maps locale home pages and the blog index', () => {
    expect(routeFromFile('pt-BR/index.md', config).path).toBe('/')
    expect(routeFromFile('en/index.md', config).path).toBe('/en')
    expect(routeFromFile('en/blog/blog.md', config)).toEqual({ locale: 'en', path: '/en/blog', isPost: false })
  })

  it('rejects unfriendly slugs, mismatched file names and unknown locales', () => {
    expect(() => routeFromFile('pt-BR/blog/educação/educação.md', config)).toThrow(/friendly slug/)
    expect(() => routeFromFile('pt-BR/sobre/about.md', config)).toThrow(/named after its folder/)
    expect(() => routeFromFile('fr/index.md', config)).toThrow(/not a locale/)
  })
})

describe('prepareMarkdown', () => {
  it('injects validated metadata, locale and path as front matter', () => {
    const output = prepareMarkdown({ relPath: 'pt-BR/sobre/sobre.md', markdown: 'Texto.', yml: pageYml, config })
    expect(frontMatterOf(output)).toContain('title: Sobre')
    expect(frontMatterOf(output)).toContain('locale: pt-BR')
    expect(frontMatterOf(output)).toContain('path: /sobre')
    expect(output.endsWith('Texto.')).toBe(true)
  })

  it('applies post defaults from content/config.yml', () => {
    const output = prepareMarkdown({ relPath: 'pt-BR/blog/teste/teste.md', markdown: 'Texto [@freire1996].', yml: postYml, config })
    expect(frontMatterOf(output)).toContain('name: Henrique Freitas Souza')
    expect(frontMatterOf(output)).toContain('citationStyle: abnt')
  })

  it('renders ABNT citations that link to the reference list', () => {
    const output = prepareMarkdown({ relPath: 'pt-BR/blog/teste/teste.md', markdown: 'Ensinar [@freire1996, p. 25].', yml: postYml, config })
    expect(output).toContain('[(Freire, 1996, p. 25)](#ref-freire1996)')
    expect(output).toContain('id="ref-freire1996"')
  })

  it('leaves citations inside code blocks alone', () => {
    const output = prepareMarkdown({ relPath: 'pt-BR/blog/teste/teste.md', markdown: '[@freire1996]\n\n```md\n[@freire1996]\n```', yml: postYml, config })
    expect(output).toContain('```md\n[@freire1996]\n```')
  })

  it('fails on citations without a reference', () => {
    expect(() => prepareMarkdown({ relPath: 'pt-BR/blog/teste/teste.md', markdown: 'Texto [@ninguem2020].', yml: postYml, config })).toThrow(/no matching entry/)
  })

  it('fails on invalid metadata, naming the field', () => {
    expect(() => prepareMarkdown({ relPath: 'pt-BR/sobre/sobre.md', markdown: 'Texto.', yml: 'title: Sobre\ndescription: Curta\n', config })).toThrow(/description/)
    expect(() => prepareMarkdown({ relPath: 'pt-BR/sobre/sobre.md', markdown: 'Texto.', yml: `${pageYml}autor: X\n`, config })).toThrow(/invalid \.yml/)
  })

  it('rejects front matter and level-1 headings in the markdown', () => {
    expect(() => prepareMarkdown({ relPath: 'pt-BR/sobre/sobre.md', markdown: '---\ntitle: x\n---\nTexto.', yml: pageYml, config })).toThrow(/front matter/)
    expect(() => prepareMarkdown({ relPath: 'pt-BR/sobre/sobre.md', markdown: '# Título\n\nTexto.', yml: pageYml, config })).toThrow(/level-1 heading/)
  })
})

describe('localizeFootnotes', () => {
  it('translates the footnote heading and back links, and drops the heading from the TOC', () => {
    const body = {
      value: [['section', {}, ['h2', { id: 'footnote-label' }, ['a', {}, 'Footnotes']], ['a', { dataFootnoteBackref: '', ariaLabel: 'Back to reference 1' }, '↩']]],
      toc: { links: [{ id: 'intro' }, { id: 'footnote-label' }] },
    }
    localizeFootnotes(body, { footnotes: 'Notas', footnoteBack: 'Voltar ao texto' })
    expect(JSON.stringify(body.value)).toContain('"Notas"')
    expect(JSON.stringify(body.value)).toContain('"Voltar ao texto"')
    expect(body.toc.links).toEqual([{ id: 'intro' }])
  })
})
