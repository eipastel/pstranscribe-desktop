# Glossário de conceitos: extração assíncrona por IA e autocorreção

## Summary
Depois de cada transcrição, uma IA analisa o texto em segundo plano e sugere
termos que parecem nomes, empresas ou jargões errados. O usuário revisa esses
termos num painel; os que ele corrige viram um glossário que passa a arrumar
sozinho a grafia nas próximas transcrições, sem atrasar o texto colado.

## Technical detail
- **Store** (`src/main/glossary.ts`, espelhando `history.ts`): JSON em `userData`
  com `corrections` (map errado→certo), `pending` (termos aguardando revisão) e
  `reviewed` (conjunto de já revisados — aprovado/ignorado/corrigido). Helpers:
  `applyCorrections(text)`, `addPending(terms)`, `reviewConcept(term, action, spelling?)`.
- **Autocorreção** no `pipeline.ts`: aplica `applyCorrections` sobre o texto bruto
  do STT (linha `raw = stt.text.trim()`), antes de formatar. Substituição por
  palavra inteira (`\b`), case-insensitive, usando a grafia certa do map. Pura e
  local, sem chamada de rede.
- **Extração assíncrona** (`src/main/openai/concepts.ts`): `extractConcepts(text)`
  chama `gpt-5.4-mini` pedindo termos desconhecidos/prováveis erros em JSON.
  Agendada em `handlers.ts` junto do bloco de custo (`setImmediate`, após o
  `pasteText`) — fora do caminho crítico. Filtra o que já está em `reviewed`/`pending`
  e grava os novos como pendentes.
- **IPC** (`shared/ipc.ts` + `preload`): `concepts:count`, `concepts:list`,
  `concepts:review` (invoke) e `concepts:changed` (evento broadcast) para o badge
  atualizar ao vivo.
- **Widget**: badge com a contagem de pendentes na pílula; clique abre o painel.
- **Painel** (nova janela + feature `concepts` no renderer, espelhando `settings`):
  lista os pendentes e, por termo, oferece **[é isso / manter]** · **[corrigir grafia]**
  · **[ignorar]**; cada ação grava no store e atualiza o badge.

## Scope
### In
- Store persistente (corrections + pending + reviewed).
- Autocorreção local no pipeline, sobre o texto bruto.
- Extração assíncrona por IA após a transcrição.
- Badge no widget + painel de revisão dos pendentes.

### Out
- Mudanças no fluxo de transcrição além da autocorreção (ex.: viesar o STT com
  termos conhecidos).
- Contabilizar o custo da chamada de extração nas métricas.
- Sincronização em nuvem.

## Subtasks
- [x] Store `glossary.ts` + tipos em `shared`: corrections/pending/reviewed com load/save e helpers.
- [x] Autocorreção no `pipeline.ts`: `applyCorrections` sobre o texto bruto, match palavra-inteira case-insensitive.
- [x] Extração assíncrona `concepts.ts`: chama a IA, filtra revisados/pendentes, grava novos pendentes; agenda em `handlers.ts`.
- [x] IPC + preload: `concepts:count`, `concepts:list`, `concepts:review`, evento `concepts:changed`.
- [x] Badge no widget: contagem de pendentes, atualiza ao vivo, clique abre o painel.
- [x] Painel de conceitos: janela + feature `concepts` que lista pendentes e grava é-isso/corrigir/ignorar.
