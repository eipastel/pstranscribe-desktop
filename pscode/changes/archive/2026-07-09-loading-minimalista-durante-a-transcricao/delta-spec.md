# Loading minimalista durante a transcrição — Delta

## Changed
- Estado `transcribing` do widget agora mostra **apenas o spinner centralizado**,
  sem título ("Refinando com IA"), sem rótulo auxiliar ("transcrição bruta") e
  sem a prévia do texto bruto.
- O hint abaixo da pílula fica **oculto durante a transcrição**
  (idle/listening/error inalterados).
- A pílula **não cresce mais** no loading: deixou de usar `tall`, mantendo a
  mesma altura dos demais estados.

## Removed
- Componente `TranscriptPreview` (`.tsx` + `.css`), que ficou órfão, e seu uso de
  `rawText`/import no `VoiceWidget`. Regras CSS órfãs (`vw-crow`, `vw-title`,
  `vw-aux`) removidas.

## Fora de escopo
- A plumbing de `rawText` no main/IPC (`onRawText`, store, `useRecording`)
  permanece: continua alimentando o store sem exibir.
