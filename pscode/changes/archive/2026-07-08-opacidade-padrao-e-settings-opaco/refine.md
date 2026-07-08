# Opacidade padrão 100% e settings sempre opaco

## Summary
Hoje o widget e as configurações aparecem como vidro translúcido, deixando o desktop
aparecer atrás mesmo com a opacidade em 100%. Esta mudança faz o app nascer opaco:
o widget fica sólido por padrão e a janela de configurações nunca fica transparente.
O slider de opacidade continua existindo e afeta só o widget.

## Technical detail
- A translucidez vem do **CSS "vidro"**, não da opacidade de janela: `--glass-bg:
  rgba(30,30,33,0.62)` (tokens.css) nas superfícies do widget (Pill, KeyGate,
  Onboarding) e `rgba(26,26,29,0.62)` no `.settings-panel` (SettingsWindow.css).
- Widget → subir o alpha de `--glass-bg` para `1` (mantendo o `backdrop-blur`, que
  fica inerte mas permanece no CSS — decisão "frosted opaco").
- Settings → subir o alpha do fundo do `.settings-panel` para `1`, mantendo
  `transparent:true` e os cantos arredondados flutuantes (só os cantos mostram desktop).
- "Opacidade afeta só o widget" e "default 100%" **já valem**: `handlers.ts:53` faz
  `setOpacity` apenas em `getWidgetWindow()` e `DEFAULT_SETTINGS.opacity = 1`. Só
  garantir que não há regressão — nenhuma mudança de código prevista aqui.

## Scope
### In
- Vidro do widget opaco por default (`--glass-bg` alpha → 1).
- Painel de configurações sempre opaco (`.settings-panel` bg alpha → 1).
- Slider de opacidade 50–100% permanece, widget-only, default 100%.
### Out
- Qualquer mudança de design/layout além da opacidade (cores, blur, raio, sombras).
- Remover o slider de opacidade ou tornar a janela de settings retangular/sólida.

## Subtasks
- [x] Tornar o vidro do widget opaco: `--glass-bg` → `rgba(30,30,33,1)` em `tokens.css`.
- [x] Tornar o painel de settings opaco: fundo do `.settings-panel` → alpha `1` em `SettingsWindow.css`.
- [x] Verificar sem regressão: slider afeta só o widget e default abre 100% opaco (widget e settings).
