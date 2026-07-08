# Glossário de conceitos: extração assíncrona por IA e autocorreção

## Objetivo
Manter um glossário de termos que o usuário revisa, para corrigir
automaticamente transcrições futuras.

## Comportamento esperado
- Depois de transcrever + formatar (sem atrasar o texto colado), uma análise por
  IA roda de forma **assíncrona** e extrai termos desconhecidos ou prováveis
  erros: nomes de pessoas, empresas, jargões (ex.: "dixie").
- Esses termos viram uma **lista de conceitos pendentes** que o usuário revisa:
  diz o que é, marca como correto, ou informa a grafia certa.
- O termo revisado entra num **map de acesso rápido** (grafia errada → correta),
  aplicado no momento em que a transcrição sai — sem custo perceptível.

## Fora de escopo
- Mudanças no fluxo de transcrição além da autocorreção.
- Sincronização em nuvem.
