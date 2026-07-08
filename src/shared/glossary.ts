// Ação de revisão de um conceito pendente.
// keep = "é isso / manter" (correto, só não sugerir de novo) · correct = grava a
// grafia certa no map · ignore = descarta.
export type ReviewAction = 'keep' | 'correct' | 'ignore'

// Glossário persistente: correções aprovadas + fila de revisão + memória do que
// já foi visto (para não sugerir de novo).
export interface Glossary {
  /** grafia errada (como veio) → grafia certa */
  corrections: Record<string, string>
  /** termos aguardando revisão do usuário */
  pending: string[]
  /** termos já revisados (aprovado/corrigido/ignorado) — não voltam a ser sugeridos */
  reviewed: string[]
  /** termos marcados como "é isso" (mantidos), sem troca de grafia */
  kept: string[]
}

export const emptyGlossary = (): Glossary => ({
  corrections: {},
  pending: [],
  reviewed: [],
  kept: []
})

// Conceitos salvos, para a tela de revisão manual: correções (errado→certo) e
// mantidos (sem troca de grafia). Não inclui pendentes nem ignorados.
export interface SavedConcepts {
  corrections: Record<string, string>
  kept: string[]
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Troca cada termo errado pela grafia certa: palavra inteira, ignorando caixa.
// Fronteira unicode (lookaround em \p{L}\p{N}) em vez de \b, que erra em termos
// acentuados ("José", "São"). Pura e local — sem rede.
export function applyCorrections(text: string, corrections: Record<string, string>): string {
  let out = text
  for (const [wrong, right] of Object.entries(corrections)) {
    if (!wrong) continue
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(wrong)}(?![\\p{L}\\p{N}])`, 'giu')
    out = out.replace(re, right)
  }
  return out
}
