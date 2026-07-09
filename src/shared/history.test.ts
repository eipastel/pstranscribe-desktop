import { describe, it, expect } from 'vitest'
import { computeStats, type TranscriptionRecord } from './history'

const rec = (seconds: number, costUsd: number): TranscriptionRecord => ({
  ts: 0,
  seconds,
  sttModel: 'gpt-4o-transcribe',
  formatTokens: 0,
  costUsd
})

describe('computeStats', () => {
  it('sem registros retorna zeros (nunca NaN)', () => {
    expect(computeStats([])).toEqual({
      count: 0,
      totalUsd: 0,
      avgPerTranscriptionUsd: 0,
      avgPerMinuteUsd: 0
    })
  })

  it('agrega custo por transcrição e por minuto', () => {
    // 2 registros: 30s + 90s = 120s = 2min; custo 0.10 + 0.30 = 0.40
    const stats = computeStats([rec(30, 0.1), rec(90, 0.3)])
    expect(stats.count).toBe(2)
    expect(stats.totalUsd).toBeCloseTo(0.4)
    expect(stats.avgPerTranscriptionUsd).toBeCloseTo(0.2)
    expect(stats.avgPerMinuteUsd).toBeCloseTo(0.2)
  })
})
