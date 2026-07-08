# integração openai: transcrição, formatação e colar

## Objective
Fluxo completo ponta a ponta em modelo BYO-key: insere a chave → segura → fala → solta → transcreve → IA formata → cola no campo em foco → check.

## Expected behavior
Chave OpenAI (BYO-key, sem backend/proxy):
- Porta de primeiro uso: sem chave válida o app não grava (PTT travado até ter chave).
- Chave criptografada com `safeStorage` — nunca em texto puro, repo, log ou crash report.
- Validação barata via `GET /v1/models` (não gasta token), com feedback imediato.
- Erros distintos em grayscale (StatusDot/texto da batch 2), na voz da interface + como resolver:
  401 (chave inválida), 429 (rate limit), 402/insufficient_quota (sem crédito).
- Tela da chave reaproveita Input + tokens glass da batch 2 — zero componente novo.

Pipeline:
- STT: gpt-4o-transcribe (ou whisper-1 fallback) — confirmar modelo atual na hora de codar.
- Release do keybind → blob → transcrição bruta → formatação por IA (system prompt para
  enxugar/humanizar, modelo leve tipo gpt-4o-mini).
- Loading/erro fiados no visual "refinando", mensagens claras sem desculpa genérica.
- Colar no campo em foco: clipboard + Ctrl+V simulado com nut.js (não robotjs), restaurando
  o clipboard anterior depois.
- Flags internas transcrever/formatar prontas no pipeline (tela vem na batch 5).

## Out of scope
- Tela de configurações (batch 5).
- Empacotamento.
- Experiência "usuário sem chave" (backend proxy) — workstream à parte.
