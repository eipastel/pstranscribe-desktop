import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { registerUpdater, checkForUpdates } from './updater'
import { createWidgetWindow } from './windows/widget'
import { registerIpcHandlers } from './ipc/handlers'
import { loadSettings } from './settings'
import { startPushToTalk } from './ptt'
import { createTray } from './tray'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.eipastel.pstranscribe')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const settings = loadSettings()
  registerIpcHandlers()
  createTray()
  const window = createWidgetWindow()
  window.setOpacity(settings.opacity)
  startPushToTalk(window, settings.keybind)

  // Só checa e avisa no startup; o download é manual (aba Atualização).
  registerUpdater()
  checkForUpdates()
})

app.on('window-all-closed', () => {
  app.quit()
})
