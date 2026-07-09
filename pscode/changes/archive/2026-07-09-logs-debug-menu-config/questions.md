# Perguntas — refino

- [x] **Persistência dos logs?** Memória + arquivo: ring buffer em memória
  (cap ~1000 linhas) espelhado em `logs.json` no userData, truncado no mesmo cap.
- [x] **O que capturar?** `console.*` do main, `console.*` do renderer e
  crashes/erros não-tratados (uncaughtException, unhandledRejection,
  render-process-gone).
- [x] **UI do menu?** Nova aba "Logs" no AppShell, condicionada ao toggle ligado.
- [x] **Ações no menu?** Copiar tudo e Limpar (+ visualização da lista).
