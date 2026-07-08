import { app } from 'electron'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { TranscriptionRecord } from '../shared/history'

// Histórico local em JSON no userData, espelhando settings.ts.
// ponytail: array JSON crescente basta para este volume; migrar p/ sqlite só se
// o arquivo ficar grande.
const historyPath = (): string => join(app.getPath('userData'), 'history.json')

export function loadHistory(): TranscriptionRecord[] {
  const file = historyPath()
  if (!existsSync(file)) return []
  try {
    const data = JSON.parse(readFileSync(file, 'utf8'))
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function appendRecord(record: TranscriptionRecord): void {
  const all = loadHistory()
  all.push(record)
  writeFileSync(historyPath(), JSON.stringify(all, null, 2))
}
