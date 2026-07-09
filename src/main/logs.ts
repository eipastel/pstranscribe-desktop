import { app, BrowserWindow } from 'electron'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { LOG_CAP, type LogEntry } from '../shared/logs'
import { LOGS_CHANGED_CHANNEL } from '../shared/ipc'

// Buffer de logs do modo debug em JSON no userData, espelhando history.ts.
// Só é alimentado quando a captura está ligada (ver capture.ts).
const logsPath = (): string => join(app.getPath('userData'), 'logs.json')

let buffer: LogEntry[] | null = null
let flushTimer: NodeJS.Timeout | null = null

function ensureLoaded(): LogEntry[] {
  if (buffer) return buffer
  const file = logsPath()
  if (!existsSync(file)) return (buffer = [])
  try {
    const data = JSON.parse(readFileSync(file, 'utf8'))
    buffer = Array.isArray(data) ? (data as LogEntry[]).slice(-LOG_CAP) : []
  } catch {
    buffer = []
  }
  return buffer
}

// ponytail: throttle de 1s agrupa rajadas num só write; perder um flush no
// crash custa no máximo 1s de log. Subir/baixar se o volume mudar.
function scheduleFlush(): void {
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    try {
      writeFileSync(logsPath(), JSON.stringify(buffer ?? []))
    } catch {
      // disco cheio/permissão: um log perdido nunca pode derrubar o app
    }
    notifyChanged() // mesma cadência do flush: no máx. 1 refresh/s na aba Logs
  }, 1000)
}

function notifyChanged(): void {
  BrowserWindow.getAllWindows().forEach((w) => w.webContents.send(LOGS_CHANGED_CHANNEL))
}

export function appendLog(level: LogEntry['level'], text: string): void {
  const buf = ensureLoaded()
  buf.push({ time: Date.now(), level, text })
  if (buf.length > LOG_CAP) buffer = buf.slice(-LOG_CAP)
  scheduleFlush()
}

export function readLogs(): LogEntry[] {
  return ensureLoaded()
}

export function clearLogs(): void {
  buffer = []
  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }
  try {
    writeFileSync(logsPath(), '[]')
  } catch {
    // ignore
  }
  notifyChanged()
}
