# fundação electron + janela flutuante

## Objective
Colocar o projeto para rodar na raiz do repositório, com uma janela transparente flutuando na posição do Spotlight (terço superior central da tela).

## Expected behavior
- `npm run dev` abre uma pílula vazia, translúcida e click-through, no terço superior central da tela.
- Scaffold Electron + React + Vite + TypeScript na raiz via electron-vite (sem subpasta).
- Tooling: ESLint + Prettier, tsconfig com path aliases (`@/`), hot-reload no main e no renderer.
- Estrutura de pastas: `src/main` (windows/, ipc/), `src/preload`, `src/renderer` (components/, features/, hooks/, state/, styles/), `src/shared`, `resources/`.
- BrowserWindow com `transparent: true`, `frame: false`, `alwaysOnTop: true`, `skipTaskbar: true`.
- Opacidade baixa via CSS + `setIgnoreMouseEvents(true, { forward: true })` para cliques atravessarem o widget.
- Ponte IPC segura: `contextIsolation: true` + preload expondo só o necessário via contextBridge.
- electron-builder configurado (empacotamento real fica para a batch 5).

## Out of scope
- Captura de áudio.
- Keybind global.
- Visual final do widget.
