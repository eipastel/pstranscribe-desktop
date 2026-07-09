import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import { createWidgetWindow } from './windows/widget'
import { registerIpcHandlers } from './ipc/handlers'
import { loadSettings } from './settings'
import { startPushToTalk, setToggleKeybind } from './ptt'
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
  setToggleKeybind(settings.keybindContinuo)

  // Busca updates no GitHub Releases e notifica. No-op quando não empacotado.
  void autoUpdater.checkForUpdatesAndNotify()
})

app.on('window-all-closed', () => {
  app.quit()
})
