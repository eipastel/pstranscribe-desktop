import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import { UPDATE_STATUS_CHANNEL, type UpdateStatus } from '../shared/ipc'

// Download é manual: só baixa quando o usuário clica. No startup a gente só
// checa e avisa (ver `registerUpdater`/`checkForUpdates`).
autoUpdater.autoDownload = false

let status: UpdateStatus = { state: 'not-available', version: app.getVersion() }

function set(next: Partial<UpdateStatus>): void {
  status = { ...status, ...next }
  BrowserWindow.getAllWindows().forEach((w) => w.webContents.send(UPDATE_STATUS_CHANNEL, status))
}

/** Estado atual do updater (para uma janela recém-aberta se sincronizar). */
export function currentUpdateStatus(): UpdateStatus {
  return status
}

/** Fia os eventos do electron-updater no snapshot que a UI observa. */
export function registerUpdater(): void {
  autoUpdater.on('checking-for-update', () => set({ state: 'checking' }))
  autoUpdater.on('update-available', (info) => set({ state: 'available', available: info.version }))
  autoUpdater.on('update-not-available', () =>
    set({ state: 'not-available', available: undefined })
  )
  autoUpdater.on('download-progress', (p) =>
    set({ state: 'downloading', percent: Math.round(p.percent) })
  )
  autoUpdater.on('update-downloaded', () => set({ state: 'downloaded' }))
  autoUpdater.on('error', (err) => set({ state: 'error', error: err.message }))
}

/** Checa se há versão nova. No-op quando não empacotado. */
export function checkForUpdates(): void {
  void autoUpdater.checkForUpdates()
}

/** Baixa a versão já detectada como disponível. */
export function downloadUpdate(): void {
  void autoUpdater.downloadUpdate()
}

/** Fecha o app e instala o update já baixado. */
export function installUpdate(): void {
  autoUpdater.quitAndInstall()
}
