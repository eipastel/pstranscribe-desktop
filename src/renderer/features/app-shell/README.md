# app-shell — a janela "Aplicativo"

O shell da janela `#app`: menu lateral + área de conteúdo, com um único
fechar/Esc. Reúne num só lugar as abas **Configurações**, **Custos** e
**Conceitos** (`ConceptsSaved`).

- **`AppShell.tsx`** — layout do shell e navegação entre abas. A aba ativa é
  puramente estado do renderer, lembrada entre aberturas via `localStorage`.

Cada aba delega para a sua feature (`settings`, `cost`, `concepts`) — o shell só
enquadra e alterna.
