# Opacidade padrão 100% e settings sempre opaco — Delta

## Changed
- Superfícies "vidro" do widget (Pill, KeyGate, Onboarding) agora abrem **opacas**:
  `--glass-bg` passou de `rgba(30,30,33,0.62)` → `rgb(30,30,33)` (`tokens.css`). O
  `backdrop-blur` permanece no CSS mas fica inerte (decisão "frosted opaco").
- Painel de configurações agora é **sempre opaco**: `.settings-panel` background
  passou de `rgba(26,26,29,0.62)` → `rgb(26,26,29)` (`SettingsWindow.css`),
  mantendo `transparent:true` e os cantos arredondados flutuantes.

## Notes
- "Opacidade afeta só o widget" e "default 100%" já eram verdade no código
  (`setOpacity` só em `getWidgetWindow()`; `DEFAULT_SETTINGS.opacity = 1`) —
  verificados sem regressão, sem mudança de código.
