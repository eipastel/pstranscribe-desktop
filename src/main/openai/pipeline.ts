import { loadSettings } from '../settings'
import { transcribeAudio } from './stt'
import { formatText } from './format'
import type { ProcessError } from '../../shared/ipc'

export type PipelineResult =
  { ok: true; raw: string; text: string; formatted: boolean } | { ok: false; error: ProcessError }

// Fala → texto pronto: STT + formatação, respeitando as flags dos settings.
// onRaw dispara assim que a transcrição chega, para a UI mostrar o bruto durante o refino.
export async function processAudio(
  audio: Buffer,
  onRaw?: (raw: string) => void
): Promise<PipelineResult> {
  const { transcrever, formatar } = loadSettings()
  if (!transcrever) return { ok: false, error: 'disabled' }

  const stt = await transcribeAudio(audio)
  if (!stt.ok) return stt

  const raw = stt.text.trim()
  onRaw?.(raw)
  if (!formatar || !raw) return { ok: true, raw, text: raw, formatted: false }

  const formatted = await formatText(raw)
  return { ok: true, raw, text: formatted ?? raw, formatted: formatted !== null }
}
