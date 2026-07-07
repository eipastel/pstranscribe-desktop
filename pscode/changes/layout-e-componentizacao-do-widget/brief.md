# layout e componentização do widget

## Objective
Trazer o widget do design vivo para React: todos os estados visuais fiéis ao design, dirigidos por mock (sem áudio real).

## Expected behavior
- Design importado/traduzido fielmente de VoiceWidget.dc.html (fonte obrigatória):
  https://claude.ai/design/p/0448d20f-00ed-4946-8a09-6a6f0d32e4e3?file=VoiceWidget.dc.html
  (VoiceSettings.dc.html é referência de tokens/estilo; a tela vem na batch 5).
- Componentes reutilizáveis, cada um na sua pasta, responsabilidade única:
  Pill (container glass), Waveform, StatusLabel, Timer, TranscriptPreview, CheckIcon.
- Primitivos de formulário reutilizáveis: Input (campo glass), Toggle, Button, StatusDot —
  batch 4 (chave OpenAI) e batch 5 (settings) só consomem.
- Estados de validação (ok / erro / verificando) dos primitivos dentro do grayscale —
  sem vermelho/verde; erro/sucesso via texto, peso, dot sutil, ícone.
- Design tokens centralizados (cinzas, blur, sombras, spacing) — zero valor hardcoded espalhado.
- Organização: `features/` + `components/` + `hooks/`.
- 4 estados só visuais: ocioso → ouvindo (onda animada) → refinando (shimmer) → colado (check).
- Máquina de estados no renderer (reducer/xstate leve), avançando via mock/clique.
- Dark glass em tons de cinza, sem cor de destaque, crescendo para baixo com largura fixa.
- Respeitar `prefers-reduced-motion` e foco de teclado.

## Out of scope
- Áudio real.
- Keybind global.
- Tela de settings (batch 5).
