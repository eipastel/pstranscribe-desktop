# Keybind para ativar transcrição contínua

## Objetivo
Um atalho de teclado (até 3 teclas) que ATIVA a transcrição em modo contínuo:
aciona uma vez para começar a ouvir, aciona de novo para parar — sem precisar
segurar a tecla.

## Comportamento esperado
- O funcionamento é EXATAMENTE o mesmo do push-to-talk atual, só que disparado
  por dois toques (liga/desliga) em vez de segurar/soltar.
- Atalho configurável nas Configurações, como o de falar. Padrão: Ctrl+Shift+Space.
- Auto-stop de segurança após um teto de tempo, para não estourar o limite de
  tamanho da API de STT.

## Fora de escopo
- Reconfigurar o keybind existente de push-to-talk.
- Transcrição em tempo real / incremental (é o card #81) — este card reaproveita
  o mesmo fluxo, então herda o #81 quando ele existir, sem trabalho extra aqui.
