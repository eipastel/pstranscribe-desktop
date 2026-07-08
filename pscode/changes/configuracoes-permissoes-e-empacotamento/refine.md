# configurações, permissões e empacotamento

## Summary
App configurável e distribuível: tray com menu, janela de configurações fiel ao design (toggles, chave mascarada, keybind editável, auto-launch, opacidade), onboarding de primeiro uso em passos e instalador Windows.

## Technical detail
- Fonte fiel: `VoiceSettings.dc.html` (archive da batch 2) — painel 452px, phead/gear, srows com Toggle iOS grayscale; linha "Formatar" esmaece quando "Transcrever" desliga.
- Tray (`Tray` + `Menu` no main): Configurações e Sair; abre a janela de settings (glass própria, frame:false, ~500×560, focável, fecha no X/Esc).
- Settings IPC: `settings:update` (toggles, keybind, opacidade, auto-launch) + os canais de chave existentes; PTT re-registra o listener ao trocar o keybind (sem reiniciar o app).
- Chave na tela: mascarada `sk-…abcd` (main devolve só os 4 últimos — a chave nunca vai inteira ao renderer), substituir (re-valida via key:set) e remover.
- Keybind editável: campo de captura (keydown na janela de settings) → persiste → keycap do widget atualiza.
- Toggles ligados ao pipeline real (flags da batch 4); auto-launch via `app.setLoginItemSettings`; opacidade ajustável aplicada ao glass do widget.
- Onboarding no widget (primeiro uso): chave (porta atual) → capturar keybind → mini-tutorial ("segure X e fale"); mic o Windows pede no primeiro getUserMedia.
- Persistência: módulo settings.json próprio (sem electron-store); caveat safeStorage/DPAPI registrado.
- Empacotar: ícone, `npm run build:win` gerando instalador NSIS; smoke test do instalado.

## Scope
### In
- Tray, janela de settings fiel ao design, gestão da chave mascarada, keybind editável ao vivo, toggles reais, auto-launch, opacidade, onboarding em passos, polish (foco/reduced-motion/edge cases), instalador Windows.
### Out
- macOS/Linux, backend proxy, auto-update, diarização/modelos pela UI.

## Subtasks
- [x] Tray com menu (Configurações/Sair) + janela de settings glass vazia abrindo/fechando
- [x] Tela de settings fiel ao design: toggles Transcrever/Formatar ligados ao pipeline + IPC settings:update
- [x] Gestão da chave na tela: mascarada sk-…últimos4, substituir e remover
- [ ] Keybind editável com captura na UI + PTT re-registrando ao vivo + keycap atualizado
- [ ] Auto-launch com toggle + opacidade ajustável do widget
- [ ] Onboarding de primeiro uso: chave → keybind → mini-tutorial na janela do widget
- [ ] Empacotamento: ícone + instalador NSIS via build:win + smoke test do instalado
