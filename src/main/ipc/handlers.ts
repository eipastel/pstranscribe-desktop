import { BrowserWindow, ipcMain } from 'electron'
import {
  GET_HISTORY_CHANNEL,
  GET_SETTINGS_CHANNEL,
  KEY_CHANGED_CHANNEL,
  KEY_CLEAR_CHANNEL,
  KEY_MASKED_CHANNEL,
  KEY_SET_CHANNEL,
  KEY_STATUS_CHANNEL,
  PING_CHANNEL,
  PROCESS_AUDIO_CHANNEL,
  PROCESS_RAW_CHANNEL,
  SET_IGNORE_MOUSE_CHANNEL,
  SETTINGS_CHANGED_CHANNEL,
  UPDATE_SETTINGS_CHANNEL,
  CONCEPTS_COUNT_CHANNEL,
  CONCEPTS_LIST_CHANNEL,
  CONCEPTS_REVIEW_CHANNEL,
  CONCEPTS_CHANGED_CHANNEL,
  CONCEPTS_OPEN_CHANNEL,
  CONCEPTS_SAVED_CHANNEL,
  CONCEPTS_SET_CHANNEL,
  CONCEPTS_REMOVE_CHANNEL,
  REALTIME_START_CHANNEL,
  REALTIME_AUDIO_CHANNEL,
  REALTIME_STOP_CHANNEL,
  REALTIME_DELTA_CHANNEL,
  REALTIME_ERROR_CHANNEL,
  UPDATE_GET_CHANNEL,
  UPDATE_CHECK_CHANNEL,
  UPDATE_DOWNLOAD_CHANNEL,
  UPDATE_INSTALL_CHANNEL,
  type HistoryPayload,
  type ProcessResult,
  type PublicSettings,
  type RealtimeStartResult,
  type SettingsPatch
} from '../../shared/ipc'
import type { ReviewAction } from '../../shared/glossary'
import { loadSettings, saveSettings } from '../settings'
import { clearApiKey, loadApiKey, maskedApiKey, storeApiKey, validateApiKey } from '../openai/key'
import { processAudio } from '../openai/pipeline'
import { openRealtimeTranscription, type RealtimeSession } from '../openai/realtime'
import { extractConcepts } from '../openai/concepts'
import { addPending } from '../glossary'
import { computeCost } from '../openai/pricing'
import { appendRecord, loadHistory } from '../history'
import {
  loadGlossary,
  reviewConcept,
  savedConcepts,
  setCorrection,
  removeConcept
} from '../glossary'
import { computeStats } from '../../shared/history'
import { pasteText, enqueuePaste, flushPasteQueue, warmPaste } from '../paste'
import { setPttKeybind } from '../ptt'
import { app } from 'electron'
import { getWidgetWindow } from '../windows/widget'
import { openConceptsWindow } from '../windows/concepts'
import { currentUpdateStatus, checkForUpdates, downloadUpdate, installUpdate } from '../updater'

function broadcastKeyChanged(): void {
  BrowserWindow.getAllWindows().forEach((w) => w.webContents.send(KEY_CHANGED_CHANNEL))
}

function broadcastConceptsChanged(): void {
  BrowserWindow.getAllWindows().forEach((w) => w.webContents.send(CONCEPTS_CHANGED_CHANNEL))
}

function publicSettings(): PublicSettings {
  const settings = { ...loadSettings() }
  delete settings.apiKeyEncrypted
  return settings
}

// Sessão de transcrição em tempo real ativa (uma por vez, enquanto o PTT está pressionado).
let realtimeSession: RealtimeSession | null = null

