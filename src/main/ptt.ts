import { app, type BrowserWindow } from 'electron'
import { uIOhook, UiohookKey } from 'uiohook-napi'
import { PTT_PRESS_CHANNEL, PTT_RELEASE_CHANNEL } from '../shared/ipc'
import type { Keybind } from '../shared/settings'

// Hold-to-talk global: uiohook dá keydown E keyup (globalShortcut não dá keyup).
export function startPushToTalk(window: BrowserWindow, keybind: Keybind): void {
  const keycode = UiohookKey[keybind.key as keyof typeof UiohookKey]
  if (typeof keycode !== 'number') {
    console.error(`ptt: tecla desconhecida no settings.json: "${keybind.key}"`)
    return
  }

  let held = false

  uIOhook.on('keydown', (e) => {
    if (held || e.keycode !== keycode) return // held: ignora key-repeat
    if (e.ctrlKey !== keybind.ctrl || e.altKey !== keybind.alt || e.shiftKey !== keybind.shift)
      return
    held = true
    console.log('ptt: press')
    window.webContents.send(PTT_PRESS_CHANNEL)
  })

  uIOhook.on('keyup', (e) => {
    if (!held) return
    const releasedMain = e.keycode === keycode
    const releasedRequiredModifier =
      (keybind.ctrl && (e.keycode === UiohookKey.Ctrl || e.keycode === UiohookKey.CtrlRight)) ||
      (keybind.alt && (e.keycode === UiohookKey.Alt || e.keycode === UiohookKey.AltRight)) ||
      (keybind.shift && (e.keycode === UiohookKey.Shift || e.keycode === UiohookKey.ShiftRight))
    if (!releasedMain && !releasedRequiredModifier) return
    held = false
    console.log('ptt: release')
    window.webContents.send(PTT_RELEASE_CHANNEL)
  })

  uIOhook.start()
  app.on('will-quit', () => uIOhook.stop())
}
