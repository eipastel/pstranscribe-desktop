import { app, type BrowserWindow } from 'electron'
import { uIOhook, UiohookKey } from 'uiohook-napi'
import { PTT_PRESS_CHANNEL, PTT_RELEASE_CHANNEL } from '../shared/ipc'
import type { Keybind } from '../shared/settings'

interface ActiveBind {
  keycode: number
  keybind: Keybind
}

let mainWindow: BrowserWindow | null = null

let active: ActiveBind | null = null
let held = false

// Modo contínuo por toque: 1º toque emite PRESS, 2º emite RELEASE.
let activeToggle: ActiveBind | null = null
let toggleDown = false // debounce do auto-repeat do keydown
let listening = false // toggle no meio de uma captura

// ponytail: teto fixo ~2 min; virar config se alguém pedir. Protege contra o
// limite ~25MB do STT quando o usuário esquece o modo contínuo ligado.
const TOGGLE_AUTO_STOP_MS = 2 * 60 * 1000
let autoStopTimer: ReturnType<typeof setTimeout> | null = null

function emit(channel: string): void {
  mainWindow?.webContents.send(channel)
}

function clearAutoStop(): void {
  if (autoStopTimer) {
    clearTimeout(autoStopTimer)
    autoStopTimer = null
  }
}

function armAutoStop(): void {
  clearAutoStop()
  autoStopTimer = setTimeout(() => {
    if (!listening) return
    listening = false
    console.log('ptt: toggle auto-stop')
    emit(PTT_RELEASE_CHANNEL)
  }, TOGGLE_AUTO_STOP_MS)
}

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

// Idem para o atalho de toggle (transcrição contínua). Zera o estado do toggle.
export function setToggleKeybind(keybind: Keybind): boolean {
  const keycode = UiohookKey[keybind.key as keyof typeof UiohookKey]
  if (typeof keycode !== 'number') {
    console.error(`ptt: tecla de toggle desconhecida: "${keybind.key}"`)
    return false
  }
  activeToggle = { keycode, keybind }
  toggleDown = false
  listening = false
  clearAutoStop()
  console.log('ptt: keybind contínuo ativo →', JSON.stringify(keybind))
  return true
}

// Hold-to-talk global: uiohook dá keydown E keyup (globalShortcut não dá keyup).
export function startPushToTalk(window: BrowserWindow, keybind: Keybind): void {
  mainWindow = window
  setPttKeybind(keybind)

  uIOhook.on('keydown', (e) => {
    // held: ignora key-repeat. listening: exclusão mútua com o toggle contínuo.
    if (!active || held || listening || e.keycode !== active.keycode) return
    const { keybind: kb } = active
    if (e.ctrlKey !== kb.ctrl || e.altKey !== kb.alt || e.shiftKey !== kb.shift) return
    held = true
    console.log('ptt: press')
    emit(PTT_PRESS_CHANNEL)
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
    emit(PTT_RELEASE_CHANNEL)
  })

  // Toggle contínuo: alterna listening a cada toque; ignora enquanto o hold segura.
  uIOhook.on('keydown', (e) => {
    if (!activeToggle || toggleDown || held || e.keycode !== activeToggle.keycode) return
    const { keybind: kb } = activeToggle
    if (e.ctrlKey !== kb.ctrl || e.altKey !== kb.alt || e.shiftKey !== kb.shift) return
    toggleDown = true
    listening = !listening
    if (listening) {
      console.log('ptt: toggle on')
      emit(PTT_PRESS_CHANNEL)
      armAutoStop()
    } else {
      console.log('ptt: toggle off')
      emit(PTT_RELEASE_CHANNEL)
      clearAutoStop()
    }
  })

  uIOhook.on('keyup', (e) => {
    if (activeToggle && e.keycode === activeToggle.keycode) toggleDown = false
  })

  uIOhook.start()
  app.on('will-quit', () => uIOhook.stop())
}
