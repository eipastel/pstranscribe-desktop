# Testes unitários (85%+) e E2E na pipeline

## Objetivo
Todo PR roda a suíte de testes e o merge é **barrado** se algum teste falhar ou
a cobertura cair abaixo do limite. A pipeline deixa de aceitar código sem a
cobertura mínima de testes.

## Comportamento esperado
- Runner de testes unitários (Vitest) rodando lógica pura e componentes.
- Gate de cobertura que quebra o build abaixo do limite definido.
- CI roda os testes em todo PR e push na `main`, barrando merge se falhar.
- (Escopo maior do card original) suíte E2E subindo o app real com OpenAI
  mockada, rodando na pipeline.

## Fora de escopo
- Matriz macOS/Windows no E2E de PR (só no release, opcional).
- Assinatura de código / secrets reais da OpenAI (tudo mockado — modelo BYO-key).
