# Logs de debug com menu ativável — Delta

## Added

- Setting `debugLogs` (padrão `false`): liga o modo debug.
- Buffer de logs no main (`logs.ts`): ring buffer em memória + `logs.json` no
  userData, cap de 1000 linhas com rotação e escrita com throttle de 1s.
- Captura gated pelo toggle (`capture.ts`): `console.*` do main, console do
  renderer e crashes/erros não-tratados (`uncaughtException`,
  `unhandledRejection`, `render-process-gone`). Desligado = sem captura/arquivo.
- IPC `logs:get`/`logs:clear` + broadcast `logs:changed` (main → renderer).
- Aba "Logs" no AppShell, visível só com o modo ligado, com lista de logs e
  botões "Copiar tudo" e "Limpar".
- Toggle "Modo debug (logs)" no fim das Configurações.

## Changed

- `settings:update` agora chama `setCapture` quando `debugLogs` muda, ligando/
  desligando a captura ao vivo.
