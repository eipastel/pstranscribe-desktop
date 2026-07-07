import { BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

// 520×220: cabe a pílula de 460px nos estados altos (104px) + hint + sombra do vidro
const WIDTH = 520
const HEIGHT = 220
const TOP_RATIO = 0.15 // posição estilo Spotlight: topo a ~15% da altura da tela

export function createWidgetWindow(): BrowserWindow {
  const { workArea } = screen.getPrimaryDisplay()
  const x = workArea.x + Math.round((workArea.width - WIDTH) / 2)
  const y = workArea.y + Math.round(workArea.height * TOP_RATIO)

  const window = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    x,
    y,
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

  window.on('ready-to-show', () => window.show())

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

  return window
}
