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
  /** Converte fala em texto (desligado = PTT não faz nada) */
  transcrever: boolean
  /** Enxuga a mensagem com IA mantendo o jeito humano (desligado = cola o bruto) */
  formatar: boolean
  /** Inicia junto com o Windows */
  autoLaunch: boolean
  /** Opacidade da janela do widget (0.5–1) */
  opacity: number
}

export const DEFAULT_SETTINGS: Settings = {
  keybind: { ctrl: true, alt: false, shift: false, key: 'P' },
  transcrever: true,
  formatar: true,
  autoLaunch: false,
  opacity: 1
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
