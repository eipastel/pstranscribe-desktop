# cost — custos e uso

A aba de Custos (dentro do `app-shell`). Mostra as métricas de uso a partir do
histórico do main (`window.api.getHistory`): quantas transcrições, tempo gravado
e custo estimado.

- **`CostWindow.tsx`** — a tela de custos.

Os dados vêm de `history` no main, que **não** guarda o texto transcrito (só
métricas), por privacidade. A estimativa de preço usa `openai/pricing`.
