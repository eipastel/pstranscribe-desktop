import './SettingsWindow.css'
import { useEffect } from 'react'
import Toggle from '@/components/Toggle/Toggle'
import { useSettings } from './useSettings'

// Painel de configurações fiel a VoiceSettings.dc.html
function SettingsWindow(): React.JSX.Element {
  const { settings, update } = useSettings()

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
      <div className="settings-body">
        {settings && (
          <>
            <div className="settings-row">
              <div className="settings-row-text">
                <div className="settings-row-label">Transcrever</div>
                <div className="settings-row-desc">Converte sua fala em texto automaticamente</div>
              </div>
              <Toggle
                checked={settings.transcrever}
                onChange={(v) => update({ transcrever: v })}
                ariaLabel="Transcrever"
              />
            </div>
            <div className={settings.transcrever ? 'settings-row' : 'settings-row dim'}>
              <div className="settings-row-text">
                <div className="settings-row-label">Formatar</div>
                <div className="settings-row-desc">
                  Enxuga a mensagem mantendo o jeito humano de escrever, com IA
                </div>
              </div>
              <Toggle
                checked={settings.transcrever && settings.formatar}
                onChange={(v) => update({ formatar: v })}
                disabled={!settings.transcrever}
                ariaLabel="Formatar"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SettingsWindow
