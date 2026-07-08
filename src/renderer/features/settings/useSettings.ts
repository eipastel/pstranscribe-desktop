import { useEffect, useState } from 'react'
import type { PublicSettings, SettingsPatch } from '@shared/ipc'

// Estado dos settings na janela de configurações: carrega no mount, salva a cada mudança.
export function useSettings(): {
  settings: PublicSettings | null
  update: (patch: SettingsPatch) => void
} {
  const [settings, setSettings] = useState<PublicSettings | null>(null)

  useEffect(() => {
    void window.api.getSettings().then(setSettings)
  }, [])

  const update = (patch: SettingsPatch): void => {
    setSettings((s) => (s ? { ...s, ...patch } : s)) // otimista; o main confirma
    void window.api.updateSettings(patch).then(setSettings)
  }

  return { settings, update }
}
