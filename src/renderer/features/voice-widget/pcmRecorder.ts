// Captura de microfone em PCM16 mono 24kHz para transcrição em tempo real.
// Diferente de recorder.ts (acumula webm/opus num blob), este emite blocos crus
// conforme a fala avança, para irem direto ao WebSocket da Realtime API.
let ctx: AudioContext | null = null
let source: MediaStreamAudioSourceNode | null = null
let processor: ScriptProcessorNode | null = null
let stream: MediaStream | null = null

const SAMPLE_RATE = 24000 // formato pcm16 esperado pela Realtime API

// ponytail: ScriptProcessorNode é deprecado, mas dispensa empacotar um módulo de
// AudioWorklet à parte; migrar para worklet se a latência na thread principal doer.
export async function startPcmStream(onChunk: (pcm16: ArrayBuffer) => void): Promise<MediaStream> {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  ctx = new AudioContext({ sampleRate: SAMPLE_RATE })
  source = ctx.createMediaStreamSource(stream)
  processor = ctx.createScriptProcessor(4096, 1, 1)
  processor.onaudioprocess = (e) => onChunk(floatToPcm16(e.inputBuffer.getChannelData(0)))
  source.connect(processor)
  processor.connect(ctx.destination) // saída fica em silêncio; só serve para disparar o processo
  return stream
}

export async function stopPcmStream(): Promise<void> {
  processor?.disconnect()
  source?.disconnect()
  stream?.getTracks().forEach((t) => t.stop())
  await ctx?.close()
  ctx = source = null
  processor = null
  stream = null
}

// Float32 [-1,1] → Int16 little-endian (pcm16).
function floatToPcm16(input: Float32Array): ArrayBuffer {
  const out = new Int16Array(input.length)
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]))
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return out.buffer
}
