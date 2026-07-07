export const PING_CHANNEL = 'ping'

export interface WidgetApi {
  ping(): Promise<string>
}
