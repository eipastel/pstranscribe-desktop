import { loadSettings } from '../settings'
import { transcribeAudio } from './stt'
import { formatText } from './format'
import type { ProcessResult } from '../../shared/ipc'

// Fala → texto pronto: STT + formatação, respeitando as flags dos settings.
export async function processAudio(audio: Buffer): Promise<ProcessResult> {
  const { transcrever, formatar } = loadSettings()
  if (!transcrever) return { ok: false, error: 'disabled' }

  const stt = await transcribeAudio(audio)
  if (!stt.ok) return stt

  const raw = stt.text.trim()
  if (!formatar || !raw) return { ok: true, raw, text: raw, formatted: false }

  const formatted = await formatText(raw)
  return { ok: true, raw, text: formatted ?? raw, formatted: formatted !== null }
}
