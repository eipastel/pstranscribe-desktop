# Configurações com largura da pílula e altura sem corte

## Summary
A janela de configurações fica do mesmo tamanho do widget: o painel ganha a
largura da pílula (460px) e a janela cresce em altura para nenhum item da lista
ficar cortado.

## Technical detail
- `.settings-panel` está em `452px` — passa para `var(--pill-width)` (460px), o
  mesmo token que a pílula usa (`src/renderer/features/settings/SettingsWindow.css`).
- A janela é fixa (`resizable: false`, `overflow: hidden`), sem scroll: hoje
  `500×560` corta o último row (`KeyRow`, "Chave OpenAI").
  Em `src/main/windows/settings.ts`:
  - largura `500 → 520`, igual ao widget (folga simétrica pro shadow do vidro).
  - altura fixa maior o bastante para os 6 rows + shadow, confirmada rodando.

## Scope
### In
- Largura do painel `.settings-panel` = largura da pílula.
- Largura e altura da BrowserWindow de settings.
### Out
- Conteúdo/comportamento das configurações (toggles, rows, chave, etc.).

## Subtasks
- [x] Painel `.settings-panel` usa `var(--pill-width)` (460px)
- [x] Janela de settings: largura 520 e altura sem corte, verificada rodando
