# Testes E2E (Playwright + Electron) na pipeline

## Summary
Um teste automatizado sobe o app de verdade e percorre o fluxo principal —
segurar a tecla, falar, soltar, texto colado — com a OpenAI mockada. Roda em
todo PR e barra o merge se quebrar. Este card entrega a espinha (harness + um
fluxo ponta a ponta + CI); os demais fluxos (settings, chave, posição da janela)
vêm depois.

## Technical detail
- **Runner:** `@playwright/test` com `_electron.launch()` subindo o build do
  electron-vite (`out/main/index.js`), não o instalador. `playwright.config.ts`
  + script `test:e2e`.
- **Modo E2E (`PSTRANSCRIBE_E2E=1`):** o app, só sob essa env, (a) expõe um canal
  IPC de teste que injeta PTT `press`/`release` (substitui o hook global
  `uiohook-napi`, não simulável headless) e stuba o colar (`paste.ts` captura o
  texto em vez de simular `Ctrl+V`); (b) injeta **fakes da OpenAI** no boundary
  (`stt`, `format`, `validateApiKey` + `/v1/models`) devolvendo respostas canned,
  sem rede. Inerte em produção.
- **Áudio fake:** flags do Chromium via `args` do launch
  (`--use-fake-device-for-media-stream`, `--use-file-for-fake-audio-capture`
  com um `.wav` de fixture).
- **Fluxo espinha:** launch → widget renderiza (assert na pílula) → seta chave
  fake (destrava o PTT) → `press` via hook de teste → `release` → pipeline roda
  com os fakes → assert do estado final e do texto capturado pelo stub do colar.
- **CI:** job `e2e` no **ubuntu-latest + xvfb** rodando `test:e2e` em todo PR;
  **barra o merge** se falhar. Traces/vídeos do Playwright anexados como
  artefato **só quando um teste falha**.

## Scope
### In
- Harness Playwright + Electron contra o build `out/`.
- Modo E2E gated por env: hook IPC de teste (PTT + stub do colar) e fakes da
  OpenAI. Mudança mínima de produção, inerte fora do modo teste.
- Um fluxo ponta a ponta (push-to-talk → pipeline → colado) verde.
- Job `e2e` no CI (ubuntu + xvfb) barrando o merge, com artefatos em falha.

### Out
- Fluxos de settings (toggles persistem), chave (mascarada/substituir/remover) e
  posição exata da janela — próximos incrementos/card.
- Matriz macOS/Windows no E2E de PR (só release, opcional).
- Smoke test do binário empacotado.

## Subtasks
- [ ] Setup do Playwright: instalar `@playwright/test`, `playwright.config.ts`
  apontando pro build `out/`, script `test:e2e` e um smoke que só faz
  `_electron.launch()` + `firstWindow()`.
- [ ] Modo E2E gated por `PSTRANSCRIBE_E2E=1`: canal IPC de teste que injeta PTT
  press/release e stub do colar (captura o texto). Inerte em produção.
- [ ] Injeção de fakes da OpenAI no modo E2E: `stt`, `format` e `validateApiKey`
  (+ `/v1/models`) devolvem respostas canned, sem rede.
- [ ] Fluxo espinha ponta a ponta: launch → widget renderiza → chave fake → PTT
  via hook de teste (áudio fake do Chromium) → pipeline → assert do estado final
  e do texto colado.
- [ ] CI: job `e2e` no ubuntu-latest + xvfb rodando `test:e2e` (barra merge),
  com traces/vídeos anexados só em falha.
