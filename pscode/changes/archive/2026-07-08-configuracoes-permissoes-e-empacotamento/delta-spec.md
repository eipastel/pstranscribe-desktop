# configurações, permissões e empacotamento — Delta

## Added
- Bandeja do sistema (`main/tray.ts`): menu Configurações/Sair (o app passa a ter encerramento próprio); duplo-clique abre as configurações.
- Janela de settings glass própria (`windows/settings.ts` + `features/settings/`, hash `#settings` na mesma SPA), fiel a VoiceSettings.dc.html: toggles Transcrever/Formatar ligados ao pipeline (Formatar esmaece com Transcrever off), atalho editável com captura (`useKeybindCapture`), chave OpenAI mascarada `sk-…últimos4` com Substituir/Remover, toggle "Iniciar com o Windows" (`setLoginItemSettings`) e slider nativo de opacidade (0.5–1, `setOpacity` ao vivo); fecha no X/Esc.
- IPC: `settings:update` (nunca aceita a chave), `settings:changed` broadcast, `key:masked` (só os 4 últimos saem do main), `key:changed` broadcast — widget reage na hora a chave/atalho.
- PTT re-registra o keybind ao vivo (`setPttKeybind`), sem reiniciar o app.
- Onboarding de primeiro uso na janela do widget (`features/onboarding/`): chave → atalho → mini-tutorial, com dots; `onboarded` persistido (quem já passou vê só a porta se remover a chave).
- Settings novos: `autoLaunch` (off), `opacity` (1), `onboarded` (false) — migração automática por merge com defaults.
- Empacotamento: ícone próprio (mic em dark glass, gerado em build/icon.png + resources/icon.png), instalador NSIS one-click via `npm run build:win` (`dist/pstranscribe-desktop-0.1.0-setup.exe`); smoke test do empacotado rodou o pipeline completo (PTT → STT → formatação → paste).

## Changed
- `settings:get` agora devolve `PublicSettings` — o ciphertext da chave não sai mais do main por nenhum canal.

## Removed
- Ícones do template electron-vite (`build/icon.ico`/`.icns` — o builder gera do PNG).