export function registerIpcHandlers(): void {
  ipcMain.handle(PING_CHANNEL, () => {
    console.log('ipc: pong')
    return 'pong'
  })

  ipcMain.handle(GET_SETTINGS_CHANNEL, (): PublicSettings => publicSettings())

  ipcMain.handle(UPDATE_SETTINGS_CHANNEL, (_event, patch: SettingsPatch): PublicSettings => {
    const safePatch = { ...patch }
    delete (safePatch as Record<string, unknown>).apiKeyEncrypted // nunca via este canal
    saveSettings({ ...loadSettings(), ...safePatch })
    console.log('settings:update', JSON.stringify(safePatch))
    if (safePatch.keybind) setPttKeybind(safePatch.keybind) // atalho troca ao vivo
    if (safePatch.autoLaunch !== undefined)
      app.setLoginItemSettings({ openAtLogin: safePatch.autoLaunch })
    if (safePatch.opacity !== undefined) getWidgetWindow()?.setOpacity(safePatch.opacity)
    BrowserWindow.getAllWindows().forEach((w) => w.webContents.send(SETTINGS_CHANGED_CHANNEL))
    return publicSettings()
  })

  ipcMain.handle(KEY_SET_CHANNEL, async (_event, key: string) => {
    const result = await validateApiKey(key)
    console.log('key:set →', JSON.stringify(result)) // nunca loga a chave
    if (result.ok) {
      storeApiKey(key)
      broadcastKeyChanged()
    }
    return result
  })

  ipcMain.handle(KEY_STATUS_CHANNEL, () => loadApiKey() !== null)

  ipcMain.handle(KEY_CLEAR_CHANNEL, () => {
    clearApiKey()
    broadcastKeyChanged()
  })

  ipcMain.handle(KEY_MASKED_CHANNEL, () => maskedApiKey())

  ipcMain.handle(GET_HISTORY_CHANNEL, (): HistoryPayload => {
    const records = loadHistory()
    const stats = computeStats(records)
    // mais recentes primeiro para a lista da tela de Custo
    return { records: [...records].reverse(), stats }
  })

  ipcMain.handle(
    PROCESS_AUDIO_CHANNEL,
    async (event, audio: ArrayBuffer, seconds: number): Promise<ProcessResult> => {
      const result = await processAudio(Buffer.from(audio), (raw) =>
        event.sender.send(PROCESS_RAW_CHANNEL, raw)
      )
      if (!result.ok) {
        console.log('pipeline: erro', result.error)
        return result
      }
      const pasted = result.text ? await pasteText(result.text) : false
      console.log(
        'pipeline:',
        `${seconds}s bruto="${result.raw.slice(0, 60)}" final="${result.text.slice(0, 60)}" formatted=${result.formatted} pasted=${pasted}`
      )
      // Métricas de custo fora do caminho crítico: agenda a gravação para depois
      // de responder, então não soma latência à transcrição.
      const costUsd = computeCost({
        sttModel: result.sttModel,
        seconds,
        formatModel: result.formatModel,
        formatTokens: result.formatTokens
      })
      setImmediate(() =>
        appendRecord({
          ts: Date.now(),
          seconds,
          sttModel: result.sttModel,
          formatTokens: result.formatTokens,
          costUsd
        })
      )
      // Extração de conceitos também fora do caminho crítico: a IA analisa o texto
      // e enfileira termos novos como pendentes de revisão.
      setImmediate(async () => {
        if (addPending(await extractConcepts(result.raw))) broadcastConceptsChanged()
      })
      return { ...result, pasted }
    }
  )

  ipcMain.handle(CONCEPTS_COUNT_CHANNEL, (): number => loadGlossary().pending.length)

  ipcMain.handle(CONCEPTS_LIST_CHANNEL, (): string[] => loadGlossary().pending)

  ipcMain.handle(
    CONCEPTS_REVIEW_CHANNEL,
    (_event, term: string, action: ReviewAction, spelling?: string) => {
      reviewConcept(term, action, spelling)
      broadcastConceptsChanged()
    }
  )

  ipcMain.on(CONCEPTS_OPEN_CHANNEL, () => openConceptsWindow())

  ipcMain.handle(CONCEPTS_SAVED_CHANNEL, () => savedConcepts())

  ipcMain.handle(CONCEPTS_SET_CHANNEL, (_event, wrong: string, right: string) => {
    setCorrection(wrong, right)
    broadcastConceptsChanged()
  })

  ipcMain.handle(CONCEPTS_REMOVE_CHANNEL, (_event, term: string) => {
    removeConcept(term)
    broadcastConceptsChanged()
  })

  // Abre a sessão realtime; cada delta é colado no cursor e ecoado ao renderer.
  ipcMain.handle(REALTIME_START_CHANNEL, async (event): Promise<RealtimeStartResult> => {
    if (realtimeSession) await realtimeSession.close() // encerra sessão órfã antes de abrir outra
    warmPaste() // aquece o powershell.exe enquanto a sessão abre
    const sender = event.sender
    const opened = await openRealtimeTranscription({
      onDelta: (text) => {
        enqueuePaste(text)
        sender.send(REALTIME_DELTA_CHANNEL, text)
      },
      // Erro no meio: mantém o que já foi colado, avisa o renderer e encerra a sessão.
      onError: (error) => {
        console.log('realtime: erro', error)
        realtimeSession = null
        void flushPasteQueue()
        sender.send(REALTIME_ERROR_CHANNEL, error)
      }
    })
    if ('ok' in opened) return opened // falhou antes de abrir
    realtimeSession = opened
    return { ok: true }
  })

  ipcMain.on(REALTIME_AUDIO_CHANNEL, (_event, pcm16: ArrayBuffer) =>
    realtimeSession?.sendAudio(Buffer.from(pcm16))
  )

  ipcMain.handle(REALTIME_STOP_CHANNEL, async () => {
    await realtimeSession?.close()
    realtimeSession = null
    await flushPasteQueue() // sem mais deltas: devolve o clipboard do usuário
  })

  // Atualização do app: a UI pede o snapshot atual e dispara checar/baixar/instalar.
  ipcMain.handle(UPDATE_GET_CHANNEL, () => currentUpdateStatus())
  ipcMain.handle(UPDATE_CHECK_CHANNEL, () => checkForUpdates())
  ipcMain.handle(UPDATE_DOWNLOAD_CHANNEL, () => downloadUpdate())
  ipcMain.handle(UPDATE_INSTALL_CHANNEL, () => installUpdate())

  // Hover na pílula desliga o ignore para receber cliques; fora dela, tudo atravessa
  ipcMain.on(SET_IGNORE_MOUSE_CHANNEL, (event, ignore: boolean) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.setIgnoreMouseEvents(ignore, { forward: true })
  })
}
