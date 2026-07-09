# Opção de atualização no app

## Objetivo
Dar ao usuário uma forma explícita, dentro do app, de buscar e aplicar
atualizações — consumindo os GitHub Releases publicados pelo pipeline (#7).

## Comportamento esperado
Uma opção "Atualização" na janela de Configurações/Custos já existente que:
- verifica se há versão nova;
- mostra a versão atual e a disponível;
- permite baixar e instalar/reiniciar;
- dá feedback de estado: verificando / atualizado / nova versão disponível /
  baixando / pronto para reiniciar.

## Fora de escopo
- O pipeline de release em si (#7).
- Assinatura de código — este card apenas consome os Releases já publicados.
