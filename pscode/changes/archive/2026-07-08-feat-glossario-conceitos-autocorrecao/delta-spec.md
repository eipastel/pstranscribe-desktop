# Glossário de conceitos: extração assíncrona por IA e autocorreção — Delta

## Added
- Store de glossário persistente (`glossary.json` em `userData`): `corrections`
  (errado→certo), `pending` (fila de revisão) e `reviewed` (memória do que não
  volta a ser sugerido).
- Extração assíncrona por IA após cada transcrição (`concepts.ts`, gpt-5.4-mini),
  agendada com `setImmediate` fora do caminho crítico; enfileira termos novos.
- Badge de pendentes no widget em repouso; clique abre o painel de conceitos.
- Painel de conceitos (janela `#conceitos`): lista pendentes e, por termo, oferece
  **É isso** / **Corrigir grafia** / **Ignorar**.
- IPC `concepts:count`/`list`/`review` + evento `concepts:changed` (badge e painel
  atualizam ao vivo).

## Changed
- Pipeline de transcrição aplica autocorreção local sobre o texto bruto do STT
  (palavra inteira, case-insensitive, fronteira unicode) antes de formatar/colar.
