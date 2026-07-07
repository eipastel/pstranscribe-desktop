# fundação electron + janela flutuante — Delta

## Added
- Projeto Electron + React + Vite + TypeScript na raiz (electron-vite 5, Electron 39, React 19); `npm run dev` com HMR no renderer e hot-reload no main (`--watch`).
- Estrutura de pastas: `src/main` (windows/, ipc/), `src/preload`, `src/renderer` (components/, features/, hooks/, state/, styles/), `src/shared`, `resources/`.
- Janela widget (`src/main/windows/widget.ts`): 400×60, transparente, sem frame, alwaysOnTop, skipTaskbar, não focável, click-through (`setIgnoreMouseEvents(true, { forward: true })`), posicionada no centro horizontal com topo a 15% da altura do monitor primário.
- Ponte IPC segura: contrato compartilhado em `src/shared/ipc.ts`; preload expõe só `window.api.ping()` via contextBridge; handler em `src/main/ipc/handlers.ts`.
- Renderer mínimo: pílula translúcida (`.pill`, rgba 0.35) com `data-status` vindo do store Zustand `useWidgetStore` (idle | recording | transcribing).
- Tooling: ESLint + Prettier (do template), alias `@/` → `src/renderer`, electron-builder configurado para Windows (appId `com.eipastel.pstranscribe`, sem empacotar).

## Removed
- UI e exposição genérica do template (`Versions.tsx`, svgs, `electronAPI`/`@electron-toolkit/preload`); alvos mac/linux do electron-builder e scripts `build:mac`/`build:linux` (alvo é só Windows).
