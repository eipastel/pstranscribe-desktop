# Documentação do projeto

## Summary
Documentar o app de ponta a ponta — README raiz, um README por pasta de
responsabilidade, docs de arquitetura e permissões — para que qualquer pessoa
entenda o projeto e o rode em minutos, sem adivinhar nada.

## Technical detail
- **Windows-first**: o app builda só Windows (`build:win`) e o paste usa
  PowerShell `SendKeys`. macOS entra apenas como nota de "planejado".
- **Só o estado real**: documentar o fluxo push-to-talk que funciona hoje
  (`ptt.ts` via `uiohook-napi` → grava → pipeline STT → `paste.ts`). Transcrição
  em tempo real (`openai/realtime.ts`) está WIP/desativada por flag → fora.
- **Pastas reais a cobrir**: `src/main` (windows, ipc, ptt, paste, openai,
  settings, glossary, history, tray), `src/preload`, `src/renderer` (App,
  components, features, hooks, state, styles), `src/renderer/components` (10
  componentes), `src/renderer/features` (app-shell, concepts, cost, key-gate,
  onboarding, settings, voice-widget), `src/shared` (contratos main↔renderer).
- **Chave da OpenAI**: usuário final digita no app (guardada com `safeStorage`).
  `.env.example` é só dev/teste local — README precisa deixar isso explícito.
- **Privacidade**: áudio vai para a OpenAI sob a conta/chave do próprio usuário,
  sem passar por servidor nosso.
- **ADRs**: Electron (vs Tauri), `uiohook-napi` pro keyup global, PowerShell
  SendKeys pra colar (nut.js virou pago).

## Scope
### In
- README raiz reescrito + `.env.example` + badges.
- README em cada pasta de responsabilidade real.
- `docs/architecture.md`, `docs/permissions.md`, `docs/adr/`.
- JSDoc nos contratos de `src/shared`.

### Out
- Código do app e pipeline de release.
- Features WIP/desativadas (realtime STT).
- Suporte macOS além da nota de "planejado".

## Subtasks
- [x] README raiz: visão do app, stack, pré-requisitos (Node, Windows), comandos dev/build, `.env` só-dev, guia "como pegar sua chave da OpenAI", nota de privacidade, badges de build/download
- [x] `.env.example` para dev/teste local (deixando claro que o usuário final não usa)
- [x] README por camada: `src/main`, `src/preload`, `src/renderer`, `src/shared`
- [x] README por pasta de UI: `src/renderer/components` + cada feature em `src/renderer/features`
- [x] `docs/architecture.md`: diagrama main↔preload↔renderer, fluxo push-to-talk e pipeline STT → formatação → colar
- [x] `docs/permissions.md`: Windows-first (microfone); macOS como nota de "planejado"
- [x] JSDoc nos contratos de `src/shared` como documentação viva
- [x] `docs/adr/`: 1 arquivo por decisão (Electron, uiohook keyup, PowerShell SendKeys)
