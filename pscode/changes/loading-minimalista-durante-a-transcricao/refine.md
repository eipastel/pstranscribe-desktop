# Loading minimalista durante a transcrição

## Resumo
Durante a transcrição, a pílula hoje mostra spinner + "Refinando com IA" +
"transcrição bruta" + a prévia do texto ao vivo, e um hint embaixo. Trocar tudo
isso por **só o spinner centralizado**, sem nenhum texto.

## Detalhe técnico
- `VoiceWidget.tsx` (bloco `status === 'transcribing'`, linhas 89–98): substituir
  o `vw-col` (com `vw-crow`, título, aux e `<TranscriptPreview>`) por apenas o
  `<span className="vw-spin" />` centralizado. A pílula segue `tall` (tamanho
  atual mantido).
- Ocultar o hint no loading: só renderizar `vw-hint` quando
  `status !== 'transcribing'` (idle/listening/error inalterados).
- `VoiceWidget.css`: remover as regras órfãs (`vw-crow`, `vw-title`, `vw-aux`) e
  garantir o spinner centrado no `vw-col`/pílula.
- `TranscriptPreview` fica órfão → remover o componente e seu CSS, além do
  import e do `rawText` lido só para ele no `VoiceWidget`.

## Em escopo
- Estado de transcrição vira apenas spinner; hint some no loading.
- Limpeza do CSS e do componente `TranscriptPreview` que ficam sem uso.

## Fora de escopo
- Barra de progresso, porcentagem, mensagens de etapa ou estimativa de tempo.
- Desmontar a plumbing de `rawText` no main/IPC (`onRawText`, store, useRecording):
  continua alimentando o store sem exibir — fica para outro card.

## Subtasks
- [x] Substituir o bloco de transcrição por só o spinner centralizado e ocultar o hint no loading (VoiceWidget.tsx + VoiceWidget.css)
- [ ] Remover o componente TranscriptPreview (arquivo + CSS) e o uso órfão de rawText/import no VoiceWidget
