export interface Keybind {
  ctrl: boolean
  alt: boolean
  shift: boolean
  key: string // nome da tecla, ex.: 'P'
}

export interface Settings {
  keybind: Keybind
  /** Chave OpenAI criptografada com safeStorage, em base64 — nunca em texto puro */
  apiKeyEncrypted?: string
}

export const DEFAULT_SETTINGS: Settings = {
  keybind: { ctrl: true, alt: false, shift: false, key: 'P' }
}

// Partes do atalho para exibição (ex.: ['Ctrl', 'P'] no keycap do widget)
export function keybindParts(keybind: Keybind): string[] {
  const parts: string[] = []
  if (keybind.ctrl) parts.push('Ctrl')
  if (keybind.alt) parts.push('Alt')
  if (keybind.shift) parts.push('Shift')
  parts.push(keybind.key)
  return parts
}
