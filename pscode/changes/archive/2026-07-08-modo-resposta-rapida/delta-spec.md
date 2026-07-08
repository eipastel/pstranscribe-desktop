# Modo de resposta rápida — Delta

## Added
- Setting `respostaRapida: boolean` (default `false`) em `shared/settings.ts`,
  exposto no IPC via `PublicSettings`/`SettingsPatch`.
- Toggle "Resposta rápida" na tela de Configurações, abaixo de "Formatar".
- Modo rápido de STT: quando ligado, a transcrição usa `gpt-4o-mini-transcribe`
  (menor/mais barato) em vez de `gpt-4o-transcribe`.

## Changed
- `transcribeAudio(audio, fast)` ganhou o parâmetro `fast`; o pipeline o repassa
  a partir de `respostaRapida`.
- No modo rápido, `model_unavailable` retorna erro para a UI em vez de cair no
  `whisper-1` (fora do modo rápido o fallback continua).

## Out (adiado)
- Troca do modelo de formatação (`gpt-5.4-nano`) fica pendente enquanto
  `FORMAT_LOCKED` mantém a formatação desligada.
