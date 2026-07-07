import { useEffect, useState } from 'react'
import { WAVEFORM_BAR_COUNT } from '@/components/Waveform/Waveform'

// Níveis do mic (0..1 por barra) via AnalyserNode + rAF enquanto houver stream.
export function useMicLevels(stream: MediaStream | null): number[] | undefined {
  const [levels, setLevels] = useState<number[]>()

  useEffect(() => {
    if (!stream) return
    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = WAVEFORM_BAR_COUNT * 2
    source.connect(analyser)

    const data = new Uint8Array(analyser.frequencyBinCount)
    let raf = 0
    const loop = (): void => {
      analyser.getByteFrequencyData(data)
      setLevels(Array.from(data, (v) => v / 255))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      void audioContext.close()
    }
  }, [stream])

  return stream ? levels : undefined
}
