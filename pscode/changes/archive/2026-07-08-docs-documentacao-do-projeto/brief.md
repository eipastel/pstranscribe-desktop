# Documentação do projeto

## Objetivo
Deixar o projeto autoexplicável: qualquer pessoa (ou o você de daqui a 3 meses)
entende a arquitetura e roda sem adivinhar nada. Onboarding em minutos.

## Comportamento esperado
- README raiz: o que é o app, stack, pré-requisitos (Node, permissões de OS),
  comandos de dev/build/package, badges de build/download.
- README por pasta de responsabilidade (todas as pastas reais): `src/main`,
  `src/preload`, `src/renderer`, `src/renderer/components`, cada feature em
  `src/renderer/features`, `src/shared`.
- `docs/architecture.md`: diagrama main↔preload↔renderer, fluxo push-to-talk e
  pipeline STT → formatação → colar.
- `docs/permissions.md`: **Windows-first** (microfone). macOS aparece só como
  nota de "planejado".
- `.env.example` **só para dev/teste local** — o usuário final digita a chave da
  OpenAI no app (guardada com `safeStorage`). README deixa isso explícito.
- Pointer curto de "como pegar sua chave da OpenAI" + nota de privacidade (áudio
  vai para a OpenAI sob a conta/chave do próprio usuário, sem servidor nosso).
- JSDoc nos contratos de `src/shared` como documentação viva.
- `docs/adr/`: 1 arquivo por decisão-chave (Electron, uiohook pro keyup,
  PowerShell SendKeys pra colar).

## Fora de escopo
- Código do app e pipeline de release.
- Documentar features WIP/desativadas (ex.: transcrição em tempo real) —
  documentar **só o que está no ar**.
- Suporte macOS além de uma nota curta de "planejado".
