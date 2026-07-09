import { describe, it, expect } from 'vitest'
import { applyCorrections, emptyGlossary } from './glossary'

describe('applyCorrections', () => {
  it('sem correções → texto intacto', () => {
    expect(applyCorrections('oi mundo', {})).toBe('oi mundo')
  })

  it('troca palavra inteira ignorando caixa', () => {
    expect(applyCorrections('vou usar o rieqt hoje', { rieqt: 'React' })).toBe(
      'vou usar o React hoje'
    )
    expect(applyCorrections('RIEQT é bom', { rieqt: 'React' })).toBe('React é bom')
  })

  it('não troca no meio de outra palavra', () => {
    expect(applyCorrections('rieqtjs', { rieqt: 'React' })).toBe('rieqtjs')
  })

  it('respeita fronteira unicode em termos acentuados', () => {
    expect(applyCorrections('falei com jose ontem', { jose: 'José' })).toBe('falei com José ontem')
    expect(applyCorrections('josezinho', { jose: 'José' })).toBe('josezinho')
  })

  it('ignora chave vazia', () => {
    expect(applyCorrections('texto', { '': 'x' })).toBe('texto')
  })

  it('escapa metacaracteres de regex no termo', () => {
    expect(applyCorrections('preço c++ alto', { 'c++': 'C++' })).toBe('preço C++ alto')
  })
})

describe('emptyGlossary', () => {
  it('devolve a estrutura zerada', () => {
    expect(emptyGlossary()).toEqual({ corrections: {}, pending: [], reviewed: [], kept: [] })
  })
})
