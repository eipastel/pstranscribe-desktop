# Métricas de custo e histórico de transcrições

## Objetivo
Registrar cada transcrição em um histórico persistente e, a partir dele, exibir
métricas de custo do uso local.

## Comportamento esperado
- Cada transcrição vira um registro salvo (data, duração do áudio, modelo, custo).
- Métricas derivadas do histórico: custo total, custo médio por transcrição e
  custo médio por minuto de áudio.
- Acesso pelo menu da bandeja (tray): clicar no app → "Custo" abre a
  visualização das métricas + histórico.

## Fora de escopo
- Limites / orçamento de gasto e alertas.
- Exportação de relatórios.
- Integração de billing real com a OpenAI (usar preço local por modelo).
