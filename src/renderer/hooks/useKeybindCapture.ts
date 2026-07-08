import { useEffect } from 'react'
import type { Keybind } from '@shared/settings'

// Converte a tecla do KeyboardEvent para o nome que o uiohook entende
export function captureKey(e: KeyboardEvent): string | null {
  if (/^[a-z]$/i.test(e.key)) return e.key.toUpperCase()
  if (/^[0-9]$/.test(e.key)) return e.key
  if (/^F([1-9]|1[0-9]|2[0-4])$/.test(e.key)) return e.key
  if (e.key === ' ') return 'Space'
  return null // modificador sozinho ou tecla sem mapeamento
}

// Enquanto ativo, captura a próxima combinação de teclas; Esc cancela.
export function useKeybindCapture(
  active: boolean,
  onCapture: (keybind: Keybind) => void,
  onCancel: () => void
): void {
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent): void => {
      e.preventDefault()
      e.stopPropagation()
      if (e.key === 'Escape') {
        onCancel()
        return
      }
      const key = captureKey(e)
      if (!key) return // segue esperando uma tecla principal
      onCapture({ ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey, key })
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [active, onCapture, onCancel])
}
