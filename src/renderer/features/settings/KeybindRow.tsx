import './KeybindRow.css'
import { useState } from 'react'
import Button from '@/components/Button/Button'
import { keybindParts } from '@shared/settings'
import type { PublicSettings, SettingsPatch } from '@shared/ipc'
import { useKeybindCapture } from '@/hooks/useKeybindCapture'

interface KeybindRowProps {
  settings: PublicSettings
  update: (patch: SettingsPatch) => void
}

function KeybindRow({ settings, update }: KeybindRowProps): React.JSX.Element {
  const [capturing, setCapturing] = useState(false)

  useKeybindCapture(
    capturing,
    (keybind) => {
      update({ keybind })
      setCapturing(false)
    },
    () => setCapturing(false)
  )

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
