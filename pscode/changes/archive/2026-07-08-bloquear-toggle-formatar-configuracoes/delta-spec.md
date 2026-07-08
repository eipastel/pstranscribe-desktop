# Bloquear toggle "Formatar" nas configurações — Delta

## Added
- Constante compartilhada `FORMAT_LOCKED` (`src/shared/settings.ts`) que trava
  temporariamente a formatação. Trocar para `false` devolve a opção.

## Changed
- Toggle "Formatar" nas Configurações: enquanto `FORMAT_LOCKED`, aparece
  desligado, dim e desabilitado (não-clicável). Não altera o valor `formatar`
  salvo nos settings.
- Pipeline (`processAudio`): enquanto `FORMAT_LOCKED`, pula a formatação por IA
  e cola o texto bruto da transcrição.
