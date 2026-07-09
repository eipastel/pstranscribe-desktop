# Keybind para ativar transcrição contínua

## Summary
Um segundo atalho global (padrão Ctrl+Shift+Space) que liga/desliga a
transcrição por toque: aciona uma vez para começar a ouvir, aciona de novo para
transcrever e colar. Funciona exatamente como o "segurar para falar" atual, só
que sem manter a tecla pressionada. Configurável nas Configurações.

## Technical detail
- **Reaproveita o contrato existente PTT_PRESS/PTT_RELEASE.** O toggle não cria
  pipeline novo: no 1º toque emite `PTT_PRESS`, no 2º emite `PTT_RELEASE`. Todo o
  fluxo do renderer (`useRecording` → gravação → `processAudio` → colar) roda
  igual. Como o card #81 (tempo real) também ramifica dentro desse mesmo fluxo,
  o modo contínuo herda o #81 quando existir, sem código extra.
- **`ptt.ts`**: registrar um segundo keybind (`activeToggle`). No `keydown` que
  casa a combinação, debounce do auto-repeat (flag `toggleDown`) e alterna
  `listening`: liga → `PTT_PRESS` + arma auto-stop; desliga → `PTT_RELEASE` +
  limpa timer. `keyup` só reseta o debounce.
- **Exclusão mútua com o hold-PTT**: enquanto o toggle está `listening`, ignora o
  hold; enquanto o hold está `held`, ignora o toggle. Evita press/release
  duplicado (o guard de status no store já protege, mas o main precisa manter seu
  próprio estado coerente).
- **Auto-stop de segurança**: `setTimeout` com teto (constante, ~2 min) que emite
  `PTT_RELEASE` e zera `listening` — protege contra o limite ~25MB do STT.
  `ponytail:` teto fixo; virar config se alguém pedir.
- **Settings**: novo campo `keybindContinuo: Keybind` em `Settings` +
  `DEFAULT_SETTINGS` (`{ ctrl, shift, key: 'Space' }`). `captureKey` já suporta
  Space.
- **Live update**: `handlers.ts` chama um `setToggleKeybind` quando o patch traz
  `keybindContinuo`, análogo ao `setPttKeybind` já existente. `index.ts` passa o
  keybind na inicialização.
- **UI**: parametrizar `KeybindRow` (campo/label/descrição) e adicionar uma 2ª
  linha nas Configurações para o atalho contínuo.

## Scope
### In
- Novo keybind global de toggle no `ptt.ts` (emite PTT_PRESS/RELEASE), com
  debounce, exclusão mútua com o hold e auto-stop por tempo.
- Campo `keybindContinuo` em settings (padrão Ctrl+Shift+Space) + live update.
- Linha configurável nas Configurações (KeybindRow parametrizado).

### Out
- Mudar o keybind de push-to-talk existente.
- Transcrição em tempo real/incremental (card #81) — só é reaproveitada, não
  implementada aqui.
- Auto-stop por silêncio ou teto configurável na UI (fica teto fixo por ora).

## Subtasks
- [x] Adicionar `keybindContinuo` a `Settings`/`DEFAULT_SETTINGS` (padrão Ctrl+Shift+Space).
- [x] `ptt.ts`: registrar o keybind de toggle, alternar PTT_PRESS/RELEASE com debounce e exclusão mútua com o hold.
- [x] `ptt.ts`: auto-stop de segurança (teto de tempo) que emite PTT_RELEASE.
- [x] Live update do keybind contínuo (`setToggleKeybind` em `handlers.ts`) e passar na init em `index.ts`.
- [x] Parametrizar `KeybindRow` e adicionar a 2ª linha nas Configurações.
