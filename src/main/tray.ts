import { app, Menu, Tray, nativeImage } from 'electron'
import icon from '../../resources/icon.png?asset'
import { openAppWindow } from './windows/app'

let tray: Tray | null = null

export function createTray(): void {
  const image = nativeImage.createFromPath(icon).resize({ width: 16, height: 16 })
  tray = new Tray(image)
  tray.setToolTip('PSTranscribe')
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Aplicativo', click: () => openAppWindow() },
      { type: 'separator' },
      { label: 'Sair', click: () => app.quit() }
    ])
  )
  tray.on('double-click', () => openAppWindow())
}
