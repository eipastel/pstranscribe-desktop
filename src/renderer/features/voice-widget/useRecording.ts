import { useEffect } from 'react'
import { useWidgetStore } from '@/state/widget'
import { startRecording, stopRecording } from './recorder'

// Liga o PTT global ao produto: press grava; release roda o pipeline real
// (STT → formatação → colar no main) e dirige os estados do widget.
export function useRecording(): void {
  useEffect(() => {
    const offRaw = window.api.onRawText((raw) => useWidgetStore.getState().setRawText(raw))

    const offPress = window.api.onPttPress(() => {
      if (useWidgetStore.getState().hasKey !== true) return // sem chave válida, não grava
      useWidgetStore.getState().press()
      void startRecording()
        .then((stream) => useWidgetStore.getState().setMicStream(stream))
        .catch((err) => {
          console.error('mic:', err)
          useWidgetStore.getState().fail('network')
        })
    })

    const offRelease = window.api.onPttRelease(() => {
      const store = useWidgetStore.getState()
      store.release()
      store.setMicStream(null)
      void stopRecording().then(async (blob) => {
        if (!blob || useWidgetStore.getState().status !== 'transcribing') return
        const result = await window.api.processAudio(await blob.arrayBuffer())
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
        s.finish()
      })
    })

    return () => {
      offRaw()
      offPress()
      offRelease()
    }
  }, [])
}
