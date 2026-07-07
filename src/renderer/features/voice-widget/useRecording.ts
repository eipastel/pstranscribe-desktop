import { useEffect } from 'react'
import { useWidgetStore } from '@/state/widget'
import { startRecording, stopRecording } from './recorder'

// Liga os eventos globais de PTT à gravação: press grava, release entrega o blob no store.
export function useRecording(): void {
  useEffect(() => {
    const offPress = window.api.onPttPress(() => {
      void startRecording()
        .then((stream) => useWidgetStore.getState().setMicStream(stream))
        .catch((err) => console.error('mic:', err))
    })
    const offRelease = window.api.onPttRelease(() => {
      useWidgetStore.getState().setMicStream(null)
      void stopRecording().then((blob) => {
        if (!blob) return
        useWidgetStore.getState().setAudioBlob(blob)
        console.log(`audio blob pronto: ${blob.size} bytes (${blob.type})`)
      })
    })
    return () => {
      offPress()
      offRelease()
    }
  }, [])
}
