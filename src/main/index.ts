import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWidgetWindow } from './windows/widget'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.eipastel.pstranscribe')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWidgetWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
