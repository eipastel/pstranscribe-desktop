# Métricas de custo e histórico de transcrições

## Summary
Cada transcrição passa a ser registrada num histórico local. A partir dele, uma
nova tela "Custo" (aberta pelo menu da bandeja) mostra o custo total, o custo
médio por transcrição e o custo médio por minuto de áudio.

## Technical detail
- **Preços (novo `src/main/openai/pricing.ts`)**: constantes em USD por modelo —
  STT por minuto (`gpt-4o-transcribe`, `whisper-1`) e formatação por token
  (`gpt-5.4-mini`). `computeCost({ sttModel, minutes, formatTokens })`.
- **Captura do que hoje é descartado**: `stt.ts` retorna o modelo efetivamente
  usado; `format.ts` retorna `usage.total_tokens`; `pipeline.ts` propaga ambos.
  A duração vem do `elapsed` do widget (`renderer/state/widget.ts`), enviada
  junto no `PROCESS_AUDIO_CHANNEL`.
- **Histórico (novo `src/main/history.ts`)**: append em `history.json` no
  `userData` (espelha `settings.ts`); registro = `{ ts, seconds, sttModel,
  formatTokens, costUsd }`. Sem texto transcrito. `loadHistory()` + agregados.
- **Assíncrono / fora do caminho crítico**: o resultado da transcrição é
  devolvido ao renderer **antes** de gravar. Cálculo de custo + append no
  histórico rodam depois, fire-and-forget (sem `await` na resposta), então não
  somam latência à transcrição.
- **IPC**: novo `GET_HISTORY_CHANNEL` (shared/ipc.ts + handlers.ts + preload)
  retornando registros + agregados (total, média/transcrição, média/minuto).
- **Janela**: `openCostWindow()` (espelha `windows/settings.ts`, hash `#custo`),
  item "Custo" no `tray.ts`, branch em `App.tsx`, view React com cards + lista.

## Scope
### In
- Registro persistente por transcrição e cálculo de custo (STT + formatação).
- Tela "Custo" na bandeja: 3 métricas agregadas + lista do histórico.
- Tabela de preços fixa em USD por modelo.
- **Requisito — zero impacto na latência**: coleta de métricas, cálculo de custo
  e escrita do histórico são assíncronos e fora do caminho crítico da
  transcrição; nunca atrasam a devolução do texto ao usuário.
### Out
- Limites/orçamento de gasto e alertas; exportação; billing real da OpenAI.
- Guardar o texto transcrito; retenção/limite do histórico.

## Subtasks
- [x] Criar `pricing.ts`: tabela USD por modelo + `computeCost(...)`.
- [x] `stt.ts`/`format.ts`/`pipeline.ts`: retornar modelo STT e tokens de formatação.
- [x] Enviar `elapsed` (segundos) no `PROCESS_AUDIO_CHANNEL` (renderer → main).
- [x] Criar `history.ts`: append em `history.json` + `loadHistory()` + agregados.
- [x] Gravar registro após cada transcrição bem-sucedida, fire-and-forget (sem bloquear a resposta).
- [x] IPC `GET_HISTORY_CHANNEL` (shared/ipc.ts + handlers.ts + preload).
- [x] `openCostWindow()` + hash `#custo` + item "Custo" no tray + branch em `App.tsx`.
- [x] View "Custo" (React): cards de métricas + lista do histórico.
