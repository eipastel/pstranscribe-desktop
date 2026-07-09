import './LogsWindow.css'
import { useEffect, useState } from 'react'
import Button from '@/components/Button/Button'
import type { LogEntry } from '@shared/logs'

const time = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})

// Aba Logs (modo debug): espelha o buffer capturado no main, com copiar/limpar.
export default function LogsWindow(): React.JSX.Element {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    const load = (): void => void window.api.getLogs().then(setLogs)
    load()
    return window.api.onLogsChanged(load) // main avisa a cada acúmulo/limpeza
  }, [])

  const copyAll = (): void => {
    const text = logs.map((l) => `[${time.format(l.time)}] ${l.level}: ${l.text}`).join('\n')
    void navigator.clipboard.writeText(text)
  }

  const clear = (): void => {
    void window.api.clearLogs()
    setLogs([])
  }

  return (
    <div className="logs-panel">
      <div className="logs-head">
        <div>
          <div className="logs-title">Logs</div>
          <div className="logs-sub">Modo debug — {logs.length} linhas</div>
        </div>
        <div className="logs-actions">
          <Button onClick={copyAll} disabled={logs.length === 0}>
            Copiar tudo
          </Button>
          <Button onClick={clear} disabled={logs.length === 0}>
            Limpar
          </Button>
        </div>
      </div>
      <div className="logs-body scroll-y">
        {logs.length === 0 ? (
          <div className="logs-empty">Nenhum log capturado ainda</div>
        ) : (
          <ul className="logs-list">
            {logs.map((l, i) => (
              <li className={`logs-item logs-${l.level}`} key={i}>
                <span className="logs-item-time">{time.format(l.time)}</span>
                <span className="logs-item-text">{l.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
