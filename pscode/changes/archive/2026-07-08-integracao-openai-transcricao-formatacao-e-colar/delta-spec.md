# integração openai: transcrição, formatação e colar — Delta

## Added
- BYO-key OpenAI no main (`src/main/openai/key.ts`): validação barata via `GET /v1/models` (401→inválida, insufficient_quota/402→sem crédito, 429→rate limit, rede), chave criptografada com safeStorage (base64 no settings.json), IPC `key:set`/`key:status`/`key:clear`; a chave nunca sai do main nem aparece em log.
- Porta de primeiro uso (`features/key-gate/`): sem chave válida o widget vira painel glass (Input + Salvar, estados checking/ok/error) e o PTT fica travado.
- Pipeline no main (`openai/pipeline.ts` + `stt.ts` + `format.ts`): release → blob via IPC → `gpt-4o-transcribe` (language pt, fallback whisper-1) → `gpt-5.4-mini` enxuga/humaniza → cola no campo em foco; evento `audio:raw` mostra o bruto na UI durante o refino.
- Flags `transcrever`/`formatar` nos settings (default true); formatação falhou → cola o bruto.
- Colar (`main/paste.ts`): clipboard → Ctrl+V via PowerShell SendKeys (zero dep nova, `windowsHide`) → clipboard anterior restaurado; se falhar, o texto fica no clipboard.
- Estado `error` no widget em grayscale (StatusDot + título/como resolver por código, incl. `paste_failed`).

## Changed
- `audio:transcribe` → canal único `audio:process` que retorna `{ raw, text, formatted, pasted }`.
- Estado `transcribing` agora mostra a transcrição real (mock do design removido); silêncio volta a idle.
- Widget aparece com `showInactive()` — não rouba mais o foco do app do usuário (bug real corrigido).

## Removed
- Timeout mock de 2.1s da máquina e o texto bruto fixo do design.
