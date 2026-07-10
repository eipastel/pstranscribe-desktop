# onboarding intercepta cliques e trava o app

## Summary
O onboarding não recebe cliques: eles atravessam para o app atrás e o usuário
fica preso na tela de primeiro uso. O fix faz o overlay aceitar cliques enquanto
o onboarding (e o KeyGate) estão na tela, sem depender do hover que não funciona
no Windows.

## Technical detail
- A janela do widget é um overlay fullscreen transparente, criada como
  click-through: `window.setIgnoreMouseEvents(true)` (sem `forward`) em
  `src/main/windows/widget.ts:39`.
- O único mecanismo que a torna clicável é o hover (`useClickThrough` →
  `onMouseEnter` chama `setIgnoreMouseEvents(false)`). Sem `forward`, o
  `mousemove` nunca chega ao renderer, então `onMouseEnter` **nunca dispara** e a
  janela fica click-through para sempre. O `forward: true` do toggle já foi
  documentado como inerte no Windows (delta de #154).
- Correção (root cause, camada compartilhada): novo hook `useInteractiveWindow`
  que em mount chama `window.api.setIgnoreMouseEvents(false)` e em unmount
  restaura `true`. Onboarding e KeyGate — painéis que precisam de clique no todo
  — passam a usá-lo no lugar do `useClickThrough`.
- IPC/handler (`SET_IGNORE_MOUSE_CHANNEL`) e o preload já existem; nada novo no
  main. Ao restaurar `true`, verificar que não reintroduz o "piscar" do cursor
  removido em #154.

## Scope
### In
- Hook `useInteractiveWindow` (renderer).
- Onboarding e KeyGate passam a ficar interativos enquanto montados.
### Out
- Badge/pílula do VoiceWidget (mesmo padrão quebrado, mas outro fluxo).
- Redesign ou mudança de conteúdo do onboarding.

## Subtasks
- [x] Criar hook `useInteractiveWindow`: mount → `setIgnoreMouseEvents(false)`, unmount → `setIgnoreMouseEvents(true)`.
- [x] `Onboarding`: usar `useInteractiveWindow` e remover `useClickThrough`.
- [x] `KeyGate`: usar `useInteractiveWindow` e remover `useClickThrough`.
- [ ] Validar no app: onboarding clicável (chave → atalho → começar), KeyGate standalone clicável, e voltar ao VoiceWidget restaura o click-through sem piscar o cursor.
