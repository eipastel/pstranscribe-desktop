import { BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'

let appWindow: BrowserWindow | null = null

// Janela única "Aplicativo": shell com menu lateral (Configurações / Custos).
export function openAppWindow(): void {
  if (appWindow && !appWindow.isDestroyed()) {
    appWindow.show()
    appWindow.focus()
    return
  }

  // 760 de largura acomoda a sidebar + a área de conteúdo (460px do painel);
  // 660 de altura mantém o mesmo do painel de settings sem cortar linhas.
  appWindow = new BrowserWindow({
    width: 760,
    height: 660,
    show: false,
    icon, // mesmo ícone da bandeja na barra de tarefas
    transparent: true,
    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  appWindow.on('ready-to-show', () => appWindow?.show())
  appWindow.on('closed', () => {
    appWindow = null
  })

  // Mesma SPA do widget; o hash #app renderiza o shell
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void appWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#app`)
  } else {
    void appWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'app' })
  }
}
