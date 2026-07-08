import './ConceptsWindow.css'
import { useEffect, useState } from 'react'
import type { ReviewAction } from '@shared/glossary'

// Painel de conceitos (badge do widget → aqui): lista os pendentes e, por termo,
// oferece manter / corrigir grafia / ignorar. Cada ação grava e o broadcast
// concepts:changed recarrega a lista.
export default function ConceptsWindow(): React.JSX.Element {
  const [terms, setTerms] = useState<string[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [spelling, setSpelling] = useState('')

  useEffect(() => {
    const load = (): void => void window.api.getConcepts().then(setTerms)
    load()
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') window.close()
    }
    window.addEventListener('keydown', onKey)
    const off = window.api.onConceptsChanged(load)
    return () => {
      window.removeEventListener('keydown', onKey)
      off()
    }
  }, [])

  const review = (term: string, action: ReviewAction, s?: string): void => {
    void window.api.reviewConcept(term, action, s)
    setEditing(null)
    setSpelling('')
  }

  const startEditing = (term: string): void => {
    setEditing(term)
    setSpelling(term)
  }

  return (
    <div className="cc-panel">
      <div className="cc-head">
        <div>
          <div className="cc-title">Conceitos</div>
          <div className="cc-sub">
            {terms.length ? `${terms.length} para revisar` : 'Nada pendente'}
          </div>
        </div>
        <button
          type="button"
          className="cc-close"
          aria-label="Fechar"
          onClick={() => window.close()}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div className="cc-body">
        {terms.length === 0 ? (
          <div className="cc-empty">Nenhum conceito para revisar</div>
        ) : (
          <ul className="cc-list">
            {terms.map((term) => (
              <li className="cc-item" key={term}>
                <span className="cc-term">{term}</span>
                {editing === term ? (
                  <div className="cc-edit">
                    <input
                      className="cc-input"
                      value={spelling}
                      autoFocus
                      onChange={(e) => setSpelling(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && spelling.trim()) review(term, 'correct', spelling)
                      }}
                    />
                    <button
                      type="button"
                      className="cc-btn cc-primary"
                      disabled={!spelling.trim()}
                      onClick={() => review(term, 'correct', spelling)}
                    >
                      Salvar
                    </button>
                    <button type="button" className="cc-btn" onClick={() => setEditing(null)}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="cc-actions">
                    <button type="button" className="cc-btn" onClick={() => review(term, 'keep')}>
                      É isso
                    </button>
                    <button type="button" className="cc-btn" onClick={() => startEditing(term)}>
                      Corrigir grafia
                    </button>
                    <button
                      type="button"
                      className="cc-btn cc-muted"
                      onClick={() => review(term, 'ignore')}
                    >
                      Ignorar
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
