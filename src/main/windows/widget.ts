import { BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

let widgetWindow: BrowserWindow | null = null

export function getWidgetWindow(): BrowserWindow | null {
  return widgetWindow && !widgetWindow.isDestroyed() ? widgetWindow : null
}

export function createWidgetWindow(): BrowserWindow {
  // Overlay fullscreen: cobre toda a área de trabalho; o CSS ancora a marca
  // d'água (canto inf-esq) e a pílula (centro-topo) sem reposicionar a janela.
  const { workArea } = screen.getPrimaryDisplay()

  const window = new BrowserWindow({
    width: workArea.width,
    height: workArea.height,
    x: workArea.x,
    y: workArea.y,
    show: false,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Click-through por padrão; o renderer desliga via IPC quando o cursor entra na pílula.
  // ponytail: no Windows o forward de mousemove não chega com o ignore ativo (limitação
  // do Electron em janela transparente) — o hover-toggle fica inerte até revisitarmos
  // (ex.: polling de cursor no main) numa batch futura.
  window.setIgnoreMouseEvents(true, { forward: true })

  // showInactive: o widget aparece sem roubar o foco do app do usuário
  window.on('ready-to-show', () => window.showInactive())

  if (is.dev) {
    // Espelha o console do renderer no terminal do dev
    window.webContents.on('console-message', (_event, _level, message) => {
      console.log('[renderer]', message)
    })
  }

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  widgetWindow = window
  return window
}
