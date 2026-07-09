# 0001 — Electron como shell desktop

**Status:** aceito

## Contexto

O app é um overlay desktop que grava microfone, escuta um atalho global e cola
texto em qualquer aplicativo. Precisa de acesso a APIs de SO (teclado global,
clipboard, tray) e a APIs de navegador (`getUserMedia`, `MediaRecorder`) para
gravar. A UI é React.

## Decisão

Usar **Electron** (com electron-vite), não Tauri.

## Consequências

- **A favor:** `getUserMedia`/`MediaRecorder` prontos no renderer (Chromium);
  ecossistema npm de módulos nativos (`uiohook-napi`); `safeStorage`,
  `clipboard` e `Tray` de fábrica; um só stack (TS) no main e no renderer.
- **Contra:** binário grande e uso de RAM maior que Tauri. Aceitável para uma
  ferramenta desktop — o custo não justifica reescrever a captura de áudio e a
  ponte de módulos nativos que o Tauri (Rust + webview do SO) exigiria.
