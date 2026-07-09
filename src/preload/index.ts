import { contextBridge, ipcRenderer } from 'electron'
import {
  GET_HISTORY_CHANNEL,
  GET_SETTINGS_CHANNEL,
  KEY_CHANGED_CHANNEL,
  KEY_CLEAR_CHANNEL,
  KEY_MASKED_CHANNEL,
  KEY_SET_CHANNEL,
  KEY_STATUS_CHANNEL,
  PING_CHANNEL,
  PTT_PRESS_CHANNEL,
  PTT_RELEASE_CHANNEL,
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
  UPDATE_STATUS_CHANNEL,
  type ProcessError,
  type UpdateStatus,
  type WidgetApi
} from '../shared/ipc'

function subscribe(channel: string, callback: () => void): () => void {
  const listener = (): void => callback()
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeListener(channel, listener)
}

// Expõe só o necessário ao renderer (contextIsolation está sempre ativo).
const api: WidgetApi = {
  ping: () => ipcRenderer.invoke(PING_CHANNEL),
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send(SET_IGNORE_MOUSE_CHANNEL, ignore),
  getSettings: () => ipcRenderer.invoke(GET_SETTINGS_CHANNEL),
  updateSettings: (patch) => ipcRenderer.invoke(UPDATE_SETTINGS_CHANNEL, patch),
  onSettingsChanged: (callback) => subscribe(SETTINGS_CHANGED_CHANNEL, callback),
  onPttPress: (callback) => subscribe(PTT_PRESS_CHANNEL, callback),
  onPttRelease: (callback) => subscribe(PTT_RELEASE_CHANNEL, callback),
  setApiKey: (key) => ipcRenderer.invoke(KEY_SET_CHANNEL, key),
  hasApiKey: () => ipcRenderer.invoke(KEY_STATUS_CHANNEL),
  clearApiKey: () => ipcRenderer.invoke(KEY_CLEAR_CHANNEL),
  getMaskedApiKey: () => ipcRenderer.invoke(KEY_MASKED_CHANNEL),
  onKeyChanged: (callback) => subscribe(KEY_CHANGED_CHANNEL, callback),
  processAudio: (audio, seconds) => ipcRenderer.invoke(PROCESS_AUDIO_CHANNEL, audio, seconds),
  getHistory: () => ipcRenderer.invoke(GET_HISTORY_CHANNEL),
  getConceptsCount: () => ipcRenderer.invoke(CONCEPTS_COUNT_CHANNEL),
  getConcepts: () => ipcRenderer.invoke(CONCEPTS_LIST_CHANNEL),
  reviewConcept: (term, action, spelling) =>
    ipcRenderer.invoke(CONCEPTS_REVIEW_CHANNEL, term, action, spelling),
  onConceptsChanged: (callback) => subscribe(CONCEPTS_CHANGED_CHANNEL, callback),
  openConcepts: () => ipcRenderer.send(CONCEPTS_OPEN_CHANNEL),
  getSavedConcepts: () => ipcRenderer.invoke(CONCEPTS_SAVED_CHANNEL),
  setCorrection: (wrong, right) => ipcRenderer.invoke(CONCEPTS_SET_CHANNEL, wrong, right),
  removeConcept: (term) => ipcRenderer.invoke(CONCEPTS_REMOVE_CHANNEL, term),
  onRawText: (callback) => {
    const listener = (_e: Electron.IpcRendererEvent, raw: string): void => callback(raw)
    ipcRenderer.on(PROCESS_RAW_CHANNEL, listener)
    return () => ipcRenderer.removeListener(PROCESS_RAW_CHANNEL, listener)
  },
  startRealtime: () => ipcRenderer.invoke(REALTIME_START_CHANNEL),
  sendRealtimeAudio: (pcm16) => ipcRenderer.send(REALTIME_AUDIO_CHANNEL, pcm16),
  stopRealtime: () => ipcRenderer.invoke(REALTIME_STOP_CHANNEL),
  onRealtimeDelta: (callback) => {
    const listener = (_e: Electron.IpcRendererEvent, text: string): void => callback(text)
    ipcRenderer.on(REALTIME_DELTA_CHANNEL, listener)
    return () => ipcRenderer.removeListener(REALTIME_DELTA_CHANNEL, listener)
  },
  onRealtimeError: (callback) => {
    const listener = (_e: Electron.IpcRendererEvent, error: ProcessError): void => callback(error)
    ipcRenderer.on(REALTIME_ERROR_CHANNEL, listener)
    return () => ipcRenderer.removeListener(REALTIME_ERROR_CHANNEL, listener)
  },
  getUpdateStatus: () => ipcRenderer.invoke(UPDATE_GET_CHANNEL),
  checkForUpdate: () => ipcRenderer.invoke(UPDATE_CHECK_CHANNEL),
  downloadUpdate: () => ipcRenderer.invoke(UPDATE_DOWNLOAD_CHANNEL),
  installUpdate: () => ipcRenderer.invoke(UPDATE_INSTALL_CHANNEL),
  onUpdateStatus: (callback) => {
    const listener = (_e: Electron.IpcRendererEvent, status: UpdateStatus): void => callback(status)
    ipcRenderer.on(UPDATE_STATUS_CHANNEL, listener)
    return () => ipcRenderer.removeListener(UPDATE_STATUS_CHANNEL, listener)
  }
}

contextBridge.exposeInMainWorld('api', api)
