# Abrir janela no startup e fechar para a bandeja

## Summary
Ao abrir o app, a janela principal aparece sozinha. Ao clicar no X (ou apertar
Escape), a janela some e o app segue rodando na bandeja — sair de verdade só
pelo "Sair" do menu da bandeja.

## Technical detail
- `src/main/index.ts` (`bootstrap`): após criar o widget, chamar
  `openAppWindow()` para a janela principal já subir visível no startup.
- `src/main/windows/app.ts`: interceptar o evento `close` da `appWindow` com
  `event.preventDefault()` + `appWindow.hide()`, para o X/Escape esconderem em
  vez de destruir. Como o renderer dispara `window.close()` no botão X e no
  Escape (`AppShell.tsx`), um único handler cobre os dois.
- Flag de saída real: `app.on('before-quit', () => { isQuitting = true })`; o
  handler de `close` só deixa fechar quando `isQuitting` é `true`. O "Sair" da
  bandeja já chama `app.quit()` (`tray.ts`), que dispara `before-quit`.
- Reabrir pela bandeja continua funcionando: `openAppWindow()` faz `show()` +
  `focus()` numa janela existente (agora escondida, não destruída).
- Fora do handler: a janela de Conceitos (`window.close()` própria) segue
  fechando como hoje.

## Scope
### In
- Abrir a janela principal no startup.
- X/Escape escondem a janela principal em vez de encerrar o processo.
- Saída real só pelo "Sair" da bandeja.

### Out
- Redesenhar bandeja / menu.
- Mudar o widget flutuante.
- Opção configurável para ligar/desligar o comportamento.
- Alterar a janela de Conceitos.

## Subtasks
- [x] Abrir `openAppWindow()` no startup (`bootstrap` em `index.ts`).
- [ ] Interceptar `close` da `appWindow` para esconder (preventDefault + hide),
      com flag `isQuitting` liberada por `before-quit`.
