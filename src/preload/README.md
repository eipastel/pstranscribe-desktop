# src/preload — a bridge main ↔ renderer

A ponte segura entre o processo principal e a UI. Com `contextIsolation` sempre
ativo, o renderer **não** tem acesso a Node nem ao `ipcRenderer` cru — só ao
objeto `window.api` que este preload expõe via `contextBridge`.

## O contrato

[`index.ts`](index.ts) monta um objeto `api` do tipo `WidgetApi` (definido em
[`../shared/ipc.ts`](../shared/ipc.ts)) e o injeta em `window.api`. Cada método
é um wrapper fino sobre um canal IPC:

- **`invoke`** — chamadas com resposta (ex.: `getSettings`, `setApiKey`,
  `processAudio`).
- **`send`** — avisos sem resposta (ex.: `setIgnoreMouseEvents`).
- **`on…`** — assinaturas de eventos vindos do main (ex.: `onPttPress`,
  `onSettingsChanged`, `onKeyChanged`); retornam uma função de cleanup.

[`index.d.ts`](index.d.ts) declara `window.api` para o TypeScript do renderer.

**Por que existe:** é o único ponto onde decidimos o que o main deixa a UI fazer.
Nada entra no renderer sem passar por aqui — expõe o mínimo necessário, nunca o
`ipcRenderer` inteiro. Ao adicionar um canal, atualize os três: o handler no main,
o tipo `WidgetApi` no shared e o wrapper aqui.
