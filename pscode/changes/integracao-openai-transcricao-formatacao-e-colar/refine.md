# integração openai: transcrição, formatação e colar

## Summary
O produto funcionando ponta a ponta com a chave do próprio usuário: insere a chave uma vez → segura Ctrl+P → fala → solta → transcreve → IA enxuga → cola no campo em foco → check.

## Technical detail
- Chamadas OpenAI **no main process**: CSP do renderer bloqueia fetch externo e a chave nunca sai do main.
- Chave: `safeStorage` (ciphertext base64 dentro do settings.json); nunca em texto puro/log. IPC: `key:set` (valida e salva), `key:status`, `key:clear`.
- Validação barata: `GET /v1/models`; mapeamento de erros 401 (chave inválida), 429 (rate limit), 402/insufficient_quota (sem crédito) → mensagens claras em grayscale.
- Porta de primeiro uso: sem chave válida, o widget mostra painel glass com Input (status checking/ok/error da batch 2) + Button; PTT travado até validar.
- STT: `gpt-4o-transcribe` (fallback `whisper-1`) — confirmar modelo atual ao codar; `language: 'pt'`; blob webm cruza IPC como ArrayBuffer no release.
- Formatação: modelo leve atual (tipo gpt-4o-mini) com system prompt enxugar/humanizar; se falhar com transcrição em mãos, **cola o bruto** com hint.
- Flags `transcrever`/`formatar` nos settings (default true) — batch 5 ganha UI.
- Colar: salvar clipboard → escrever texto → Ctrl+V simulado (nut.js fork gratuito ou equivalente leve p/ Windows) → restaurar clipboard.
- Widget: "refinando" vira estado real (mostra transcrição bruta real); novo estado de erro na voz da interface; transcript mock removido.

## Scope
### In
- Armazenamento/validação da chave, porta no widget, pipeline STT+formatação no main, colar com restauração de clipboard, estados reais de loading/erro.
### Out
- Tela de configurações (batch 5), empacotamento, backend proxy para usuário sem chave, troca de modelo pela UI.

## Subtasks
- [x] Chave segura no main: safeStorage + settings, IPC key:set/key:status/key:clear, validação /v1/models com erros 401/429/402 mapeados
- [x] Porta de primeiro uso no widget: painel glass com Input + Salvar, estados checking/ok/error, PTT travado sem chave
- [ ] Pipeline STT no main: blob via IPC no release → gpt-4o-transcribe (language pt) → transcrição bruta
- [ ] Formatação por IA com flags transcrever/formatar; falha → cola o bruto
- [ ] Colar no campo em foco: clipboard + Ctrl+V simulado + restauração
- [ ] Estados reais no widget: refinando com texto bruto real, erro claro, check ao colar
