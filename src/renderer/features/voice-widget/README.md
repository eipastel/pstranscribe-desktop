# voice-widget — o overlay de gravação

A tela principal (janela sem hash). Liga o push-to-talk global à captura de
microfone e mostra o status: ocioso, gravando (waveform + timer), processando,
resultado.

- **`VoiceWidget.tsx`** — a UI e a máquina de estados visual do widget.
- **`useRecording.ts`** — orquestra o ciclo: `onPttPress` começa a gravar,
  `onPttRelease` para e envia o áudio para `window.api.processAudio`.
- **`recorder.ts`** — captura via `getUserMedia` + `MediaRecorder` (webm/opus),
  acumulando num blob (fluxo batch, o que está no ar).
- **`pcmRecorder.ts`** — stream PCM para o modo ao vivo. **Desativado**
  (`REALTIME_ENABLED = false` em `useRecording.ts`): a digitação em tempo real
  ainda é instável em alguns alvos.
- **`useMicLevels.ts`** — níveis do microfone para animar o `Waveform`.
