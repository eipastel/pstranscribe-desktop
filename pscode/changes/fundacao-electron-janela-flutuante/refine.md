# fundação electron + janela flutuante

## Summary
Deixar o projeto rodando na raiz do repositório: `npm run dev` abre uma pílula vazia, translúcida e click-through, flutuando no terço superior central da tela (posição estilo Spotlight).

## Technical detail
- Scaffold com electron-vite (Electron + React + Vite + TypeScript) direto na raiz, sem subpasta.
- Alvo: Windows apenas.
- Estrutura: `src/main` (windows/, ipc/), `src/preload`, `src/renderer` (components/, features/, hooks/, state/, styles/), `src/shared`, `resources/`.
- BrowserWindow: `transparent: true`, `frame: false`, `alwaysOnTop: true`, `skipTaskbar: true`; ~400×60px, centralizada horizontalmente, topo a ~15% da altura da tela, monitor primário.
- Click-through fixo: `setIgnoreMouseEvents(true, { forward: true })`; opacidade baixa via CSS.
- IPC segura: `contextIsolation: true`, preload expõe só o necessário via contextBridge.
- Tooling: ESLint + Prettier, path aliases `@/`, hot-reload no main e no renderer.
- Zustand instalado com um store de exemplo em `state/`.
- electron-builder configurado (empacotamento real fica para a batch 5).

## Scope
### In
- Scaffold, tooling, estrutura de pastas, janela flutuante click-through, ponte IPC, config do electron-builder.
### Out
- Captura de áudio, keybind global, visual final do widget, empacotamento/distribuição real.

## Subtasks
- [ ] Scaffold electron-vite (React + TS) na raiz com a estrutura de pastas definida
- [ ] Tooling: ESLint + Prettier, path aliases `@/`, hot-reload no main e no renderer
- [ ] Janela flutuante: transparente, sem frame, alwaysOnTop, skipTaskbar, posição Spotlight, click-through
- [ ] Preload + IPC segura com contextIsolation e contextBridge mínimo
- [ ] Zustand com store de exemplo em `src/renderer/state/`
- [ ] Configurar electron-builder (sem empacotar)
