import { contextBridge, ipcRenderer } from 'electron'
import { PING_CHANNEL, type WidgetApi } from '../shared/ipc'

// Expõe só o necessário ao renderer (contextIsolation está sempre ativo).
const api: WidgetApi = {
  ping: () => ipcRenderer.invoke(PING_CHANNEL)
}

contextBridge.exposeInMainWorld('api', api)
