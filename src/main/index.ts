import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWidgetWindow } from './windows/widget'
import { registerIpcHandlers } from './ipc/handlers'
import { loadSettings } from './settings'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.eipastel.pstranscribe')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  console.log('settings:', JSON.stringify(loadSettings()))
  registerIpcHandlers()
  createWidgetWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
