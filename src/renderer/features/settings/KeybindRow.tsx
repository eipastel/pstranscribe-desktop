import './KeybindRow.css'
import { useEffect, useState } from 'react'
import Button from '@/components/Button/Button'
import { keybindParts, type Keybind } from '@shared/settings'
import type { PublicSettings, SettingsPatch } from '@shared/ipc'

// Converte a tecla do KeyboardEvent para o nome que o uiohook entende
function captureKey(e: KeyboardEvent): string | null {
  if (/^[a-z]$/i.test(e.key)) return e.key.toUpperCase()
  if (/^[0-9]$/.test(e.key)) return e.key
  if (/^F([1-9]|1[0-9]|2[0-4])$/.test(e.key)) return e.key
  if (e.key === ' ') return 'Space'
  return null // modificador sozinho ou tecla sem mapeamento
}

interface KeybindRowProps {
  settings: PublicSettings
  update: (patch: SettingsPatch) => void
}

function KeybindRow({ settings, update }: KeybindRowProps): React.JSX.Element {
  const [capturing, setCapturing] = useState(false)

  useEffect(() => {
    if (!capturing) return
    const onKey = (e: KeyboardEvent): void => {
      e.preventDefault()
      e.stopPropagation()
      if (e.key === 'Escape') {
        setCapturing(false)
        return
      }
      const key = captureKey(e)
      if (!key) return // segue esperando uma tecla principal
      const keybind: Keybind = { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey, key }
      update({ keybind })
      setCapturing(false)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [capturing, update])

  return (
    <div className="settings-row">
      <div className="settings-row-text">
        <div className="settings-row-label">Atalho para falar</div>
        <div className="settings-row-desc">
          {capturing
            ? 'Pressione a combinação… (Esc cancela)'
            : 'Segure para gravar, solte para colar'}
        </div>
      </div>
      {!capturing && (
        <span className="keybind-chips" aria-hidden="true">
          {keybindParts(settings.keybind).map((part) => (
            <span key={part} className="keybind-chip">
              {part}
            </span>
          ))}
        </span>
      )}
      <Button onClick={() => setCapturing(!capturing)}>{capturing ? 'Cancelar' : 'Alterar'}</Button>
    </div>
  )
}

export default KeybindRow
