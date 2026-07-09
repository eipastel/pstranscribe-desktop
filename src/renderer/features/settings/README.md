# settings — configurações

A aba de Configurações (dentro do `app-shell`). Edita o keybind push-to-talk, a
chave da OpenAI e as flags de comportamento (transcrever, formatar, resposta
rápida, opacidade).

- **`SettingsWindow.tsx`** — a tela.
- **`useSettings.ts`** — carrega os settings no mount e salva a cada mudança via
  `window.api.updateSettings`.
- **`KeyRow.tsx`** — linha da chave da OpenAI (definir/limpar, exibe mascarada).
- **`KeybindRow.tsx`** — captura e edição do atalho global.

O estado real vive no main (`settings.json`); esta feature é a UI que o edita.
