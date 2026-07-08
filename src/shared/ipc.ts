import type { Settings } from './settings'

export const PING_CHANNEL = 'ping'
export const SET_IGNORE_MOUSE_CHANNEL = 'set-ignore-mouse-events'
export const GET_SETTINGS_CHANNEL = 'settings:get'
export const PTT_PRESS_CHANNEL = 'ptt:press'
export const PTT_RELEASE_CHANNEL = 'ptt:release'
export const KEY_SET_CHANNEL = 'key:set'
export const KEY_STATUS_CHANNEL = 'key:status'
export const KEY_CLEAR_CHANNEL = 'key:clear'

export type KeyErrorCode = 'invalid' | 'rate_limit' | 'no_credit' | 'network'

export interface KeySetResult {
  ok: boolean
  error?: KeyErrorCode
}

export const TRANSCRIBE_CHANNEL = 'audio:transcribe'

export type TranscribeResult = { ok: true; text: string } | { ok: false; error: KeyErrorCode }

export interface WidgetApi {
  ping(): Promise<string>
  setIgnoreMouseEvents(ignore: boolean): void
  getSettings(): Promise<Settings>
  onPttPress(callback: () => void): () => void
  onPttRelease(callback: () => void): () => void
  setApiKey(key: string): Promise<KeySetResult>
  hasApiKey(): Promise<boolean>
  clearApiKey(): Promise<void>
  transcribe(audio: ArrayBuffer): Promise<TranscribeResult>
}
