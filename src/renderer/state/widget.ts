import { create } from 'zustand'

export type WidgetStatus = 'idle' | 'recording' | 'transcribing'

interface WidgetState {
  status: WidgetStatus
  setStatus: (status: WidgetStatus) => void
}

export const useWidgetStore = create<WidgetState>((set) => ({
  status: 'idle',
  setStatus: (status) => set({ status })
}))
