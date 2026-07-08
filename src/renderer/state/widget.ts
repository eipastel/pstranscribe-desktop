import { create } from 'zustand'
import type { ProcessError } from '@shared/ipc'

export type WidgetStatus = 'idle' | 'listening' | 'transcribing' | 'done' | 'error'

export type WidgetError = ProcessError | 'paste_failed'

interface WidgetState {
  status: WidgetStatus
  elapsed: number
  micStream: MediaStream | null
  /** null = ainda não sabemos; false trava o PTT e mostra a porta da chave */
  hasKey: boolean | null
  /** transcrição bruta real, exibida com shimmer durante o refino */
  rawText: string | null
  errorCode: WidgetError | null
  setMicStream: (stream: MediaStream | null) => void
  setHasKey: (hasKey: boolean) => void
  setRawText: (raw: string) => void
  press: () => void
  release: () => void
  finish: () => void
  fail: (error: WidgetError) => void
  reset: () => void
}

let tickInterval: ReturnType<typeof setInterval> | undefined

export const useWidgetStore = create<WidgetState>((set, get) => ({
  status: 'idle',
  elapsed: 0,
  micStream: null,
  hasKey: null,
  rawText: null,
  errorCode: null,
  setMicStream: (stream) => set({ micStream: stream }),
  setHasKey: (hasKey) => set({ hasKey }),
  setRawText: (raw) => set({ rawText: raw }),
  // Hold-to-talk: press começa a ouvir; release dispara o pipeline real
  press: () => {
    const { status } = get()
    if (status !== 'idle' && status !== 'done' && status !== 'error') return
    set({ status: 'listening', elapsed: 0, rawText: null, errorCode: null })
    tickInterval = setInterval(() => set((s) => ({ elapsed: s.elapsed + 1 })), 1000)
  },
  release: () => {
    if (get().status !== 'listening') return
    clearInterval(tickInterval)
    set({ status: 'transcribing' })
  },
  finish: () => set({ status: 'done' }),
  fail: (error) => set({ status: 'error', errorCode: error }),
  reset: () => {
    clearInterval(tickInterval)
    set({ status: 'idle', elapsed: 0, rawText: null, errorCode: null })
  }
}))
