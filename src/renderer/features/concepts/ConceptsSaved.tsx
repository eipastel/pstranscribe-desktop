import './ConceptsSaved.css'
import { useEffect, useState } from 'react'
import type { SavedConcepts } from '@shared/glossary'

// Tela de conceitos salvos (aba do app): correções (errado→certo) e mantidos,
// com editar grafia, remover e adicionar do zero. O broadcast concepts:changed
// (revisão de pendentes ou edições daqui) recarrega a lista.
export default function ConceptsSaved(): React.JSX.Element {
  const [saved, setSaved] = useState<SavedConcepts>({ corrections: {}, kept: [] })
  const [editing, setEditing] = useState<string | null>(null)
  const [spelling, setSpelling] = useState('')
  const [newWrong, setNewWrong] = useState('')
  const [newRight, setNewRight] = useState('')

  useEffect(() => {
    const load = (): void => void window.api.getSavedConcepts().then(setSaved)
    load()
    return window.api.onConceptsChanged(load)
  }, [])

  const corrections = Object.entries(saved.corrections)

  const startEditing = (term: string, right = ''): void => {
    setEditing(term)
    setSpelling(right)
  }

  const save = (term: string): void => {
    if (!spelling.trim()) return
    void window.api.setCorrection(term, spelling)
    setEditing(null)
    setSpelling('')
  }

  const add = (): void => {
    if (!newWrong.trim() || !newRight.trim()) return
    void window.api.setCorrection(newWrong, newRight)
    setNewWrong('')
    setNewRight('')
  }

  const editRow = (term: string): React.JSX.Element => (
    <div className="cs-edit">
      <input
        className="cs-input"
        value={spelling}
        autoFocus
        placeholder="grafia certa"
        onChange={(e) => setSpelling(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save(term)
          if (e.key === 'Escape') setEditing(null)
        }}
      />
      <button
        type="button"
        className="cs-btn cs-primary"
        disabled={!spelling.trim()}
        onClick={() => save(term)}
      >
        Salvar
      </button>
      <button type="button" className="cs-btn" onClick={() => setEditing(null)}>
        Cancelar
      </button>
    </div>
  )

  return (
    <div className="cs-panel">
      <div className="cs-head">
        <div>
          <div className="cs-title">Conceitos salvos</div>
          <div className="cs-sub">
            {corrections.length} correç{corrections.length === 1 ? 'ão' : 'ões'} ·{' '}
            {saved.kept.length} mantido{saved.kept.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      <div className="cs-body scroll-y">
        <div className="cs-add">
          <input
            className="cs-input"
            value={newWrong}
            placeholder="errado"
            onChange={(e) => setNewWrong(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <span className="cs-arrow">→</span>
          <input
            className="cs-input"
            value={newRight}
            placeholder="certo"
            onChange={(e) => setNewRight(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <button
            type="button"
            className="cs-btn cs-primary"
            disabled={!newWrong.trim() || !newRight.trim()}
            onClick={add}
          >
            Adicionar
          </button>
        </div>

        <div className="cs-section-label">Correções</div>
        {corrections.length === 0 ? (
          <div className="cs-empty">Nenhuma correção salva</div>
        ) : (
          <ul className="cs-list">
            {corrections.map(([wrong, right]) => (
              <li className="cs-item" key={wrong}>
                <div className="cs-term">
                  <span className="cs-wrong">{wrong}</span>
                  <span className="cs-arrow">→</span>
                  <span className="cs-right">{right}</span>
                </div>
                {editing === wrong ? (
                  editRow(wrong)
                ) : (
                  <div className="cs-actions">
                    <button
                      type="button"
                      className="cs-btn"
                      onClick={() => startEditing(wrong, right)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="cs-btn cs-muted"
                      onClick={() => void window.api.removeConcept(wrong)}
                    >
                      Remover
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="cs-section-label">Mantidos</div>
        {saved.kept.length === 0 ? (
          <div className="cs-empty">Nenhum termo mantido</div>
        ) : (
          <ul className="cs-list">
            {saved.kept.map((term) => (
              <li className="cs-item" key={term}>
                <span className="cs-term">{term}</span>
                {editing === term ? (
                  editRow(term)
                ) : (
                  <div className="cs-actions">
                    <button type="button" className="cs-btn" onClick={() => startEditing(term)}>
                      Corrigir grafia
                    </button>
                    <button
                      type="button"
                      className="cs-btn cs-muted"
                      onClick={() => void window.api.removeConcept(term)}
                    >
                      Remover
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
