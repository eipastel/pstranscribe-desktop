// Um registro por transcrição bem-sucedida. Sem o texto transcrito (privacidade).
export interface TranscriptionRecord {
  /** epoch ms */
  ts: number
  /** duração gravada (segundos do push-to-talk) */
  seconds: number
  sttModel: string
  formatTokens: number
  costUsd: number
}

export interface HistoryStats {
  count: number
  totalUsd: number
  avgPerTranscriptionUsd: number
  avgPerMinuteUsd: number
}

// Agregados de custo do histórico. Divisão por zero (sem registros / sem áudio)
// vira 0 em vez de NaN — a tela mostra zero limpo.
export function computeStats(records: TranscriptionRecord[]): HistoryStats {
  const count = records.length
  const totalUsd = records.reduce((s, r) => s + r.costUsd, 0)
  const totalSeconds = records.reduce((s, r) => s + r.seconds, 0)
  return {
    count,
    totalUsd,
    avgPerTranscriptionUsd: count ? totalUsd / count : 0,
    avgPerMinuteUsd: totalSeconds ? totalUsd / (totalSeconds / 60) : 0
  }
}
