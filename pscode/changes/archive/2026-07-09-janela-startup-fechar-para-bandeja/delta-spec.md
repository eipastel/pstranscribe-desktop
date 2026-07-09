# Abrir janela no startup e fechar para a bandeja — Delta

## Added
- No startup, `bootstrap()` chama `openAppWindow()` — a janela principal já sobe
  visível (antes só subiam bandeja + widget).
- Handler de `close` da `appWindow`: X e Escape (`window.close()` no renderer)
  escondem a janela pra bandeja em vez de destruí-la, preservando o estado.
- Flag `isQuitting` liberada por `app.on('before-quit')`, para o "Sair" da
  bandeja (`app.quit()`) encerrar o processo de verdade.

## Changed
- Fechar a janela principal deixa de encerrar/destruir e passa a apenas
  esconder; a saída real fica exclusiva do "Sair" do menu da bandeja.
