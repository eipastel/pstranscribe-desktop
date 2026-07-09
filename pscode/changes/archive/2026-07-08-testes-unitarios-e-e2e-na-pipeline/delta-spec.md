# Delta spec — testes unitários e gate de cobertura

## Added
- **Gate de cobertura na pipeline.** A CI passa a rodar `npm run test:coverage`
  num job `unit-tests` dedicado (ubuntu-latest); o merge é barrado se um teste
  falhar ou a cobertura da lógica pura cair abaixo de **85%**
  (lines/functions/branches/statements).
- **Escopo do gate (`vitest.config.ts` → `coverage.include`):** só a lógica pura
  — `main/openai/key.ts`, `main/openai/pipeline.ts`, `shared/glossary.ts` e o
  store `renderer/state/widget.ts`. Casca nativa/UI/CSS ficam fora do denominador.
- **Suíte unitária (35 testes):** estados da chave OpenAI + erros de API
  (401/429/402, `/v1/models` mockado), branching das flags do pipeline,
  `applyCorrections` e a máquina de estados do widget (fake timers).
- **Script `test:coverage`**, badge do Codecov no README e upload de cobertura
  no CI (via secret `CODECOV_TOKEN`).

## Changed
- CI: os testes saíram da matriz windows e viraram job próprio no ubuntu
  (`npm ci --ignore-scripts`, já que o nativo é mockado).
- `.gitignore`/`.prettierignore` passam a ignorar `coverage/`.

## Removed
- Nada.

## Out (vira card #129)
- Testes E2E (Playwright + Electron) na pipeline.
