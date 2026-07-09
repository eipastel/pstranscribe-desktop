# Logs de debug com menu ativável nas configurações

## Summary

Adiciona um modo de debug: uma opção no fim das Configurações que, quando ligada,
libera uma aba "Logs" onde o usuário vê os logs do app — incluindo erros e
crashes. Desligada (padrão), o app não captura nem grava nada.

## Technical detail

- **Setting novo:** `debugLogs: boolean` (padrão `false`) em
  `shared/settings.ts` (`Settings` + `DEFAULT_SETTINGS`).
- **Buffer/persistência (main):** módulo `src/main/logs.ts` com ring buffer em
  memória (cap ~1000 linhas) espelhado em `userData/logs.json`, truncado no mesmo
  cap — espelha o padrão de `history.ts`/`settings.ts`. Escrita com throttle para
  não martelar o disco.
- **Captura (só quando `debugLogs` ligado):** monkey-patch de
  `console.log/warn/error` do main; ponte do renderer reusando o encaminhamento
  já existente em `windows/widget.ts` (`[renderer]`); e handlers de
  `process.uncaughtException`, `unhandledRejection` e `render-process-gone`. Com
  o toggle desligado nada é interceptado nem gravado (otimizado).
- **IPC:** canais `logs:get`, `logs:clear` e broadcast `logs:changed`
  (main → renderer), seguindo o padrão de `handlers.ts`/`preload`/`ipc.ts`.
- **UI:** aba "Logs" no `AppShell` (ao lado de Custos/Conceitos/Atualização),
  visível só com `debugLogs` ligado; lista as linhas + botões "Copiar tudo" e
  "Limpar". Toggle novo no fim de `SettingsWindow`.

## Scope

### In

- Toggle "Modo debug (logs)" no fim das Configurações.
- Captura de `console.*` (main + renderer) e crashes/erros não-tratados, só com
  o modo ligado.
- Buffer em memória + `logs.json` com cap/rotação.
- Aba "Logs" condicional com lista, "Copiar tudo" e "Limpar".

### Out

- Envio/telemetria remota dos logs.
- Dashboards externos.
- Formato final de exportação (arquivo/CSV/etc.).

## Subtasks

- [ ] Adicionar `debugLogs` (padrão `false`) em `shared/settings.ts`.
- [ ] Criar `src/main/logs.ts`: ring buffer + `logs.json` (cap/rotação, escrita com throttle) e API `append/read/clear`.
- [ ] Ligar captura ao toggle: patch de `console.*` do main, ponte do renderer e handlers de crash/erros não-tratados, ativos só com `debugLogs`.
- [ ] Expor IPC `logs:get`/`logs:clear` + broadcast `logs:changed` (ipc.ts, handlers.ts, preload).
- [ ] UI: toggle no fim de `SettingsWindow` e aba "Logs" condicional no `AppShell` com lista + "Copiar tudo" e "Limpar".
