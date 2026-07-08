import { BrowserWindow, ipcMain } from 'electron'
import {
  GET_SETTINGS_CHANNEL,
  KEY_CLEAR_CHANNEL,
  KEY_SET_CHANNEL,
  KEY_STATUS_CHANNEL,
  PING_CHANNEL,
  SET_IGNORE_MOUSE_CHANNEL
} from '../../shared/ipc'
import { loadSettings } from '../settings'
import { clearApiKey, loadApiKey, storeApiKey, validateApiKey } from '../openai/key'

export function registerIpcHandlers(): void {
  ipcMain.handle(PING_CHANNEL, () => {
    console.log('ipc: pong')
    return 'pong'
  })

  ipcMain.handle(GET_SETTINGS_CHANNEL, () => loadSettings())

  ipcMain.handle(KEY_SET_CHANNEL, async (_event, key: string) => {
    const result = await validateApiKey(key)
    console.log('key:set →', JSON.stringify(result)) // nunca loga a chave
    if (result.ok) storeApiKey(key)
    return result
  })

  ipcMain.handle(KEY_STATUS_CHANNEL, () => loadApiKey() !== null)

  ipcMain.handle(KEY_CLEAR_CHANNEL, () => clearApiKey())

  // Hover na pílula desliga o ignore para receber cliques; fora dela, tudo atravessa
  ipcMain.on(SET_IGNORE_MOUSE_CHANNEL, (event, ignore: boolean) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.setIgnoreMouseEvents(ignore, { forward: true })
  })
}
