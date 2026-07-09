# Perguntas de refinamento

- [x] **Plataforma alvo do docs/permissions.md?** → **Windows-first**. O código
  hoje builda só Windows (`build:win`) e o paste usa PowerShell SendKeys; macOS
  vira nota curta de "planejado".
- [x] **Como tratar features WIP (realtime STT desativado por flag)?** → **Só o
  que está no ar**. Documentar apenas o fluxo push-to-talk que funciona hoje.
- [x] **Quantas pastas os READMEs por pasta cobrem?** → **Todas as pastas
  reais** (main, preload, renderer/components, cada feature, shared).
- [x] **Artefatos opcionais entram nesta entrega?** → **Todos**: `.env.example`,
  `docs/adr/` e badges de build/download no README raiz.
