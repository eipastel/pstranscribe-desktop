import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { registerUpdater, checkForUpdates } from './updater'
import { createWidgetWindow } from './windows/widget'
import { registerIpcHandlers } from './ipc/handlers'
import { loadSettings } from './settings'
import { startPushToTalk, setToggleKeybind } from './ptt'
import { createTray } from './tray'
import { openAppWindow } from './windows/app'

// Trava de instância única: uma 2ª cópia sai na hora e devolve o foco à janela
// do app na 1ª. Evita dois ícones na bandeja / dois widgets rodando juntos.
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => openAppWindow())
  bootstrap()
}

function bootstrap(): void {
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

    // Janela principal já visível no startup (antes só subia bandeja + widget).
    openAppWindow()

    // Só checa e avisa no startup; o download é manual (aba Atualização).
    registerUpdater()
    checkForUpdates()
  })

  app.on('window-all-closed', () => {
    app.quit()
  })
}
