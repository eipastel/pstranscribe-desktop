import { app } from 'electron'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { DEFAULT_SETTINGS, type Settings } from '../shared/settings'

const settingsPath = (): string => join(app.getPath('userData'), 'settings.json')

// Materializa o arquivo na primeira execução para o usuário poder editar à mão;
// a UI de settings (batch 5) grava por aqui também.
export function loadSettings(): Settings {
  const file = settingsPath()
  if (!existsSync(file)) {
    saveSettings(DEFAULT_SETTINGS)
    return DEFAULT_SETTINGS
  }
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(readFileSync(file, 'utf8')) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings): void {
  writeFileSync(settingsPath(), JSON.stringify(settings, null, 2))
}
