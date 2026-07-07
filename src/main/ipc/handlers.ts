import { ipcMain } from 'electron'
import { PING_CHANNEL } from '../../shared/ipc'

export function registerIpcHandlers(): void {
  ipcMain.handle(PING_CHANNEL, () => {
    console.log('ipc: pong')
    return 'pong'
  })
}
