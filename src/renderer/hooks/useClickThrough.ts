import { useMemo } from 'react'

interface HoverHandlers {
  onMouseEnter: () => void
  onMouseLeave: () => void
}

// Com forward: true o mousemove chega mesmo com a janela click-through,
// então dá para detectar hover e pedir ao main para aceitar cliques.
export function useClickThrough(): HoverHandlers {
  return useMemo(
    () => ({
      onMouseEnter: () => window.api.setIgnoreMouseEvents(false),
      onMouseLeave: () => window.api.setIgnoreMouseEvents(true)
    }),
    []
  )
}
