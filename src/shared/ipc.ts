import type { Settings } from './settings'

export const PING_CHANNEL = 'ping'
export const SET_IGNORE_MOUSE_CHANNEL = 'set-ignore-mouse-events'
export const GET_SETTINGS_CHANNEL = 'settings:get'
export const UPDATE_SETTINGS_CHANNEL = 'settings:update'

/** Campos editáveis pelo renderer — a chave nunca passa por aqui */
export type SettingsPatch = Partial<Omit<Settings, 'apiKeyEncrypted'>>
/** O que o renderer enxerga dos settings (sem o ciphertext da chave) */
export type PublicSettings = Omit<Settings, 'apiKeyEncrypted'>
export const PTT_PRESS_CHANNEL = 'ptt:press'
export const PTT_RELEASE_CHANNEL = 'ptt:release'
export const KEY_SET_CHANNEL = 'key:set'
export const KEY_STATUS_CHANNEL = 'key:status'
export const KEY_CLEAR_CHANNEL = 'key:clear'
export const KEY_MASKED_CHANNEL = 'key:masked'
export const KEY_CHANGED_CHANNEL = 'key:changed'

export type KeyErrorCode = 'invalid' | 'rate_limit' | 'no_credit' | 'network'

export interface KeySetResult {
  ok: boolean
  error?: KeyErrorCode
}

export const PROCESS_AUDIO_CHANNEL = 'audio:process'
export const PROCESS_RAW_CHANNEL = 'audio:raw'

export type TranscribeResult = { ok: true; text: string } | { ok: false; error: KeyErrorCode }

export type ProcessError = KeyErrorCode | 'disabled'

export type ProcessResult =
  | { ok: true; raw: string; text: string; formatted: boolean; pasted: boolean }
  | { ok: false; error: ProcessError }

export interface WidgetApi {
  ping(): Promise<string>
  setIgnoreMouseEvents(ignore: boolean): void
  getSettings(): Promise<PublicSettings>
  updateSettings(patch: SettingsPatch): Promise<PublicSettings>
  onPttPress(callback: () => void): () => void
  onPttRelease(callback: () => void): () => void
  setApiKey(key: string): Promise<KeySetResult>
  hasApiKey(): Promise<boolean>
  clearApiKey(): Promise<void>
  getMaskedApiKey(): Promise<string | null>
  onKeyChanged(callback: () => void): () => void
  processAudio(audio: ArrayBuffer): Promise<ProcessResult>
  onRawText(callback: (raw: string) => void): () => void
}
