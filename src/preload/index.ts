import { contextBridge, ipcRenderer } from 'electron'
import {
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
  UPDATE_SETTINGS_CHANNEL,
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
  onPttPress: (callback) => subscribe(PTT_PRESS_CHANNEL, callback),
  onPttRelease: (callback) => subscribe(PTT_RELEASE_CHANNEL, callback),
  setApiKey: (key) => ipcRenderer.invoke(KEY_SET_CHANNEL, key),
  hasApiKey: () => ipcRenderer.invoke(KEY_STATUS_CHANNEL),
  clearApiKey: () => ipcRenderer.invoke(KEY_CLEAR_CHANNEL),
  getMaskedApiKey: () => ipcRenderer.invoke(KEY_MASKED_CHANNEL),
  onKeyChanged: (callback) => subscribe(KEY_CHANGED_CHANNEL, callback),
  processAudio: (audio) => ipcRenderer.invoke(PROCESS_AUDIO_CHANNEL, audio),
  onRawText: (callback) => {
    const listener = (_e: Electron.IpcRendererEvent, raw: string): void => callback(raw)
    ipcRenderer.on(PROCESS_RAW_CHANNEL, listener)
    return () => ipcRenderer.removeListener(PROCESS_RAW_CHANNEL, listener)
  }
}

contextBridge.exposeInMainWorld('api', api)
