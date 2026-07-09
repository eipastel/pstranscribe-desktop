# Arquitetura

PSTranscribe é um app Electron com três processos que só conversam por IPC. O
main é o único com acesso ao SO, ao disco e à chave da OpenAI; o renderer é só
UI; o preload é a ponte estreita entre os dois.

## Camadas

```mermaid
flowchart LR
  subgraph main["main (Node)"]
    ptt["ptt.ts<br/>hook global"]
    pipe["openai/pipeline<br/>STT + formatação"]
    paste["paste.ts"]
    store["settings / glossary / history"]
  end
  preload["preload<br/>window.api (WidgetApi)"]
  subgraph renderer["renderer (React)"]
    widget["voice-widget"]
    app["app-shell: settings · cost · concepts"]
  end

  ptt -- "press / release" --> preload
  preload <-- "invoke / on" --> renderer
  renderer -- "processAudio(blob)" --> preload
  preload --> pipe
  pipe --> paste
  pipe --> store
```

- **main** — `index.ts` registra os handlers de IPC, cria o tray e o widget e
  liga o push-to-talk. Todo acesso a SO/rede/chave passa por aqui.
- **preload** — expõe só `window.api` (tipo `WidgetApi` em `src/shared/ipc.ts`),
  com `contextIsolation` sempre ativo. O renderer nunca vê o `ipcRenderer` cru.
- **renderer** — React, roteado pelo hash da janela (sem hash = widget, `#app` =
  shell, `#conceitos` = glossário).

## Fluxo push-to-talk

```mermaid
sequenceDiagram
  participant OS as Teclado (SO)
  participant PTT as main/ptt.ts
  participant UI as renderer/voice-widget
  participant PIPE as main/openai/pipeline
  participant PASTE as main/paste.ts

  OS->>PTT: keydown (keybind)
  PTT->>UI: press
  UI->>UI: getUserMedia + MediaRecorder (grava)
  OS->>PTT: keyup
  PTT->>UI: release
  UI->>PIPE: processAudio(blob)
  PIPE->>PASTE: texto pronto
  PASTE->>OS: Ctrl+V simulado (cola no app em foco)
```

O keybind vem de `uiohook-napi` (hook global, funciona com o app em background).
A gravação acontece no renderer porque `getUserMedia`/`MediaRecorder` são APIs de
navegador; o áudio bruto (webm/opus) volta ao main para processar.

## Pipeline STT → formatação → colar

`main/openai/pipeline.ts` recebe o áudio e, respeitando as flags dos settings:

1. **STT** (`stt.ts`) — transcreve com `gpt-4o-transcribe` (ou
   `gpt-4o-mini-transcribe` no modo rápido; `whisper-1` como fallback).
2. **Autocorreção** (`glossary.ts`) — corrige termos do glossário no texto bruto,
   localmente, sem rede.
3. **Formatação** (`format.ts`) — `gpt-5.4-mini` pontua e limpa o texto (pulada
   se a flag `formatar` estiver off ou `FORMAT_LOCKED`).
4. **Colar** (`paste.ts`) — coloca o resultado no clipboard, dispara `Ctrl+V` via
   PowerShell `SendKeys` e restaura o clipboard anterior.

O uso é registrado em `history.ts` (métricas, sem o texto — privacidade).

> Transcrição em tempo real (`openai/realtime.ts` + `voice-widget/pcmRecorder.ts`)
> existe mas está **desligada** por flag (`REALTIME_ENABLED = false`) — fora do
> fluxo atual.
