# CI e pipeline de release no GitHub — Delta

## Added
- CI (`.github/workflows/ci.yml`): em PR e push na `main`, roda lint + typecheck
  + build em `windows-latest`; merge barrado se algum check falhar.
- Release (`.github/workflows/release.yml`): tag `v*` builda o instalador Windows
  e publica no Releases com `latest.yml` para o auto-update.
- Auto-update via `electron-updater` (`checkForUpdatesAndNotify()` no
  `app.whenReady()`); `dev-app-update.yml` para desenvolvimento.
- Bloco `publish: github` no `electron-builder.yml`.
- Templates de issue/PR em `.github/` e badges (build, versão, download `latest`)
  no README.
- Auto-bump da versão do `package.json` após cada release.

## Changed
- Pipeline de assinatura pronta via env (`CSC_LINK`/`CSC_KEY_PASSWORD`); até
  configurar os secrets, o instalador sai não-assinado.

## Removed
- Nada.
