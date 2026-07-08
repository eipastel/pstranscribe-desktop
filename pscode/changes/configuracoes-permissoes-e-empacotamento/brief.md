# configurações, permissões e empacotamento

## Objective
App configurável e distribuível: tela de settings fiel ao design, gestão da chave, keybind editável, onboarding de primeiro uso e instalador.

## Expected behavior
- Tela de configurações no mesmo dark glass, fiel a VoiceSettings.dc.html
  (fonte obrigatória; já extraída em pscode/changes/archive/2026-07-07-layout-e-componentizacao-do-widget/design/).
- Toggles "Transcrever" e "Formatar" ligados às flags reais do pipeline (batch 4),
  reaproveitando tokens/Toggle da batch 2.
- Gestão da chave OpenAI na mesma tela: ver mascarada (sk-…abcd, só os 4 últimos),
  substituir, remover — chave segue no safeStorage, nunca em texto puro.
- Keybind configurável: capturar a combinação na UI e persistir; PTT re-registra ao vivo.
- Settings persistidos (toggles + keybind) no módulo de settings existente.
- Onboarding de primeiro uso como fluxo único: chave → keybind → permissões → mini-tutorial.
- Permissões: alvo é Windows (decidido na batch 1) — mic no primeiro uso; caveat do
  safeStorage registrado (DPAPI no Windows, ok).
- Polish final: edge cases, foco, reduced motion, opacidade ajustável.
- Empacotar com electron-builder (ícones, instalador Windows); opcional: auto-launch.

## Out of scope
- macOS/Linux (alvo Windows desde a batch 1).
- Backend/proxy para usuário sem chave.
- Auto-update.
