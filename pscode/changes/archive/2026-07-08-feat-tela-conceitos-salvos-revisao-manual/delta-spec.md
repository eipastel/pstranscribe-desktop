# Tela de conceitos salvos para revisão manual — Delta

## Added
- Aba "Conceitos" na janela do app (depois de "Custos") listando os conceitos
  salvos: correções (errado→certo) e termos mantidos.
- Ações manuais na tela: adicionar correção do zero, editar a grafia certa,
  remover (correção ou mantido) e corrigir a grafia de um mantido (vira correção).
- Campo `kept` no glossário para separar "mantidos" de "ignorados".
- IPC: `concepts:saved` (listar), `concepts:set` (add/editar), `concepts:remove`.

## Changed
- `reviewConcept`: a ação `keep` passa a registrar o termo em `kept` (antes só ia
  para `reviewed`, indistinguível de ignorado).
- Edições na tela disparam o broadcast `concepts:changed` existente, então a lista
  (e o painel de pendentes) recarregam na hora.

## Notas
- O painel de pendentes (badge → janela `#conceitos`) segue como estava.
