import { create } from 'zustand'

export type WidgetStatus = 'idle' | 'listening' | 'transcribing' | 'done'

// ponytail: timeout mock do design (2.1s); a batch de transcrição real substitui
const REFINE_MOCK_MS = 2100

interface WidgetState {
  status: WidgetStatus
  elapsed: number
  audioBlob: Blob | null
  micStream: MediaStream | null
  setAudioBlob: (blob: Blob | null) => void
  setMicStream: (stream: MediaStream | null) => void
  press: () => void
  release: () => void
}

let tickInterval: ReturnType<typeof setInterval> | undefined
let doneTimeout: ReturnType<typeof setTimeout> | undefined

export const useWidgetStore = create<WidgetState>((set, get) => ({
  status: 'idle',
  elapsed: 0,
  audioBlob: null,
  micStream: null,
  setAudioBlob: (blob) => set({ audioBlob: blob }),
  setMicStream: (stream) => set({ micStream: stream }),
  // Hold-to-talk: press começa a ouvir; release dispara o refino (mock até a batch 4)
  press: () => {
    const { status } = get()
    if (status !== 'idle' && status !== 'done') return
    clearTimeout(doneTimeout)
    set({ status: 'listening', elapsed: 0 })
    tickInterval = setInterval(() => set((s) => ({ elapsed: s.elapsed + 1 })), 1000)
  },
  release: () => {
    if (get().status !== 'listening') return
    clearInterval(tickInterval)
    set({ status: 'transcribing' })
    doneTimeout = setTimeout(() => set({ status: 'done' }), REFINE_MOCK_MS)
  }
}))
