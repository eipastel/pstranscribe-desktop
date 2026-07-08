import { useEffect } from 'react'
import { useWidgetStore } from '@/state/widget'
import { startRecording, stopRecording } from './recorder'

// Liga os eventos globais de PTT à gravação: press grava, release entrega o blob no store.
export function useRecording(): void {
  useEffect(() => {
    const offPress = window.api.onPttPress(() => {
      if (useWidgetStore.getState().hasKey !== true) return // sem chave válida, não grava
      useWidgetStore.getState().press()
      void startRecording()
        .then((stream) => useWidgetStore.getState().setMicStream(stream))
        .catch((err) => console.error('mic:', err))
    })
    const offRelease = window.api.onPttRelease(() => {
      useWidgetStore.getState().release()
      useWidgetStore.getState().setMicStream(null)
      void stopRecording().then(async (blob) => {
        if (!blob) return
        useWidgetStore.getState().setAudioBlob(blob)
        console.log(`audio blob pronto: ${blob.size} bytes (${blob.type})`)
        const result = await window.api.processAudio(await blob.arrayBuffer())
        console.log(
          result.ok
            ? `texto final: ${result.text} (formatted=${result.formatted})`
            : `pipeline erro: ${result.error}`
        )
      })
    })
    return () => {
      offPress()
      offRelease()
    }
  }, [])
}
