import type { Settings } from './settings'
import type { HistoryStats, TranscriptionRecord } from './history'
import type { ReviewAction, SavedConcepts } from './glossary'

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

/** Erros da chave/API que a UI diferencia: chave inválida, rate limit, sem crédito, rede. */
export type KeyErrorCode = 'invalid' | 'rate_limit' | 'no_credit' | 'network'

/** Resultado de definir/validar a chave. */
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
export const CONCEPTS_SAVED_CHANNEL = 'concepts:saved'
export const CONCEPTS_SET_CHANNEL = 'concepts:set'
export const CONCEPTS_REMOVE_CHANNEL = 'concepts:remove'

// Atualização do app (electron-updater lendo dos GitHub Releases).
export const UPDATE_GET_CHANNEL = 'update:get' // snapshot do estado atual
export const UPDATE_CHECK_CHANNEL = 'update:check'
export const UPDATE_DOWNLOAD_CHANNEL = 'update:download'
export const UPDATE_INSTALL_CHANNEL = 'update:install' // reinicia e aplica
export const UPDATE_STATUS_CHANNEL = 'update:status' // main → renderer, a cada mudança

/** Estados do fluxo de atualização, na ordem em que a UI os mostra. */
export type UpdateState =
  'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error'

/** Snapshot do updater enviado ao renderer. */
export interface UpdateStatus {
  state: UpdateState
  /** Versão instalada agora (`app.getVersion()`). */
  version: string
  /** Versão nova, quando `state` é `available`/`downloading`/`downloaded`. */
  available?: string
  /** Progresso do download em % (0–100), durante `downloading`. */
  percent?: number
  /** Mensagem de erro, quando `state` é `error`. */
  error?: string
}

export interface HistoryPayload {
  /** registros mais recentes primeiro */
  records: TranscriptionRecord[]
  stats: HistoryStats
}

/** Saída do STT: texto + modelo usado, ou um erro de chave/API. */
export type TranscribeResult =
  { ok: true; text: string; model: string } | { ok: false; error: KeyErrorCode }

/** Erros do pipeline: os da chave/API, mais `disabled` (transcrição desligada). */
export type ProcessError = KeyErrorCode | 'disabled'

/**
 * Resultado do pipeline: `raw` (bruto pós-glossário), `text` (final),
 * `formatted` (passou pela IA) e `pasted` (colou no app em foco).
 */
export type ProcessResult =
  | { ok: true; raw: string; text: string; formatted: boolean; pasted: boolean }
  | { ok: false; error: ProcessError }

/** Resultado de abrir a sessão em tempo real. */
export type RealtimeStartResult = { ok: true } | { ok: false; error: ProcessError }

/**
 * A superfície que o preload expõe ao renderer como `window.api`.
 * Fonte da verdade do contrato IPC: cada método casa com um canal no main
 * (`ipc/handlers.ts`) e um wrapper no preload (`preload/index.ts`). Métodos
 * `on…` retornam uma função de cleanup para remover o listener.
 */
export interface WidgetApi {
  /** Healthcheck do IPC — responde 'pong'. */
  ping(): Promise<string>
  /** Liga/desliga o click-through da janela (mouse atravessa o overlay). */
  setIgnoreMouseEvents(ignore: boolean): void
  /** Settings atuais, sem o ciphertext da chave. */
  getSettings(): Promise<PublicSettings>
  /** Aplica um patch parcial e devolve os settings resultantes. */
  updateSettings(patch: SettingsPatch): Promise<PublicSettings>
  /** Avisa quando os settings mudam (ex.: editados em outra janela). */
  onSettingsChanged(callback: () => void): () => void
  /** Keybind push-to-talk pressionado — hora de começar a gravar. */
  onPttPress(callback: () => void): () => void
  /** Keybind push-to-talk solto — hora de parar e processar. */
  onPttRelease(callback: () => void): () => void
  /** Valida a chave na OpenAI e, se ok, guarda criptografada. */
  setApiKey(key: string): Promise<KeySetResult>
  /** Há uma chave guardada? */
  hasApiKey(): Promise<boolean>
  /** Remove a chave guardada. */
  clearApiKey(): Promise<void>
  /** Chave mascarada para exibição (ex.: `sk-…1234`), ou null. */
  getMaskedApiKey(): Promise<string | null>
  /** Avisa quando a chave é definida/removida. */
  onKeyChanged(callback: () => void): () => void
  /** Envia o áudio gravado para o pipeline (STT → formatação → colar). */
  processAudio(audio: ArrayBuffer, seconds: number): Promise<ProcessResult>
  /** Texto bruto da transcrição, assim que chega, antes da formatação. */
  onRawText(callback: (raw: string) => void): () => void
  /** Abre a sessão de transcrição em tempo real (WIP, desligada por flag). */
  startRealtime(): Promise<RealtimeStartResult>
  /** Envia um chunk PCM16 para a sessão em tempo real. */
  sendRealtimeAudio(pcm16: ArrayBuffer): void
  /** Encerra a sessão em tempo real. */
  stopRealtime(): Promise<void>
  /** Deltas de texto da sessão em tempo real. */
  onRealtimeDelta(callback: (text: string) => void): () => void
  /** Erro na sessão em tempo real. */
  onRealtimeError(callback: (error: ProcessError) => void): () => void
  /** Histórico de uso: registros recentes + agregados de custo. */
  getHistory(): Promise<HistoryPayload>
  /** Quantos conceitos aguardam revisão (para o badge do widget). */
  getConceptsCount(): Promise<number>
  /** Termos pendentes de revisão. */
  getConcepts(): Promise<string[]>
  /** Revisa um termo: manter / corrigir grafia / ignorar. */
  reviewConcept(term: string, action: ReviewAction, spelling?: string): Promise<void>
  /** Avisa quando o glossário muda (recarregar a lista). */
  onConceptsChanged(callback: () => void): () => void
  /** Abre a janela de revisão de conceitos (`#conceitos`). */
  openConcepts(): void
  /** Conceitos já salvos (correções + mantidos), para a aba Conceitos. */
  getSavedConcepts(): Promise<SavedConcepts>
  /** Grava/atualiza uma correção errado→certo. */
  setCorrection(wrong: string, right: string): Promise<void>
  /** Remove um conceito salvo. */
  removeConcept(term: string): Promise<void>
  /** Estado atual do updater (para a aba Atualização se sincronizar ao abrir). */
  getUpdateStatus(): Promise<UpdateStatus>
  /** Dispara uma checagem por versão nova nos Releases. */
  checkForUpdate(): Promise<void>
  /** Baixa a versão detectada como disponível. */
  downloadUpdate(): Promise<void>
  /** Reinicia o app e instala o update já baixado. */
  installUpdate(): Promise<void>
  /** Avisa a cada mudança de estado do updater. */
  onUpdateStatus(callback: (status: UpdateStatus) => void): () => void
}
