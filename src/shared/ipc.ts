import type { Settings } from './settings'
import type { HistoryStats, TranscriptionRecord } from './history'
import type { ReviewAction } from './glossary'

export const PING_CHANNEL = 'ping'
export const SET_IGNORE_MOUSE_CHANNEL = 'set-ignore-mouse-events'
export const GET_SETTINGS_CHANNEL = 'settings:get'
export const UPDATE_SETTINGS_CHANNEL = 'settings:update'
export const SETTINGS_CHANGED_CHANNEL = 'settings:changed'

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
export const GET_HISTORY_CHANNEL = 'history:get'

// Transcrição em tempo real (modo respostaRapida): sessão WebSocket no main.
export const REALTIME_START_CHANNEL = 'realtime:start'
export const REALTIME_AUDIO_CHANNEL = 'realtime:audio'
export const REALTIME_STOP_CHANNEL = 'realtime:stop'
export const REALTIME_DELTA_CHANNEL = 'realtime:delta'
export const REALTIME_ERROR_CHANNEL = 'realtime:error'

export const CONCEPTS_COUNT_CHANNEL = 'concepts:count'
export const CONCEPTS_LIST_CHANNEL = 'concepts:list'
export const CONCEPTS_REVIEW_CHANNEL = 'concepts:review'
export const CONCEPTS_CHANGED_CHANNEL = 'concepts:changed'
export const CONCEPTS_OPEN_CHANNEL = 'concepts:open'

export interface HistoryPayload {
  /** registros mais recentes primeiro */
  records: TranscriptionRecord[]
  stats: HistoryStats
}

export type TranscribeResult =
  | { ok: true; text: string; model: string }
  | { ok: false; error: KeyErrorCode }

export type ProcessError = KeyErrorCode | 'disabled'

export type ProcessResult =
  | { ok: true; raw: string; text: string; formatted: boolean; pasted: boolean }
  | { ok: false; error: ProcessError }

export type RealtimeStartResult = { ok: true } | { ok: false; error: ProcessError }

export interface WidgetApi {
  ping(): Promise<string>
  setIgnoreMouseEvents(ignore: boolean): void
  getSettings(): Promise<PublicSettings>
  updateSettings(patch: SettingsPatch): Promise<PublicSettings>
  onSettingsChanged(callback: () => void): () => void
  onPttPress(callback: () => void): () => void
  onPttRelease(callback: () => void): () => void
  setApiKey(key: string): Promise<KeySetResult>
  hasApiKey(): Promise<boolean>
  clearApiKey(): Promise<void>
  getMaskedApiKey(): Promise<string | null>
  onKeyChanged(callback: () => void): () => void
  processAudio(audio: ArrayBuffer, seconds: number): Promise<ProcessResult>
  onRawText(callback: (raw: string) => void): () => void
  startRealtime(): Promise<RealtimeStartResult>
  sendRealtimeAudio(pcm16: ArrayBuffer): void
  stopRealtime(): Promise<void>
  onRealtimeDelta(callback: (text: string) => void): () => void
  onRealtimeError(callback: (error: ProcessError) => void): () => void
  getHistory(): Promise<HistoryPayload>
  getConceptsCount(): Promise<number>
  getConcepts(): Promise<string[]>
  reviewConcept(term: string, action: ReviewAction, spelling?: string): Promise<void>
  onConceptsChanged(callback: () => void): () => void
  openConcepts(): void
}
