import { app, type WebContents, type RenderProcessGoneDetails } from 'electron'
import { appendLog } from './logs'
import type { LogEntry } from '../shared/logs'

// Captura de logs do modo debug. Tudo é gated por `capturing`: desligado, nada
// vai pro buffer/arquivo — o custo é só o passthrough do console.
let capturing = false
let inited = false

const original = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console)
}

function fmt(args: unknown[]): string {
  return args
    .map((a) => {
      if (typeof a === 'string') return a
      try {
        return JSON.stringify(a)
      } catch {
        return String(a)
      }
    })
    .join(' ')
}

const RENDERER_LEVEL: Record<string, LogEntry['level']> = { warning: 'warn', error: 'error' }

function onWebContents(_e: unknown, wc: WebContents): void {
  // Observador passivo (gated): pega o console de cada janela do renderer.
  wc.on('console-message', (details) => {
    if (capturing)
      appendLog(RENDERER_LEVEL[details.level] ?? 'log', `[renderer] ${details.message}`)
  })
}

// Handlers de crash: só ficam registrados enquanto a captura está ligada, então
// com o toggle desligado o comportamento de erro do app é idêntico ao de antes.
function onUncaught(err: Error): void {
  appendLog('error', `uncaughtException: ${err.stack ?? err.message}`)
  original.error('uncaughtException:', err)
  // ponytail: replica o default do Node (sai com código 1); sem isso o handler
  // engoliria o crash e deixaria o app zumbi.
  process.exit(1)
}

function onRejection(reason: unknown): void {
  const text = reason instanceof Error ? (reason.stack ?? reason.message) : String(reason)
  appendLog('error', `unhandledRejection: ${text}`)
  original.error('unhandledRejection:', reason)
}

function onRenderGone(_e: unknown, _wc: WebContents, details: RenderProcessGoneDetails): void {
  appendLog('error', `render-process-gone: ${details.reason} (exit ${details.exitCode})`)
}

// Chamado uma vez no bootstrap, antes de criar janelas: patch do console e o
// observador de web-contents ficam sempre presentes (gated), sem peso semântico.
export function initCapture(): void {
  if (inited) return
  inited = true

  console.log = (...a: unknown[]) => {
    original.log(...a)
    if (capturing) appendLog('log', fmt(a))
  }
  console.warn = (...a: unknown[]) => {
    original.warn(...a)
    if (capturing) appendLog('warn', fmt(a))
  }
  console.error = (...a: unknown[]) => {
    original.error(...a)
    if (capturing) appendLog('error', fmt(a))
  }

  app.on('web-contents-created', onWebContents)
}

// Liga/desliga a captura. Só os handlers de crash entram/saem aqui — o resto já
// está instalado por initCapture e apenas checa o flag.
export function setCapture(enabled: boolean): void {
  if (enabled === capturing) return
  capturing = enabled
  if (enabled) {
    process.on('uncaughtException', onUncaught)
    process.on('unhandledRejection', onRejection)
    app.on('render-process-gone', onRenderGone)
  } else {
    process.off('uncaughtException', onUncaught)
    process.off('unhandledRejection', onRejection)
    app.off('render-process-gone', onRenderGone)
  }
}
