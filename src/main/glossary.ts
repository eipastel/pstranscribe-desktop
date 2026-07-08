import { app } from 'electron'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import {
  applyCorrections,
  emptyGlossary,
  type Glossary,
  type ReviewAction,
  type SavedConcepts
} from '../shared/glossary'

// Glossário local em JSON no userData, espelhando history.ts.
const glossaryPath = (): string => join(app.getPath('userData'), 'glossary.json')

export function loadGlossary(): Glossary {
  const file = glossaryPath()
  if (!existsSync(file)) return emptyGlossary()
  try {
    const data = JSON.parse(readFileSync(file, 'utf8'))
    return { ...emptyGlossary(), ...data }
  } catch {
    return emptyGlossary()
  }
}

function saveGlossary(g: Glossary): void {
  writeFileSync(glossaryPath(), JSON.stringify(g, null, 2))
}

// Autocorreção sobre o texto bruto: carrega o map e aplica. Pura e local.
export function correctText(text: string): string {
  return applyCorrections(text, loadGlossary().corrections)
}

// Enfileira termos novos para revisão. Descarta vazios, duplicados e o que já foi
// revisado ou já está pendente (case-insensitive). Retorna quantos entraram — o
// caller usa para decidir se avisa a UI.
export function addPending(terms: string[]): number {
  const g = loadGlossary()
  const known = new Set([...g.pending, ...g.reviewed].map((t) => t.toLowerCase()))
  const fresh: string[] = []
  for (const t of terms) {
    const term = t.trim()
    const key = term.toLowerCase()
    if (!term || known.has(key)) continue
    known.add(key)
    fresh.push(term)
  }
  if (!fresh.length) return 0
  g.pending.push(...fresh)
  saveGlossary(g)
  return fresh.length
}

// Revisão de um termo pendente: tira da fila, marca como revisado e, conforme a
// ação, grava a grafia certa (correct) ou registra como mantido (keep).
export function reviewConcept(term: string, action: ReviewAction, spelling?: string): Glossary {
  const g = loadGlossary()
  g.pending = g.pending.filter((t) => t !== term)
  if (!g.reviewed.includes(term)) g.reviewed.push(term)
  if (action === 'correct' && spelling?.trim()) g.corrections[term] = spelling.trim()
  if (action === 'keep' && !g.kept.includes(term)) g.kept.push(term)
  saveGlossary(g)
  return g
}

// Conceitos salvos para a tela de revisão manual (correções + mantidos).
export function savedConcepts(): SavedConcepts {
  const g = loadGlossary()
  return { corrections: g.corrections, kept: g.kept }
}

// Grava/edita uma correção errado→certo. Cobre "adicionar do zero" e "editar
// grafia" — são o mesmo set. Se o termo estava só como mantido, deixa de ser.
export function setCorrection(wrong: string, right: string): SavedConcepts {
  const g = loadGlossary()
  const w = wrong.trim()
  const r = right.trim()
  if (w && r) {
    g.corrections[w] = r
    g.kept = g.kept.filter((t) => t !== w)
    saveGlossary(g)
  }
  return { corrections: g.corrections, kept: g.kept }
}

// Remove um conceito salvo, seja correção ou mantido.
export function removeConcept(term: string): SavedConcepts {
  const g = loadGlossary()
  delete g.corrections[term]
  g.kept = g.kept.filter((t) => t !== term)
  saveGlossary(g)
  return { corrections: g.corrections, kept: g.kept }
}
