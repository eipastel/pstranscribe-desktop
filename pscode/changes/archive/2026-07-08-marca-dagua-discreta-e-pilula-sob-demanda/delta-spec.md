# Marca d'água discreta e pílula sob demanda — Delta

## Added
- Marca d'água discreta em repouso no canto inferior-esquerdo da tela, texto
  "Segure {atalho} para falar" acompanhando o atalho ativo, bem transparente.

## Changed
- Janela do widget: de 520×220 fixa no centro-topo → overlay fullscreen
  (`bounds = workArea`), mantendo transparente, click-through, alwaysOnTop e sem
  sombra; posições agora via CSS (`fixed`/`absolute`).
- Estado `idle`: antes mostrava a pílula "Falar para transcrever" permanente →
  agora mostra apenas a marca d'água; a pílula surge sob demanda no centro-topo
  nos estados ativos (listening/transcribing/done/error) e volta à marca d'água
  no reset.
