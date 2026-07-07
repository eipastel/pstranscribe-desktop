# push-to-talk global + captura de áudio

## Summary
Segurar Ctrl+P (configurável) grava áudio de verdade: widget entra em "ouvindo" com a onda dirigida pelo microfone; ao soltar, um blob de áudio fica pronto e o widget roda o mock refinando→colado.

## Technical detail
- uiohook-napi no main para keydown E keyup globais (globalShortcut não dá keyup); guarda contra key-repeat.
- Keybind default Ctrl+P persistido em JSON no `userData` (módulo de settings do main); batch 5 edita pela UI. Keycap do widget mostra a tecla real via IPC.
- Main → renderer: eventos `ptt:press` / `ptt:release` via `webContents.send`; preload expõe subscribe tipado.
- Renderer: `getUserMedia` + `MediaRecorder` (webm/opus), blob acumulado no store ao soltar + log de evidência.
- Waveform ao vivo: `AnalyserNode` + rAF alimentando as alturas das barras (prop `levels`); animação CSS vira fallback.
- Máquina: press → listening (grava); release → transcribing (mock 2.1s) → done → idle. Avanço por clique removido.
- Módulos nativos: uiohook-napi é N-API (prebuilds); `electron-builder install-app-deps` já roda no postinstall — @electron/rebuild só se necessário.

## Scope
### In
- Hook global de teclado, config persistida do keybind, captura/blob de áudio, waveform ao vivo, máquina ligada ao PTT, keycap real.
### Out
- Transcrição, formatação, colar no cursor, UI de settings (batch 5), troca de dispositivo de áudio.

## Subtasks
- [x] uiohook-napi instalado e carregando no main (com rebuild nativo se necessário)
- [x] Config persistida do keybind no userData (default Ctrl+P) + leitura exposta via IPC
- [x] Listener global: keydown/keyup do combo → eventos ptt:press/ptt:release no renderer
- [x] Captura de áudio: getUserMedia + MediaRecorder, blob no store ao soltar
- [x] Waveform ao vivo com AnalyserNode substituindo a animação mock
- [ ] Máquina ligada ao PTT (press→listening, release→mock) + keycap real + remover clique
