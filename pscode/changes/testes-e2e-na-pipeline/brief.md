# Testes E2E (Playwright + Electron) na pipeline

## Objetivo
Subir o app real (main + preload + renderer) e validar os fluxos ponta a ponta
num teste automatizado, incluído na pipeline. Card separado do #8 (que fez os
unitários + cobertura).

## Comportamento esperado
- `_electron.launch()` sobe o build do electron-vite (`out/main`), não o instalador.
- Cobre: janela na posição certa, widget renderiza, transições de estado, settings
  (toggles persistem, chave mascarada/substituir/remover) e o pipeline ponta a
  ponta com OpenAI mockada.
- Determinismo: stub da OpenAI (incl. `/v1/models`), áudio fake por flags do
  Chromium, xvfb no Linux; bits nativos (hook de teclado, colar) via canal IPC de
  teste só em modo teste.
- Job E2E em todo PR no ubuntu-latest; traces/vídeos anexados só quando falha.

## Fora de escopo
- Matriz macOS/Windows no E2E de PR (só no release, opcional).
- Testes unitários e gate de cobertura (card #8, concluído).
