# Tela de conceitos salvos para revisão manual

## Summary
Uma tela nova, no menu lateral do app depois de "Custos", que mostra os conceitos
já salvos no glossário (correções errado→certo e termos mantidos) e deixa o
usuário editar a grafia certa, remover ou adicionar uma correção manualmente.

## Technical detail
- O glossário (`src/main/glossary.ts` + `src/shared/glossary.ts`) guarda
  `corrections` (errado→certo), `pending` e `reviewed`. Os "salvos" são as
  `corrections` mais os mantidos.
- Hoje `reviewed` mistura mantidos, corrigidos e ignorados — não dá pra listar só
  os mantidos. Adicionar um campo `kept: string[]` ao `Glossary` (só o `keep`
  grava nele) resolve, sem tocar na autocorreção.
- Precisa de store/IPC novos: listar salvos e editar/remover/adicionar correção.
  Espelhar o padrão de `CONCEPTS_*` em `ipc.ts`/handlers/preload e reusar
  `broadcastConceptsChanged`.
- A tela é um componente do renderer, renderizado como aba no `AppShell` (#95),
  seguindo o padrão de `SettingsWindow`/`CostWindow`.

## Scope
### In
- Campo `kept` no glossário para separar mantidos de ignorados.
- IPC para listar salvos e editar/remover/adicionar correção.
- Componente de UI listando correções + mantidos, com editar/remover/adicionar.
- Aba "Conceitos" no `AppShell`, depois de "Custos".

### Out
- Lógica de autocorreção/detecção de conceitos.
- Painel de pendentes (badge → `#conceitos`) — segue como está.
- Redimensionar/mudar chrome das janelas (é o #94).

## Subtasks
- [x] Glossário: campo `kept` (só `keep` grava) + funções `savedConcepts`, `setCorrection` (add+editar), `removeConcept`.
- [x] IPC/preload: canais e API para listar salvos e editar/remover/adicionar, com broadcast `concepts:changed`.
- [x] UI: componente "Conceitos salvos" (lista correções + mantidos; editar grafia, remover, adicionar do zero).
- [x] AppShell: aba "Conceitos" depois de "Custos" renderizando a tela (depende do #95).
