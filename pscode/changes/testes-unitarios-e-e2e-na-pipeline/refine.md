# Testes unitários (85%) e gate de cobertura na pipeline

## Summary
Todo PR passa a rodar a suíte de testes unitários e o merge é barrado se algum
teste falhar ou se a cobertura da lógica principal cair abaixo de 85%. Assim a
pipeline não aceita mais mudança na lógica sem teste que a cubra.

## Technical detail
- **Runner:** Vitest (nativo do Vite/electron-vite, ESM+TS sem config extra),
  com `happy-dom` para a máquina de estados do widget (hooks do renderer).
- **Gate de cobertura:** `@vitest/coverage-v8` com `coverage.include` apontando
  **só para a lógica pura** e `coverage.thresholds` em **85%** (lines, functions,
  branches, statements). Abaixo disso o processo falha e derruba o CI → merge
  barrado. A casca fina SO/nativo, a UI e o CSS ficam fora do `include`.
- **Alvos de teste:**
  - `openai/key.ts` — `mapError`/`validateApiKey`: estados da chave (ausente,
    inválida, válida) e branching de erro da API (401, 429, 402/insufficient
    _quota) com `fetch` de `GET /v1/models` mockado.
  - `openai/pipeline.ts` — `processAudio`: branching das flags
    transcrever/formatar sobre respostas mockadas de STT/format.
  - `glossary.ts` — `correctText`: autocorreção pura.
  - Máquina de estados do widget (`useRecording`) — ocioso → ouvindo →
    refinando → colado, mockando as fronteiras (IPC/nativo).
- **Mocks de fronteira:** `vi.mock` para `electron` (incl. `safeStorage`),
  `uiohook-napi`, nut.js e o cliente OpenAI — sem rede, sem nativo, sem secret.
- **CI:** job dedicado no **ubuntu-latest** rodando `npm run test:coverage` em
  todo PR e push na `main`; sobe o relatório pro **Codecov** (secret
  `CODECOV_TOKEN`) e o **badge** vai no README.
- **Scripts:** `npm test` (watch/run) e `npm run test:coverage` (com gate).

## Scope
### In
- Vitest + happy-dom + `@vitest/coverage-v8` configurados.
- Gate de cobertura 85% via `thresholds` incidindo só na lógica pura (`include`).
- Testes dos módulos puros do main + máquina de estados do widget.
- Job de testes no CI (ubuntu) barrando merge + upload Codecov + badge no README.

### Out
- **E2E (Playwright + Electron)** — vira card separado (áudio fake, xvfb, hook
  IPC de teste, pipeline ponta a ponta com OpenAI mockada).
- Testes de componente/RTL (Pill, Waveform, etc.) — não entram no denominador do
  gate; opcionais depois.
- Matriz macOS/Windows, smoke test do binário empacotado.

## Subtasks
- [x] Bootstrap do Vitest: instalar `vitest`, `@vitest/coverage-v8`,
  `happy-dom`, RTL; criar `vitest.config.ts`; adicionar scripts `test` e
  `test:coverage`.
- [x] Configurar o gate: `coverage-v8` com `include` só na lógica pura e
  `thresholds` 85% (lines/functions/branches/statements) que quebram o build.
- [x] Testar o main puro: `key.ts` (estados da chave + 401/429/402 com
  `/v1/models` mockado), `pipeline.ts` (branching transcrever/formatar),
  `shared/glossary.ts` (`applyCorrections` — a lógica pura de autocorreção).
- [x] Testar a máquina de estados do widget (`state/widget.ts`:
  idle→listening→transcribing→error, com fake timers).
- [x] CI: job no ubuntu-latest rodando `test:coverage` (barra merge) + upload
  Codecov (`CODECOV_TOKEN`) + badge no README.
