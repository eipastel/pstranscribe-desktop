# CI e pipeline de release no GitHub

## Summary
Todo PR passa por um check automático (lint + typecheck + build) antes de poder
mergear. Ao dar uma tag `v0.1.0`, o GitHub builda o instalador do Windows e
publica no Releases, com um link fixo `latest` para a landing apontar. O app
passa a se atualizar sozinho lendo desses Releases.

## Technical detail
- **CI** (`.github/workflows/ci.yml`): em `pull_request` e push na `main`, roda
  em `windows-latest` `npm ci` → `npm run lint` → `npm run typecheck` →
  `npm run build`. Sem secret da OpenAI (não há chamada real no build).
- **Release** (`.github/workflows/release.yml`): trigger em tag `v*`, em
  `windows-latest`, buildando o instalador e publicando com
  `electron-builder --win --publish always`. A versão vem da tag; sem bump
  automático de `package.json`.
- **electron-builder.yml**: adicionar bloco `publish` com `provider: github`
  (owner/repo), para subir os artefatos e gerar `latest.yml` (o auto-update
  precisa dele).
- **Auto-update**: adicionar `electron-updater`, chamar
  `autoUpdater.checkForUpdatesAndNotify()` no `app.whenReady()` de
  `src/main/index.ts`, e criar `dev-app-update.yml` (já previsto no `files:`).
- **Assinatura**: electron-builder já lê `CSC_LINK`/`CSC_KEY_PASSWORD` do
  ambiente — o release fica pronto para assinar só adicionando os secrets, sem
  código extra. Até lá o instalador sai não-assinado (Windows mostra aviso).
- **Templates + README**: issue/PR templates em `.github/`; badges de build,
  versão e download (link `releases/latest/download/...`) no README.

## Scope
### In
- Workflows de CI e de release no GitHub Actions (Windows).
- `publish: github` no electron-builder + `latest.yml`.
- Auto-update com electron-updater fiado no main.
- Templates de issue/PR e badges no README.
### Out
- Build/release para macOS.
- Assinatura real com certificados (só deixar o pipeline pronto via env).
- Husky/commitlint/changelog automático e bump de versão.
- A landing page em si.

## Subtasks
- [x] Adicionar bloco `publish` (`provider: github`) no `electron-builder.yml`.
- [x] Criar `.github/workflows/ci.yml` (lint + typecheck + build em PR/push).
- [x] Criar `.github/workflows/release.yml` (tag `v*` → build + publish no Releases).
- [x] Adicionar `electron-updater` e chamar `checkForUpdatesAndNotify()` no main; criar `dev-app-update.yml`.
- [x] Adicionar templates de issue e PR em `.github/`.
- [x] Adicionar badges (build, versão, download `latest`) no README.
