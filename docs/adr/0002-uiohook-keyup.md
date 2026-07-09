# 0002 — `uiohook-napi` para o keybind global

**Status:** aceito

## Contexto

O push-to-talk precisa detectar **keydown e keyup** de um atalho **globalmente**,
com o app em background. O `globalShortcut` do Electron dispara só no acionamento
(não dá o `keyup`) — inútil para "segure para falar, solte para processar".

## Decisão

Usar **`uiohook-napi`**, um hook nativo de teclado/mouse que emite `keydown` e
`keyup` de todo o sistema. `ptt.ts` mapeia a tecla via `UiohookKey`, marca
`held` no press e dispara `press`/`release` para o renderer.

## Consequências

- **A favor:** ganha o `keyup` que o `globalShortcut` não dá; troca o atalho ao
  vivo sem reiniciar o hook.
- **Contra:** módulo nativo (precisa de `electron-builder install-app-deps` /
  rebuild). Antivírus podem estranhar um hook global de teclado.
