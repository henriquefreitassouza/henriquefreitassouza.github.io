import { describe, expect, it } from 'vitest'
import { slugify, toContentPath, toUrlPath } from '../../shared/utils/paths'

describe('paths', () => {
  it('converts between content paths and published URLs', () => {
    expect(toUrlPath('/en/about')).toBe('/en/about/')
    expect(toUrlPath('/')).toBe('/')
    expect(toContentPath('/en/about/')).toBe('/en/about')
    expect(toContentPath('/')).toBe('/')
  })

  it('makes friendly tag slugs', () => {
    expect(slugify('Avaliação educacional')).toBe('avaliacao-educacional')
    expect(slugify('  Guia de estilo! ')).toBe('guia-de-estilo')
  })
})
