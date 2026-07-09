import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'

let appWindow: BrowserWindow | null = null
let isQuitting = false

// Só o "Sair" da bandeja (app.quit → before-quit) encerra de verdade; a partir
// daí o handler de `close` deixa a janela fechar em vez de só esconder.
app.on('before-quit', () => {
  isQuitting = true
})

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

  // X e Escape disparam window.close() no renderer; escondemos pra bandeja em
  // vez de destruir, preservando o estado. Sair de verdade só pela bandeja.
  appWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault()
      appWindow?.hide()
    }
  })

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
