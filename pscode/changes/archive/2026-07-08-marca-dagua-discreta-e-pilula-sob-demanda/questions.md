# Questions

- [x] Como posicionar marca d'água (canto inf-esq) e pílula (centro-topo) na
  tela? → **Janela vira overlay fullscreen** (transparente + click-through);
  posições via CSS `fixed`, sem reposicionar a janela.
- [x] Texto da marca d'água em repouso? → **"Segure {atalho} para falar"**,
  mostrando o atalho ativo (reaproveita o hint atual do idle).
- [x] Onde aparecem transcribing/done/error após soltar? → **Pílula no
  centro-topo em todos os estados ativos**; só volta à marca d'água no reset (idle).
