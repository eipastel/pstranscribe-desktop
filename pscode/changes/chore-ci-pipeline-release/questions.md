# Perguntas

- [x] **Plataformas do release?** → Só Windows (matriz `windows-latest`; macOS
  fica para card futuro, quando houver config `mac:` e teste em Mac).
- [x] **Infra de versionamento?** → Mínima: a tag `v*` dirige a versão do build.
  Sem Husky/commitlint/changelog automático.
- [x] **Auto-update entra agora?** → Sim: adicionar electron-updater e fiar a
  checagem no main process, lendo dos GitHub Releases.
