# Grill Me
- [x] Como abrir as configurações? — Ícone na bandeja do sistema (menu Configurações/Sair).
- [x] Onde a tela vive? — Janela glass própria, sem frame (~452px do design não cabe na janela do widget).
- [x] electron-store? — Não: manter o módulo settings.json próprio (já cobre toggles/keybind/chave cifrada).
- [x] Auto-launch? — Incluir com toggle (`app.setLoginItemSettings`).
- [x] Onboarding? — Na janela do widget, evoluindo a porta da batch 4: chave → capturar keybind → mini-tutorial; mic o Windows autoriza no primeiro getUserMedia.
- [x] (herdado da batch 1) Alvo Windows — permissões macOS/Accessibility fora de escopo.
