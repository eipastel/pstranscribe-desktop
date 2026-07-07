# push-to-talk global + captura de áudio — Delta

## Added
- Push-to-talk global via uiohook-napi no main (`src/main/ptt.ts`): keydown/keyup do combo configurado, guarda de key-repeat, release por tecla principal ou modificador obrigatório; eventos `ptt:press`/`ptt:release` para o renderer.
- Settings persistidos (`src/main/settings.ts` + `src/shared/settings.ts`): JSON em `%APPDATA%/pstranscribe-desktop/settings.json`, keybind default **Ctrl+P**, materializado na primeira execução; leitura via IPC `settings:get`.
- Captura de áudio real (`recorder.ts` + `useRecording.ts`): getUserMedia + MediaRecorder (webm/opus); ao soltar, blob no store (`audioBlob`) e log de evidência.
- Waveform ao vivo (`useMicLevels.ts`): AnalyserNode + rAF alimentando as 64 barras (`levels` no Waveform); animação mock vira fallback.
- Console do renderer espelhado no terminal em dev; alias `@shared` → `src/shared`.

## Changed
- Máquina de estados: `tap()` (clique) → `press()`/`release()` (hold); press durante refino ignorado; done → novo hold reinicia.
- Keycap do idle: ⌥ Space fixo → atalho real do settings (Ctrl P); hints/textos com semântica de hold.

## Removed
- Avanço de estados por clique no Pill (PTT é a interação real; hover/click-through permanecem).
