# src/renderer — a UI (React)

A interface, em React + TypeScript. Roda no processo de renderização, sem acesso
ao SO: tudo que precisa do sistema vem de `window.api` (veja
[`../preload`](../preload)).

## Roteamento por janela

Não há router. [`App.tsx`](App.tsx) escolhe a tela pelo hash da URL, porque cada
`BrowserWindow` do main carrega um hash diferente:

- **sem hash** — o widget: `Onboarding` → `KeyGate` → `VoiceWidget`, conforme o
  usuário já passou pelo onboarding e tem chave.
- **`#app`** — `AppShell` (Configurações e Custos).
- **`#conceitos`** — `ConceptsWindow` (revisão do glossário).

## Estrutura

- **`features/`** — cada feature é dona do seu estado e fluxo. Uma pasta por
  feature (`voice-widget`, `settings`, `cost`, `onboarding`, `key-gate`,
  `concepts`, `app-shell`). Veja [`features/README.md`](features/README.md).
- **`components/`** — componentes reutilizáveis, burros, sem lógica de negócio.
  Veja [`components/README.md`](components/README.md).
- **`hooks/`** — hooks compartilhados (`useClickThrough`, `useKeybindCapture`).
- **`state/`** — store zustand (`widget.ts`) com o estado global da UI.
- **`styles/`** — `tokens.css` (design tokens) e `main.css` (base global).

O alias `@/` aponta para esta pasta (`src/renderer`).
