# key-gate — porteiro da chave

O bloqueio mostrado quando o usuário já passou pelo onboarding mas **não há
chave da OpenAI** (ex.: foi removida nas Configurações). Sem chave, o app não
transcreve — então esta tela pede e valida a chave antes de liberar o widget.

- **`KeyGate.tsx`** — o formulário da chave; ao salvar uma chave válida
  (`window.api.setApiKey`), o `App` volta a renderizar o `VoiceWidget`.
