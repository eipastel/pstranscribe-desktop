# Métricas de custo e histórico de transcrições — Delta

## Added
- Histórico local por transcrição (`history.json` no `userData`): registro
  `{ ts, seconds, sttModel, formatTokens, costUsd }`, sem o texto transcrito.
- Tabela de preços em USD por modelo (`pricing.ts`) e `computeCost(...)` (STT por
  minuto + formatação por token).
- Tela "Custo": custo total, custo médio por transcrição e custo médio por minuto,
  mais a lista do histórico.
- IPC `GET_HISTORY_CHANNEL` retornando registros + agregados.

## Changed
- `stt.ts`/`format.ts`/`pipeline.ts` passam a propagar o modelo STT efetivo e os
  tokens de formatação (antes descartados); o `elapsed` (segundos) vai junto no
  `PROCESS_AUDIO_CHANNEL`.
- Gravação do registro é fire-and-forget após devolver a transcrição ao renderer:
  coleta/cálculo/escrita ficam fora do caminho crítico, sem somar latência.

## Notas
- Código entregue junto no commit `b5eada9` (bundle com o #95, que unificou a tela
  de Custo na janela "Aplicativo").
