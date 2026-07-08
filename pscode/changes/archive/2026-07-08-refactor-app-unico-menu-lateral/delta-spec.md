# Unificar Configurações e Custos em janela única com menu lateral — Delta

## Added
- Janela única "Aplicativo" (rota `#app`, `openAppWindow`, 760×660 frameless).
- `AppShell`: menu lateral (Configurações / Custos) + área de conteúdo única,
  com um único botão de fechar e Esc.
- Persistência da última aba aberta em `localStorage` (`app.tab`).

## Changed
- Bandeja: dois itens ("Configurações" e "Custo") → um único item "Aplicativo";
  duplo-clique também abre o app.
- `SettingsWindow` e `CostWindow`: de janelas autônomas (glass + cabeçalho +
  fechar próprios) → painéis de conteúdo embutidos no shell.

## Removed
- Janelas/rotas separadas `#settings` e `#custo` (`openSettingsWindow`,
  `openCostWindow`, `windows/settings.ts`, `windows/cost.ts`).
