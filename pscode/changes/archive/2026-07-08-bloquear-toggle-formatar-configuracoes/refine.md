# Bloquear toggle "Formatar" nas configurações

## Summary
A opção "Formatar" das Configurações fica temporariamente bloqueada: aparece
desligada e não-clicável, e a formatação por IA não roda no pipeline. É um
bloqueio temporário — a opção volta depois virando uma linha.

## Technical detail
- Nova constante compartilhada `FORMAT_LOCKED = true` em `src/shared/settings.ts`;
  desbloquear no futuro = trocar para `false`.
- `SettingsWindow.tsx`: a linha "Formatar" passa `checked={... && !FORMAT_LOCKED}`
  (mostra OFF) e `disabled` também quando `FORMAT_LOCKED` (não-clicável). Não
  altera o valor salvo em settings.
- `pipeline.ts` (`processAudio`): a formatação é pulada quando `FORMAT_LOCKED`
  (`if (!formatar || FORMAT_LOCKED || !raw)`), retornando o texto bruto.
- Toggle "Transcrever" e o código de `format.ts` ficam intactos.

## Scope
### In
- Constante `FORMAT_LOCKED` compartilhada.
- Toggle "Formatar" desligado + desabilitado na UI enquanto bloqueado.
- Pipeline pula a formatação enquanto bloqueado.

### Out
- Remover/alterar o código de formatação (`format.ts`).
- Alterar o valor `formatar` salvo nos settings do usuário.
- Mexer no toggle "Transcrever".

## Subtasks
- [x] Adicionar `export const FORMAT_LOCKED = true` em `src/shared/settings.ts`.
- [x] `SettingsWindow.tsx`: forçar o toggle Formatar para OFF + `disabled` quando `FORMAT_LOCKED`.
- [x] `pipeline.ts`: pular a formatação quando `FORMAT_LOCKED`.
