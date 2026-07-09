# Opção de atualização no app

## Summary
Uma aba "Atualização" na janela do app mostra a versão atual, verifica se há
versão nova nos GitHub Releases e deixa o usuário baixar e reiniciar para
aplicar — com feedback de cada estado.

## Technical detail
- Base já existe (#7): `electron-updater` instalado, `publish: github`,
  `latest.yml` no Release, e `autoUpdater.checkForUpdatesAndNotify()` rodando no
  startup (`src/main/index.ts:25`).
- **Main**: `autoUpdater.autoDownload = false`; no startup trocar
  `checkForUpdatesAndNotify()` por `checkForUpdates()` (só avisa, não baixa).
  Novos handlers IPC: verificar, baixar, instalar (`quitAndInstall`). Encaminhar
  ao renderer os eventos do updater (`checking-for-update`, `update-available`,
  `update-not-available`, `download-progress`, `update-downloaded`, `error`) e
  expor a versão atual via `app.getVersion()`. Quando não empacotado, `check`
  é no-op — a UI mostra a versão e estado "atualizado".
- **Ponte IPC**: canais + tipo de status/evento em `src/shared/ipc.ts`, métodos
  no `WidgetApi` e exposição no `preload/index.ts`, seguindo o padrão dos canais
  existentes.
- **UI**: 4ª aba "Atualização" no `AppShell` + feature nova (à la
  `CostWindow`) com versão atual/disponível, um botão contextual
  (Verificar → Baixar → Reiniciar) e o texto de estado (verificando /
  atualizado / nova versão disponível / baixando / pronto para reiniciar).

## Scope
### In
- Fluxo manual de update (checar / baixar / reiniciar) com feedback de estado.
- Startup passa a só checar e avisar (`autoDownload = false`).
- Aba "Atualização" na sidebar do app.
### Out
- Pipeline de release (#7) e assinatura de código.
- Auto-update silencioso baixando em background.
- Atualização para macOS.

## Subtasks
- [x] Backend do updater no main: `autoDownload=false`, startup só checa/avisa,
      handlers IPC (verificar/baixar/instalar), encaminhar eventos e versão atual.
- [x] Ponte IPC: canais + tipos em `shared/ipc.ts` e métodos no `preload`/`WidgetApi`.
- [x] UI: aba "Atualização" no `AppShell` + feature com versões, botão contextual
      e feedback de estado.
