import { create } from 'zustand'

export type WidgetStatus = 'idle' | 'listening' | 'transcribing' | 'done'

// ponytail: timeout mock do design (2.1s); a batch de transcrição real substitui
const REFINE_MOCK_MS = 2100

interface WidgetState {
  status: WidgetStatus
  elapsed: number
  tap: () => void
}

let tickInterval: ReturnType<typeof setInterval> | undefined
let doneTimeout: ReturnType<typeof setTimeout> | undefined

export const useWidgetStore = create<WidgetState>((set, get) => ({
  status: 'idle',
  elapsed: 0,
  tap: () => {
    const { status } = get()
    if (status === 'idle') {
      set({ status: 'listening', elapsed: 0 })
      tickInterval = setInterval(() => set((s) => ({ elapsed: s.elapsed + 1 })), 1000)
    } else if (status === 'listening') {
      clearInterval(tickInterval)
      set({ status: 'transcribing' })
      doneTimeout = setTimeout(() => set({ status: 'done' }), REFINE_MOCK_MS)
    } else if (status === 'done') {
      clearTimeout(doneTimeout)
      set({ status: 'idle', elapsed: 0 })
    }
    // transcribing: clique não interrompe o refino (igual ao design)
  }
}))
