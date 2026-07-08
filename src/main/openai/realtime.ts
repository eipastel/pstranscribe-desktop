import { loadApiKey, mapError } from './key'
import type { ProcessError } from '../../shared/ipc'

const REALTIME_URL = 'wss://api.openai.com/v1/realtime?intent=transcription'
const STT_FAST_MODEL = 'gpt-4o-mini-transcribe'

export interface RealtimeSession {
  /** Empurra um bloco de PCM16 mono 24kHz para a transcrição. */
  sendAudio(pcm16: Buffer): void
  /** Fecha a conexão; resolve quando o socket termina de fechar. */
  close(): Promise<void>
}

export interface RealtimeCallbacks {
  /** Trecho reconhecido (palavra a palavra) para colar no cursor. */
  onDelta: (text: string) => void
  /** Erro no meio da sessão (a conexão já estava aberta). */
  onError: (error: ProcessError) => void
}

// Abre uma sessão de transcrição em tempo real via WebSocket. O áudio entra por
// sendAudio e os trechos voltam em onDelta conforme a fala avança. Resolve com a
// sessão quando a conexão abre, ou com um erro se falhar antes disso.
export function openRealtimeTranscription(
  cb: RealtimeCallbacks
): Promise<RealtimeSession | { ok: false; error: ProcessError }> {
  const key = loadApiKey()
  if (!key) return Promise.resolve({ ok: false, error: 'invalid' })

  return new Promise((resolve) => {
    // Auth por header (API GA — sem OpenAI-Beta, que a OpenAI desativou). Em runtime
    // o main usa o WebSocket do undici, que aceita headers; o tipo global aqui é o
    // do DOM (só protocols), daí o cast.
    const ws = new WebSocket(REALTIME_URL, {
      headers: { Authorization: `Bearer ${key}` }
    } as unknown as string[])
    let open = false

    ws.addEventListener('open', () => {
      open = true
      // Formato GA da sessão de transcrição; server_vad segmenta pelas pausas.
      ws.send(
        JSON.stringify({
          type: 'session.update',
          session: {
            type: 'transcription',
            audio: {
              input: {
                format: { type: 'audio/pcm', rate: 24000 },
                transcription: { model: STT_FAST_MODEL, language: 'pt' },
                turn_detection: { type: 'server_vad' }
              }
            }
          }
        })
      )
      resolve({
        sendAudio: (pcm16) => {
          if (ws.readyState === WebSocket.OPEN)
            ws.send(
              JSON.stringify({ type: 'input_audio_buffer.append', audio: pcm16.toString('base64') })
            )
        },
        close: () =>
          new Promise((done) => {
            if (ws.readyState === WebSocket.CLOSED) return done()
            ws.addEventListener('close', () => done(), { once: true })
            ws.close()
          })
      })
    })

    ws.addEventListener('message', (ev) => {
      let msg: { type?: string; delta?: string; error?: { code?: string } }
      try {
        msg = JSON.parse(typeof ev.data === 'string' ? ev.data : '{}')
      } catch {
        return
      }
      if (msg.type === 'conversation.item.input_audio_transcription.delta' && msg.delta)
        cb.onDelta(msg.delta)
      else if (msg.type === 'error') {
        console.log('realtime: erro do servidor →', typeof ev.data === 'string' ? ev.data : '')
        cb.onError(mapError(0, msg.error?.code))
      }
    })

    // Antes de abrir: falha de conexão/handshake. Depois: cai como erro da sessão.
    ws.addEventListener('error', () => {
      if (open) cb.onError('network')
      else resolve({ ok: false, error: 'network' })
    })
    // close antes do open = handshake recusado: loga o código para diagnóstico.
    ws.addEventListener('close', (ev) => {
      if (open) return
      console.log(`realtime: fechou antes de abrir code=${ev.code} reason=${ev.reason || '—'}`)
      resolve({ ok: false, error: 'network' })
    })
  })
}
