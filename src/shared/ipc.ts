export const PING_CHANNEL = 'ping'
export const SET_IGNORE_MOUSE_CHANNEL = 'set-ignore-mouse-events'

export interface WidgetApi {
  ping(): Promise<string>
  setIgnoreMouseEvents(ignore: boolean): void
}
