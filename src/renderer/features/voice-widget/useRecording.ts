import { useEffect, useRef } from 'react'
import { useWidgetStore } from '@/state/widget'
import { startRecording, stopRecording } from './recorder'
import { startPcmStream, stopPcmStream } from './pcmRecorder'

// Liga o PTT global ao produto. Com "transcrição rápida" (respostaRapida) ligada,
// grava e transcreve ao vivo, colando delta a delta no cursor; senão, mantém o
// fluxo batch (grava tudo → STT → cola de uma vez).
export function useRecording(): void {
  const fast = useRef(false)

  useEffect(() => {
    const loadFast = (): void => {
      void window.api.getSettings().then((s) => (fast.current = s.transcrever && s.respostaRapida))
    }
    loadFast()
    const offSettings = window.api.onSettingsChanged(loadFast)
    const offRaw = window.api.onRawText((raw) => useWidgetStore.getState().setRawText(raw))
    // Erro no meio da fala em tempo real: o já colado permanece, a pílula avisa.
    const offError = window.api.onRealtimeError((error) => useWidgetStore.getState().fail(error))

    const offPress = window.api.onPttPress(() => {
      const store = useWidgetStore.getState()
      if (store.hasKey !== true) return // sem chave válida, não grava
      store.press()

      if (fast.current) {
        // Tempo real: abre a sessão e só então começa a empurrar áudio PCM16.
        void window.api.startRealtime().then((res) => {
          if (!res.ok) {
            useWidgetStore.getState().fail(res.error)
            return
          }
          return startPcmStream((pcm16) => window.api.sendRealtimeAudio(pcm16))
            .then((stream) => useWidgetStore.getState().setMicStream(stream))
            .catch((err) => {
              console.error('mic:', err)
              useWidgetStore.getState().fail('network')
            })
        })
        return
      }

      void startRecording()
        .then((stream) => store.setMicStream(stream))
        .catch((err) => {
          console.error('mic:', err)
          store.fail('network')
        })
    })

    const offRelease = window.api.onPttRelease(() => {
      const store = useWidgetStore.getState()

      if (fast.current) {
        // Some a pílula na hora; o teardown (parar captura/sessão, esvaziar a
        // fila de colagem) roda em background sem segurar a animação.
        store.setMicStream(null)
        if (store.status === 'listening') store.reset() // preserva um erro do meio da fala
        void stopPcmStream().then(() => window.api.stopRealtime())
        return
      }

      store.release()
      store.setMicStream(null)
      void stopRecording().then(async (blob) => {
        if (!blob || useWidgetStore.getState().status !== 'transcribing') return
        const seconds = useWidgetStore.getState().elapsed
        const result = await window.api.processAudio(await blob.arrayBuffer(), seconds)
        const s = useWidgetStore.getState()
        if (!result.ok) {
          if (result.error === 'disabled') s.reset()
          else s.fail(result.error)
          return
        }
        if (!result.text) {
          s.reset() // silêncio: nada para colar
          return
        }
        if (!result.pasted) {
          s.fail('paste_failed') // o texto ficou no clipboard
          return
        }
        s.reset() // colado: a pílula some, sem estado "done"
      })
    })

    return () => {
      offSettings()
      offRaw()
      offError()
      offPress()
      offRelease()
    }
  }, [])
}
