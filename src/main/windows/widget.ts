import { BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

const WIDTH = 400
const HEIGHT = 60
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
    focusable: false,
    hasShadow: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // ponytail: click-through fixo; toggle via IPC quando o widget ganhar interação
  window.setIgnoreMouseEvents(true, { forward: true })

  window.on('ready-to-show', () => window.show())

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return window
}
