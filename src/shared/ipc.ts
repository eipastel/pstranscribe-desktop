import type { Settings } from './settings'

export const PING_CHANNEL = 'ping'
export const SET_IGNORE_MOUSE_CHANNEL = 'set-ignore-mouse-events'
export const GET_SETTINGS_CHANNEL = 'settings:get'

export interface WidgetApi {
  ping(): Promise<string>
  setIgnoreMouseEvents(ignore: boolean): void
  getSettings(): Promise<Settings>
}
