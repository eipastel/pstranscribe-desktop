# Logs de debug com menu ativável nas configurações

## Objetivo

Dar ao usuário um modo de debug: uma opção no fim das Configurações que, quando
ligada, libera um menu de logs onde os logs do app passam a ser exibidos.

## Comportamento esperado

- **Ativa:** o app captura os logs de toda a aplicação — incluindo crashes e
  erros — e os direciona para o menu de logs.
- **Inativa (padrão):** o monitoramento fica desligado ou mínimo, sem gerar
  arquivos/consumo que "lotem" a máquina do usuário. Deve ser otimizado.

## Fora de escopo

- Envio/telemetria remota dos logs para servidor.
- Dashboards externos.
- Definição do formato final de exportação.
