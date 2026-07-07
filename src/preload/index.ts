import { contextBridge, ipcRenderer } from 'electron'
import {
  GET_SETTINGS_CHANNEL,
  PING_CHANNEL,
  PTT_PRESS_CHANNEL,
  PTT_RELEASE_CHANNEL,
  SET_IGNORE_MOUSE_CHANNEL,
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
  onPttPress: (callback) => subscribe(PTT_PRESS_CHANNEL, callback),
  onPttRelease: (callback) => subscribe(PTT_RELEASE_CHANNEL, callback)
}

contextBridge.exposeInMainWorld('api', api)
