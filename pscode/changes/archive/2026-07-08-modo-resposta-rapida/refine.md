# Modo de resposta rápida nas configurações

## Summary
Um toggle "Resposta rápida" na tela de Configurações (desligado por padrão).
Ligado, a transcrição e a formatação usam modelos menores e mais baratos, para
entregar a mensagem mais rápido. Desligado, nada muda.

## Technical detail
- Novo campo `respostaRapida: boolean` em `shared/settings.ts` (default `false`).
  `PublicSettings` e `SettingsPatch` já derivam de `Settings`, então o toggle
  trafega pelo IPC atual sem mudar canais.
- O pipeline (`main/openai/pipeline.ts`) lê `respostaRapida` junto com
  `transcrever`/`formatar` e repassa a flag para `transcribeAudio` e `formatText`.
- Modelos rápidos (custo-benefício): STT `gpt-4o-transcribe` → `gpt-4o-mini-transcribe`;
  formatação `gpt-5.4-mini` → `gpt-5.4-nano`. Constantes de modelo escolhidas pela flag.
- Fallback: no modo rápido, se o modelo rápido estiver indisponível
  (`model_unavailable`), retorna erro para a UI em vez de cair no modelo padrão
  (não degrada silenciosamente para a velocidade normal).
- UI: nova `settings-row` com `Toggle` "Resposta rápida" logo abaixo de
  "Formatar" em `SettingsWindow.tsx`, descrição curta ("Prioriza velocidade
  sobre qualidade").

## Scope
### In
- Campo de setting `respostaRapida` + default.
- Toggle na tela de Configurações.
- Seleção de modelos rápidos no STT e na formatação quando ligado.
- Erro (sem downgrade silencioso) quando o modelo rápido está indisponível.

### Out
- Streaming de transcrição/resposta.
- Indicador de "modo rápido" no widget/preview.
- Ajuste fino de prompt para os modelos menores.

## Subtasks
- [x] Adicionar `respostaRapida: boolean` (default `false`) em `shared/settings.ts`.
- [x] Toggle "Resposta rápida" abaixo de "Formatar" em `SettingsWindow.tsx`.
- [x] No pipeline, passar a flag e selecionar o STT `gpt-4o-mini-transcribe` quando ligado. (Modelo de formatação `gpt-5.4-nano` adiado enquanto `FORMAT_LOCKED` pula a formatação.)
- [x] No modo rápido, retornar erro quando o modelo rápido estiver indisponível (sem cair no modelo padrão).
