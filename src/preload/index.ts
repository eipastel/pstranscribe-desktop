import { contextBridge, ipcRenderer } from 'electron'
import {
  GET_SETTINGS_CHANNEL,
  PING_CHANNEL,
  SET_IGNORE_MOUSE_CHANNEL,
  type WidgetApi
} from '../shared/ipc'

// Expõe só o necessário ao renderer (contextIsolation está sempre ativo).
const api: WidgetApi = {
  ping: () => ipcRenderer.invoke(PING_CHANNEL),
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send(SET_IGNORE_MOUSE_CHANNEL, ignore),
  getSettings: () => ipcRenderer.invoke(GET_SETTINGS_CHANNEL)
}

contextBridge.exposeInMainWorld('api', api)
