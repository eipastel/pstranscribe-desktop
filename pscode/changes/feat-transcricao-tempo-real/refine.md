# Transcrição em tempo real na transcrição rápida

## Summary
Quando "transcrição rápida" (`respostaRapida`) está ligada, o texto é
transcrito e colado no cursor palavra a palavra enquanto a pessoa fala, em vez
de esperar o fim da fala. Com a config desligada, tudo continua como hoje.

## Technical detail
- Hoje é batch: `recorder.ts` acumula webm/opus → `stopRecording` → um
  `processAudio` (STT + colagem única). O modo tempo real substitui esse
  caminho **apenas** quando `respostaRapida` é `true`.
- **Streaming via Realtime API**: WebSocket da OpenAI para sessão de
  transcrição (`gpt-4o-mini-transcribe`, `language: pt`, `pcm16`). O main
  process abre a conexão com a própria API key (backend, sem token efêmero) e
  recebe eventos `...input_audio_transcription.delta`.
- **Captura**: renderer precisa enviar **PCM16** em streaming (Web Audio /
  AudioWorklet), não o blob webm atual — chunks vão ao main via IPC enquanto o
  PTT está pressionado.
- **Colagem por delta**: cada delta é colado no cursor. `paste.ts` hoje faz
  clipboard → Ctrl+V → restaura (300ms) por chamada; deltas rápidos exigem uma
  **fila serializada** para não corromper a ordem/clipboard.
- **Sem formatação** no tempo real (já é o caso hoje via `FORMAT_LOCKED`).
- **Erro no meio**: mantém o que já foi colado; a pílula sinaliza o erro.
- Custo/histórico: o Realtime cobra por tokens de áudio, diferente do
  `computeCost` atual (segundos) — ver Scope/Out.

## Scope
### In
- Cliente WebSocket de transcrição em tempo real no main.
- Captura de áudio PCM16 em streaming no renderer.
- Colagem incremental (delta a delta) no cursor.
- Ramificação do fluxo do PTT por `respostaRapida`.
- Tratamento de erro no meio (mantém colado + avisa).

### Out
- Comportamento com `respostaRapida` desligada (permanece batch).
- Formatação com IA no modo tempo real (fica para depois).
- Contabilização de custo precisa do Realtime (aproxima pelo caminho atual por
  ora; refinar depois).

## Subtasks
- [x] Cliente Realtime no main: abre sessão de transcrição (WS, `gpt-4o-mini-transcribe`, pt, pcm16), emite deltas e fecha a sessão.
- [x] Captura PCM16 em streaming no renderer (Web Audio) enviando chunks ao main enquanto o PTT está pressionado.
- [x] Canais IPC do ciclo realtime: iniciar sessão, enviar áudio, encerrar, e evento de delta.
- [x] Fila de colagem incremental: cola cada delta no cursor sem corromper ordem nem clipboard.
- [x] Ramificar o PTT por `respostaRapida`: ligado → streaming ao vivo; desligado → caminho batch atual intacto.
- [ ] Erro no meio + estados do widget: mantém texto colado, pílula avisa; encerra a sessão com segurança.
