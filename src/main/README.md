# src/main — processo principal (Node/Electron)

Dono do ciclo de vida do app, das janelas e de tudo que toca o sistema
operacional. É o único lugar com acesso a Node, filesystem, rede e à chave da
OpenAI. O renderer nunca fala com o SO direto — sempre via IPC (veja
[`../preload`](../preload)).

Entrada: [`index.ts`](index.ts) — no `app.whenReady()` registra os handlers de
IPC, cria o tray, abre o widget e liga o push-to-talk.

## O que vive aqui

- **`windows/`** — criação das `BrowserWindow`: `widget` (o overlay flutuante),
  `app` (janela de Configurações/Custos) e `concepts` (revisão do glossário).
- **`ipc/handlers.ts`** — registra todos os canais IPC; é a fronteira que o
  preload expõe ao renderer.
- **`ptt.ts`** — hook global de teclado (`uiohook-napi`): detecta o keybind,
  emite `press`/`release` para o renderer gravar. Troca o atalho ao vivo.
- **`paste.ts`** — cola o texto no app em foco (clipboard + `Ctrl+V` simulado
  via PowerShell `SendKeys`), restaurando o clipboard anterior.
- **`openai/`** — integração com a OpenAI: `key` (validação + `safeStorage`),
  `stt` (transcrição), `format` (formatação), `pipeline` (orquestra o fluxo),
  `pricing`, `concepts`. `realtime` é experimental e fica desligado por flag.
- **`settings.ts`** — lê/grava `settings.json` no `userData`.
- **`glossary.ts`** — autocorreção local de termos sobre o texto bruto.
- **`history.ts`** — estatísticas de uso (sem guardar o texto transcrito).
- **`tray.ts`** — ícone da bandeja e menu.
