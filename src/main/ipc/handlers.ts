import { BrowserWindow, ipcMain } from 'electron'
import {
  GET_SETTINGS_CHANNEL,
  KEY_CHANGED_CHANNEL,
  KEY_CLEAR_CHANNEL,
  KEY_MASKED_CHANNEL,
  KEY_SET_CHANNEL,
  KEY_STATUS_CHANNEL,
  PING_CHANNEL,
  PROCESS_AUDIO_CHANNEL,
  PROCESS_RAW_CHANNEL,
  SET_IGNORE_MOUSE_CHANNEL,
  SETTINGS_CHANGED_CHANNEL,
  UPDATE_SETTINGS_CHANNEL,
  type ProcessResult,
  type PublicSettings,
  type SettingsPatch
} from '../../shared/ipc'
import { loadSettings, saveSettings } from '../settings'
import { clearApiKey, loadApiKey, maskedApiKey, storeApiKey, validateApiKey } from '../openai/key'
import { processAudio } from '../openai/pipeline'
import { pasteText } from '../paste'
import { setPttKeybind } from '../ptt'
import { app } from 'electron'
import { getWidgetWindow } from '../windows/widget'

function broadcastKeyChanged(): void {
  BrowserWindow.getAllWindows().forEach((w) => w.webContents.send(KEY_CHANGED_CHANNEL))
}

function publicSettings(): PublicSettings {
  const settings = { ...loadSettings() }
  delete settings.apiKeyEncrypted
  return settings
}

export function registerIpcHandlers(): void {
  ipcMain.handle(PING_CHANNEL, () => {
    console.log('ipc: pong')
    return 'pong'
  })

  ipcMain.handle(GET_SETTINGS_CHANNEL, (): PublicSettings => publicSettings())

  ipcMain.handle(UPDATE_SETTINGS_CHANNEL, (_event, patch: SettingsPatch): PublicSettings => {
    const safePatch = { ...patch }
    delete (safePatch as Record<string, unknown>).apiKeyEncrypted // nunca via este canal
    saveSettings({ ...loadSettings(), ...safePatch })
    console.log('settings:update', JSON.stringify(safePatch))
    if (safePatch.keybind) setPttKeybind(safePatch.keybind) // atalho troca ao vivo
    if (safePatch.autoLaunch !== undefined)
      app.setLoginItemSettings({ openAtLogin: safePatch.autoLaunch })
    if (safePatch.opacity !== undefined) getWidgetWindow()?.setOpacity(safePatch.opacity)
    BrowserWindow.getAllWindows().forEach((w) => w.webContents.send(SETTINGS_CHANGED_CHANNEL))
    return publicSettings()
  })

  ipcMain.handle(KEY_SET_CHANNEL, async (_event, key: string) => {
    const result = await validateApiKey(key)
    console.log('key:set →', JSON.stringify(result)) // nunca loga a chave
    if (result.ok) {
      storeApiKey(key)
      broadcastKeyChanged()
    }
    return result
  })

  ipcMain.handle(KEY_STATUS_CHANNEL, () => loadApiKey() !== null)

  ipcMain.handle(KEY_CLEAR_CHANNEL, () => {
    clearApiKey()
    broadcastKeyChanged()
  })

  ipcMain.handle(KEY_MASKED_CHANNEL, () => maskedApiKey())

  ipcMain.handle(
    PROCESS_AUDIO_CHANNEL,
    async (event, audio: ArrayBuffer): Promise<ProcessResult> => {
      const result = await processAudio(Buffer.from(audio), (raw) =>
        event.sender.send(PROCESS_RAW_CHANNEL, raw)
      )
      if (!result.ok) {
        console.log('pipeline: erro', result.error)
        return result
      }
      const pasted = result.text ? await pasteText(result.text) : false
      console.log(
        'pipeline:',
        `bruto="${result.raw.slice(0, 60)}" final="${result.text.slice(0, 60)}" formatted=${result.formatted} pasted=${pasted}`
      )
      return { ...result, pasted }
    }
  )

  // Hover na pílula desliga o ignore para receber cliques; fora dela, tudo atravessa
  ipcMain.on(SET_IGNORE_MOUSE_CHANNEL, (event, ignore: boolean) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.setIgnoreMouseEvents(ignore, { forward: true })
  })
}
