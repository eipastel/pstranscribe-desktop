# concepts — glossário e conceitos

A revisão do glossário, que autocorrige termos no texto bruto antes da
formatação. Tem duas superfícies:

- **`ConceptsWindow.tsx`** — a janela própria (`#conceitos`, aberta pelo badge do
  widget): lista os termos pendentes e, por termo, oferece **manter** / **corrigir
  grafia** / **ignorar**. Cada ação grava e o broadcast `concepts:changed`
  recarrega a lista.
- **`ConceptsSaved.tsx`** — a aba "Conceitos" dentro do `app-shell`: os conceitos
  já salvos.

O mapa de correções vive no main (`glossary` + `openai/concepts`); esta feature é
a UI de revisão.
