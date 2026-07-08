import { app, type BrowserWindow } from 'electron'
import { uIOhook, UiohookKey } from 'uiohook-napi'
import { PTT_PRESS_CHANNEL, PTT_RELEASE_CHANNEL } from '../shared/ipc'
import type { Keybind } from '../shared/settings'

interface ActiveBind {
  keycode: number
  keybind: Keybind
}

let active: ActiveBind | null = null
let held = false

// Troca o atalho ao vivo, sem reiniciar o hook. false = tecla desconhecida.
export function setPttKeybind(keybind: Keybind): boolean {
  const keycode = UiohookKey[keybind.key as keyof typeof UiohookKey]
  if (typeof keycode !== 'number') {
    console.error(`ptt: tecla desconhecida: "${keybind.key}"`)
    return false
  }
  active = { keycode, keybind }
  held = false
  console.log('ptt: keybind ativo →', JSON.stringify(keybind))
  return true
}

// Hold-to-talk global: uiohook dá keydown E keyup (globalShortcut não dá keyup).
export function startPushToTalk(window: BrowserWindow, keybind: Keybind): void {
  setPttKeybind(keybind)

  uIOhook.on('keydown', (e) => {
    if (!active || held || e.keycode !== active.keycode) return // held: ignora key-repeat
    const { keybind: kb } = active
    if (e.ctrlKey !== kb.ctrl || e.altKey !== kb.alt || e.shiftKey !== kb.shift) return
    held = true
    console.log('ptt: press')
    window.webContents.send(PTT_PRESS_CHANNEL)
  })

  uIOhook.on('keyup', (e) => {
    if (!active || !held) return
    const { keycode, keybind: kb } = active
    const releasedMain = e.keycode === keycode
    const releasedRequiredModifier =
      (kb.ctrl && (e.keycode === UiohookKey.Ctrl || e.keycode === UiohookKey.CtrlRight)) ||
      (kb.alt && (e.keycode === UiohookKey.Alt || e.keycode === UiohookKey.AltRight)) ||
      (kb.shift && (e.keycode === UiohookKey.Shift || e.keycode === UiohookKey.ShiftRight))
    if (!releasedMain && !releasedRequiredModifier) return
    held = false
    console.log('ptt: release')
    window.webContents.send(PTT_RELEASE_CHANNEL)
  })

  uIOhook.start()
  app.on('will-quit', () => uIOhook.stop())
}
