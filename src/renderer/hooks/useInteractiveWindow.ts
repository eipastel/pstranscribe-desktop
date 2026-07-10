import { useEffect } from 'react'

// Painéis que precisam de clique no todo (onboarding, key-gate) não podem
// depender do hover-toggle: no Windows o forward do mousemove é inerte, então
// `onMouseEnter` nunca dispara e a janela click-through nunca aceita cliques.
// Enquanto um painel está montado, desligamos o click-through; ao desmontar o
// último, restauramos para o widget voltar a deixar os cliques atravessarem.
//
// Ref-count porque os painéis se aninham: o onboarding renderiza o KeyGate no
// passo 1. Sem contagem, o unmount do KeyGate (passo 1→2) restauraria o
// click-through com o onboarding ainda na tela.
let active = 0

export function useInteractiveWindow(): void {
  useEffect(() => {
    if (active++ === 0) window.api.setIgnoreMouseEvents(false)
    return () => {
      if (--active === 0) window.api.setIgnoreMouseEvents(true)
    }
  }, [])
}
