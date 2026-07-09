# CI e pipeline de release no GitHub

## Objetivo
Transformar release num comando: dar uma tag `v*` e sair um instalador pronto,
publicado no GitHub Releases, com link fixo para a landing page apontar.

## Comportamento esperado
- CI em todo PR (GitHub Actions): lint + typecheck + build; barra merge se quebrar.
- Sem secret da OpenAI no CI (modelo BYO-key): pipeline nunca faz chamada real.
- Workflow de release disparado por tag `v*`, buildando os instaladores.
- electron-builder com `publish: github` — artefatos sobem como GitHub Release
  (com `latest.yml` que o auto-update precisa).
- Link fixo para a landing: `releases/latest/download/<asset>` — URL estável.
- Versionamento via conventional commits + changelog automático + bump por tag.
- Templates de issue e PR em `.github/`.
- Auto-update opcional via electron-updater lendo dos próprios GitHub Releases.
- Pipeline pronto para secrets de assinatura, ativável quando houver certificados.
- Badges no README (build passing, versão, download).

## Entregável
`git tag v0.1.0 && git push --tags` → CI builda o instalador → publicado no
GitHub Releases → landing baixa pelo link `latest`.

## Fora de escopo
- Assinatura real de código com certificados.
- A landing page em si.
