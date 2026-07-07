# push-to-talk global + captura de áudio

## Objective
Segurar a tecla grava de verdade e mexe no estado do widget: hold → "ouvindo" com onda ao vivo; soltar → blob de áudio pronto.

## Expected behavior
- uiohook-napi captura keydown E keyup globais (globalShortcut do Electron não dá keyup, essencial para hold-to-talk).
- Hold-to-record: começa a gravar no keydown, para no keyup.
- Áudio via `getUserMedia` + `MediaRecorder`, acumulando num blob.
- Waveform dirigida pelo mic real (AnalyserNode) em vez de mock.
- Máquina de estados ligada de verdade: segurar → ouvindo; soltar → (a próxima batch processa).
- electron-rebuild para os módulos nativos baterem com o Node do Electron.
- Hold que não conflite com o app de baixo (modificador raro/combinação), fácil de trocar depois.

## Out of scope
- Transcrição.
- Formatação.
- Colar no cursor.
