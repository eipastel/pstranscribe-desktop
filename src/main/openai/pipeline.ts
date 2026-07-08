import { loadSettings } from '../settings'
import { FORMAT_LOCKED } from '../../shared/settings'
import { correctText } from '../glossary'
import { transcribeAudio } from './stt'
import { formatText } from './format'
import type { ProcessError } from '../../shared/ipc'

export type PipelineResult =
  | {
      ok: true
      raw: string
      text: string
      formatted: boolean
      sttModel: string
      formatModel?: string
      formatTokens: number
    }
  | { ok: false; error: ProcessError }

// Fala → texto pronto: STT + formatação, respeitando as flags dos settings.
// onRaw dispara assim que a transcrição chega, para a UI mostrar o bruto durante o refino.
export async function processAudio(
  audio: Buffer,
  onRaw?: (raw: string) => void
): Promise<PipelineResult> {
  const { transcrever, formatar, respostaRapida } = loadSettings()
  if (!transcrever) return { ok: false, error: 'disabled' }

  const stt = await transcribeAudio(audio, respostaRapida)
  if (!stt.ok) return stt

  // Autocorreção local (glossário) sobre o bruto, antes de formatar. Sem rede.
  const raw = correctText(stt.text.trim())
  onRaw?.(raw)
  if (!formatar || FORMAT_LOCKED || !raw)
    return { ok: true, raw, text: raw, formatted: false, sttModel: stt.model, formatTokens: 0 }

  const formatted = await formatText(raw)
  return {
    ok: true,
    raw,
    text: formatted?.text ?? raw,
    formatted: formatted !== null,
    sttModel: stt.model,
    formatModel: formatted?.model,
    formatTokens: formatted?.tokens ?? 0
  }
}
