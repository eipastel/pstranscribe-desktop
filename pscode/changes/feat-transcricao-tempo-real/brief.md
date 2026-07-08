# Transcrição em tempo real na transcrição rápida

## Objetivo
Enquanto o usuário fala, o texto vai sendo transcrito e colado
incrementalmente na posição do cursor — em vez de esperar o fim da fala
para colar tudo de uma vez.

## Comportamento esperado
- Vale **apenas** quando a configuração "transcrição rápida"
  (`respostaRapida`) estiver habilitada.
- Ao soltar/segurar o PTT, os trechos reconhecidos vão sendo colados no
  campo em foco conforme chegam.

## Fora de escopo
- O comportamento com "transcrição rápida" desligada continua igual
  (grava tudo → transcreve → cola de uma vez).
