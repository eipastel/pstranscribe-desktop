# Questions

- [x] Escopo do card? → **Só unit + gate de cobertura agora.** E2E (Playwright +
  Electron, xvfb, áudio fake, hook IPC de teste) vira card separado.
- [x] Onde incide o gate de 85%? → **Só na lógica pura** (openai/*, glossary,
  máquina de estados) via `include`. Casca nativa/UI/CSS fora do denominador.
- [x] Mecanismo do gate? → **Vitest thresholds + Codecov** (badge no README +
  relatório no PR; precisa do secret `CODECOV_TOKEN`).
- [x] Onde roda o job? → **Job separado no ubuntu-latest** (unit mocka o nativo).
