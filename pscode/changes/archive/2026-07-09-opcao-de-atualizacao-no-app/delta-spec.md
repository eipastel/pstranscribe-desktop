# Opção de atualização no app — Delta

## Added
- Aba "Atualização" na janela do app (sidebar), mostrando versão atual e
  disponível, com botão contextual (Verificar → Baixar → Reiniciar) e feedback
  de estado: verificando / atualizado / disponível / baixando (%) / pronto /
  erro.
- Canais IPC `update:get/check/download/install/status` (`shared/ipc.ts`),
  módulo `src/main/updater.ts` e métodos no `WidgetApi`/preload.

## Changed
- Startup deixa de baixar updates sozinho: `autoDownload = false` e
  `checkForUpdatesAndNotify()` → `checkForUpdates()` (só checa e avisa; o
  download passa a ser disparado pelo usuário na aba).
