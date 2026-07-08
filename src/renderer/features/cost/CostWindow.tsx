import './CostWindow.css'
import { useEffect, useState } from 'react'
import type { HistoryPayload } from '@shared/ipc'

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4
})

const dt = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
})

// Tela de Custo (bandeja → "Custo"): métricas agregadas + histórico.
export default function CostWindow(): React.JSX.Element {
  const [data, setData] = useState<HistoryPayload | null>(null)

  useEffect(() => {
    void window.api.getHistory().then(setData)
  }, [])

  const stats = data?.stats
  const records = data?.records ?? []

  return (
    <div className="cost-panel">
      <div className="cost-head">
        <div>
          <div className="cost-title">Custo</div>
          <div className="cost-sub">Métricas do seu uso — {stats?.count ?? 0} transcrições</div>
        </div>
      </div>
      <div className="cost-body">
        <div className="cost-cards">
          <div className="cost-card">
            <div className="cost-card-value">{usd.format(stats?.totalUsd ?? 0)}</div>
            <div className="cost-card-label">Custo total</div>
          </div>
          <div className="cost-card">
            <div className="cost-card-value">{usd.format(stats?.avgPerTranscriptionUsd ?? 0)}</div>
            <div className="cost-card-label">Média / transcrição</div>
          </div>
          <div className="cost-card">
            <div className="cost-card-value">{usd.format(stats?.avgPerMinuteUsd ?? 0)}</div>
            <div className="cost-card-label">Média / minuto</div>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="cost-empty">Nenhuma transcrição ainda</div>
        ) : (
          <ul className="cost-list">
            {records.map((r) => (
              <li className="cost-item" key={r.ts}>
                <div className="cost-item-main">
                  <span className="cost-item-date">{dt.format(r.ts)}</span>
                  <span className="cost-item-meta">
                    {r.seconds}s · {r.sttModel}
                  </span>
                </div>
                <span className="cost-item-value">{usd.format(r.costUsd)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
