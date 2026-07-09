# Documentação do projeto — Delta

## Added

- README raiz real (visão, stack, pré-requisitos Windows/Node 20+, comandos,
  guia da chave da OpenAI, nota de privacidade, badges de build/download).
- README por pasta de responsabilidade: `src/main`, `src/preload`,
  `src/renderer`, `src/renderer/components`, cada feature em
  `src/renderer/features`, `src/shared`.
- `docs/architecture.md` (diagramas Mermaid: camadas, push-to-talk, pipeline
  STT → autocorreção → formatação → colar).
- `docs/permissions.md` (Windows-first: microfone; macOS como "planejado").
- `docs/adr/` com 3 ADRs: Electron, `uiohook-napi` (keyup global), PowerShell
  `SendKeys` (colar).
- `.env.example` dev-only + guarda no `.gitignore` (`.env`, `.env.*`).
- JSDoc nos contratos de `src/shared` (contrato `WidgetApi`, tipos de resultado,
  campos de `history`).

## Changed

- README raiz: de boilerplate "scaffold" → documentação real do PSTranscribe.

## Notes

- Só o estado atual foi documentado; transcrição em tempo real (WIP/desligada por
  flag) ficou fora.
- Sem alterações de código de app. 2 avisos de lint pré-existentes
  (`flushPasteQueue`, `SettingsWindow.tsx`) permanecem — fora do escopo de docs.
