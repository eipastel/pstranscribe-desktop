import './SettingsWindow.css'
import { useEffect } from 'react'

// Painel de configurações (VoiceSettings.dc.html) — estrutura; os rows chegam nas próximas subtasks
function SettingsWindow(): React.JSX.Element {
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') window.close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="settings-panel">
      <div className="settings-head">
        <div>
          <div className="settings-title">Transcrição por voz</div>
          <div className="settings-sub">Ajuste como sua fala vira mensagem</div>
        </div>
        <button
          type="button"
          className="settings-close"
          aria-label="Fechar configurações"
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
      <div className="settings-body" />
    </div>
  )
}

export default SettingsWindow
