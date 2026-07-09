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

## Polimentos (mesma entrega, via PR #154)
- **Added:** animação de "buscando" no botão de verificar (piso ~1s), suave
  mesmo em resposta instantânea; ícone da barra de tarefas igual ao da bandeja
  (`icon` na janela do app); trava de instância única
  (`requestSingleInstanceLock`) — 2ª cópia foca a janela existente.
- **Changed:** janela do app deixa de ser `alwaysOnTop` (respeita o z-order);
  removida a sombra externa do `app-shell` (mantido só o brilho interno do topo).
- **Removed/Fix:** `forward` do `setIgnoreMouseEvents` do widget — era inerte no
  Windows e fazia o widget (fullscreen alwaysOnTop) brigar pelo cursor sobre a
  janela do app, "piscando" pointer↔seta nos botões.
