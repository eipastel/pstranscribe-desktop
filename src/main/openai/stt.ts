import { loadApiKey, mapError } from './key'
import type { TranscribeResult } from '../../shared/ipc'

const STT_MODEL = 'gpt-4o-transcribe'
const STT_FAST_MODEL = 'gpt-4o-mini-transcribe'
const STT_FALLBACK_MODEL = 'whisper-1'

// Blob webm/opus → transcrição bruta em pt. Erros voltam mapeados para a UI.
// fast = modo resposta rápida: usa o modelo menor/mais barato.
export async function transcribeAudio(audio: Buffer, fast = false): Promise<TranscribeResult> {
  const key = loadApiKey()
  if (!key) return { ok: false, error: 'invalid' }

  const first = await callTranscription(key, audio, fast ? STT_FAST_MODEL : STT_MODEL)
  // Modo rápido não degrada: se o modelo rápido faltar, erra em vez de cair no padrão.
  if (fast || first.ok || first.error !== 'model_unavailable') return normalize(first)
  console.log(`stt: ${STT_MODEL} indisponível, tentando ${STT_FALLBACK_MODEL}`)
  return normalize(await callTranscription(key, audio, STT_FALLBACK_MODEL))
}

type RawResult = TranscribeResult | { ok: false; error: 'model_unavailable' }

function normalize(result: RawResult): TranscribeResult {
  if (result.ok) return result
  if (result.error === 'model_unavailable') return { ok: false, error: 'network' }
  return result
}

async function callTranscription(key: string, audio: Buffer, model: string): Promise<RawResult> {
  const form = new FormData()
  form.append('file', new File([new Uint8Array(audio)], 'audio.webm', { type: 'audio/webm' }))
  form.append('model', model)
  form.append('language', 'pt')

  try {
    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: form
    })
    if (res.ok) {
      const data = (await res.json()) as { text?: string }
      return { ok: true, text: data.text ?? '', model }
    }
    let code: string | undefined
    try {
      const body = (await res.json()) as { error?: { code?: string } }
      code = body.error?.code
    } catch {
      // corpo não-JSON: decide só pelo status
    }
    if (code === 'model_not_found' || res.status === 404)
      return { ok: false, error: 'model_unavailable' }
    return { ok: false, error: mapError(res.status, code) }
  } catch {
    return { ok: false, error: 'network' }
  }
}
