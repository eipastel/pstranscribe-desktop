# PSTranscribe

> Widget flutuante de transcrição por voz para Windows.

![Plataforma](https://img.shields.io/badge/plataforma-Windows-0078D6)
![Electron](https://img.shields.io/badge/Electron-React%20%2B%20TS-47848F)
[![Build](https://img.shields.io/github/actions/workflow/status/eipastel/pstranscribe-desktop/build.yml?branch=main)](https://github.com/eipastel/pstranscribe-desktop/actions)
[![Download](https://img.shields.io/github/v/release/eipastel/pstranscribe-desktop?label=download)](https://github.com/eipastel/pstranscribe-desktop/releases/latest)

<!-- TODO(#6): trocar o placeholder por um GIF do fluxo push-to-talk quando o release sair -->

## O que é

Segure uma tecla, fale, solte — o texto transcrito é colado no campo em foco de
qualquer aplicativo. Um widget pequeno e sempre-no-topo mostra o status enquanto
grava e processa. A transcrição usa a API da OpenAI sob **a sua própria chave**.

**Fluxo push-to-talk:** `keydown` → grava áudio → `keyup` → STT
(`gpt-4o-transcribe`, com fallback) → autocorreção local pelo glossário →
formatação (`gpt-5.4-mini`) → colar via `Ctrl+V` simulado.

## Stack

- **[Electron](https://www.electronjs.org/) + [electron-vite](https://electron-vite.org/)** — shell desktop e bundler.
- **React + TypeScript** — a UI (renderer).
- **[zustand](https://github.com/pmndrs/zustand)** — estado da UI.
- **[uiohook-napi](https://github.com/SnosMe/uiohook-napi)** — hook global de teclado (o keybind push-to-talk).
- **OpenAI API** — STT e formatação (chave do próprio usuário).

## Pré-requisitos

- **Windows** (única plataforma suportada hoje — o paste usa PowerShell `SendKeys`).
- **Node 20+** e npm.
- Uma **chave da API da OpenAI** — veja abaixo.

## Rodando o projeto

```bash
npm install        # instala deps + rebuild dos módulos nativos (uiohook)
npm run dev        # app em modo desenvolvimento (hot reload)
npm run build:win  # gera o instalador NSIS em dist/
```

Verificações: `npm run typecheck`, `npm run lint`, `npm run format`.

## Chave da OpenAI

**O usuário final NÃO usa `.env`.** A chave é digitada dentro do app, na primeira
execução, e guardada **criptografada** no disco com o
[`safeStorage`](https://www.electronjs.org/docs/latest/api/safe-storage) do
Electron — nunca em texto puro, nunca commitada.

O arquivo `.env.example` existe **só para dev/teste local**.

### Como pegar sua chave

1. Acesse <https://platform.openai.com/api-keys>.
2. Clique em **Create new secret key**, copie o valor (`sk-...`).
3. Cole no app quando ele pedir. Pronto.

## Privacidade

O áudio vai direto para a OpenAI, autenticado pela **conta/chave do próprio
usuário**. Ele **não passa por nenhum servidor nosso** — não há backend
intermediário, não guardamos áudio nem transcrições.

## Documentação

- [`docs/architecture.md`](docs/architecture.md) — como main, preload e renderer se conversam.
- [`docs/permissions.md`](docs/permissions.md) — permissões de sistema (microfone).
- [`docs/adr/`](docs/adr/) — decisões-chave de arquitetura.
- README em cada pasta de `src/` descreve a responsabilidade daquela camada.
