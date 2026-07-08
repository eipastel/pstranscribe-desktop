import { BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

let conceptsWindow: BrowserWindow | null = null

export function openConceptsWindow(): void {
  if (conceptsWindow && !conceptsWindow.isDestroyed()) {
    conceptsWindow.show()
    conceptsWindow.focus()
    return
  }

  conceptsWindow = new BrowserWindow({
    width: 520,
    height: 660,
    show: false,
    transparent: true,
    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  conceptsWindow.on('ready-to-show', () => conceptsWindow?.show())
  conceptsWindow.on('closed', () => {
    conceptsWindow = null
  })

  // Mesma SPA; o hash #conceitos decide a tela
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void conceptsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#conceitos`)
  } else {
    void conceptsWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'conceitos' })
  }
}
