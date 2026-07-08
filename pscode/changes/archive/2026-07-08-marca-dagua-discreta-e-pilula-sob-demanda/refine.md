# Marca d'água discreta e pílula sob demanda

## Summary
Em repouso, o app mostra só uma marca d'água discreta no canto inferior-esquerdo
em vez da pílula permanente. Ao segurar o push-to-talk, a pílula surge no
centro-topo e transcreve; ao soltar (e terminar), volta à marca d'água.

## Technical detail
- A janela do widget (`src/main/windows/widget.ts`) hoje é fixa 520×220 no
  centro-topo. Vira **overlay fullscreen**: `bounds = workArea` inteiro,
  mantendo `transparent`, `alwaysOnTop`, `skipTaskbar`, `hasShadow:false` e o
  `setIgnoreMouseEvents(true, forward)` (click-through) já existentes.
- Posições passam a ser CSS `fixed` na tela: pílula ancorada no centro-topo
  (~15% do topo, como o `TOP_RATIO` atual) e marca d'água no canto
  inferior-esquerdo — não dependem mais do centro da janela.
- No `VoiceWidget.tsx`, o estado `idle` deixa de renderizar a pílula e passa a
  mostrar a marca d'água: texto "Segure {atalho} para falar" com o atalho ativo
  (reaproveita `keyParts`/`HINTS.idle`), bem transparente.
- Todos os estados ativos (`listening`, `transcribing`, `done`, `error`)
  continuam na pílula centro-topo; o `reset` → `idle` volta à marca d'água.

## Scope
### In
- Janela do widget como overlay fullscreen.
- Marca d'água em repouso (canto inf-esq, atalho ativo, bem transparente).
- Pílula sob demanda no centro-topo nos estados ativos.
### Out
- Fluxo de transcrição / integração OpenAI.
- Atalhos e lógica de captura de áudio (PTT).

## Subtasks
- [x] `widget.ts`: janela vira overlay fullscreen (`bounds = workArea`), mantendo transparente, click-through, alwaysOnTop e sem sombra.
- [x] `VoiceWidget`/CSS: ancorar a pílula (com hint) fixa no centro-topo da tela, sem depender do centro da janela.
- [x] `VoiceWidget`: no `idle`, renderizar a marca d'água fixa no canto inferior-esquerdo ("Segure {atalho} para falar", bem transparente) e remover a pílula/hint do repouso.
