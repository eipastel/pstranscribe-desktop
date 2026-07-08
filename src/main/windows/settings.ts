import { BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

let settingsWindow: BrowserWindow | null = null

export function openSettingsWindow(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.show()
    settingsWindow.focus()
    return
  }

  // 520 de largura acompanha o widget (folga simétrica pro shadow do vidro);
  // 660 de altura cabe o painel inteiro (460px de largura) sem cortar o último row.
  settingsWindow = new BrowserWindow({
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

  settingsWindow.on('ready-to-show', () => settingsWindow?.show())
  settingsWindow.on('closed', () => {
    settingsWindow = null
  })

  // Mesma SPA do widget; o hash decide qual tela renderizar
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void settingsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#settings`)
  } else {
    void settingsWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'settings' })
  }
}
