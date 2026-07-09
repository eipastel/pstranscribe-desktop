# Keybind para ativar transcrição contínua — Delta

## Added
- Atalho global de toque (padrão **Ctrl+Shift+Space**): 1º toque começa a ouvir
  (emite `PTT_PRESS`), 2º toque transcreve e cola (emite `PTT_RELEASE`),
  reaproveitando todo o pipeline do push-to-talk.
- Campo `keybindContinuo: Keybind` em `Settings`/`DEFAULT_SETTINGS`, herdado por
  usuários existentes via merge com os defaults.
- Auto-stop de segurança: teto fixo (~2 min) que emite `PTT_RELEASE` sozinho,
  protegendo contra o limite ~25MB do STT quando o modo contínuo fica ligado.
- Linha "Atalho contínuo" nas Configurações, com captura/exibição do atalho.

## Changed
- `KeybindRow` passou a ser parametrizado (`field`/`label`/`desc`), servindo
  tanto ao atalho de falar quanto ao contínuo.
- `ptt.ts` mantém estado próprio do toggle (`listening`) com debounce de
  auto-repeat e **exclusão mútua** com o hold-to-talk: um ignora o outro
  enquanto o outro está ativo.
