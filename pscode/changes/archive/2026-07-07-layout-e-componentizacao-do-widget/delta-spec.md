# layout e componentização do widget — Delta

## Added
- Design tokens em `src/renderer/styles/tokens.css` (tipografia, cores grayscale, vidro, superfícies, toggle, movimento, dimensões da pílula), extraídos de `design/VoiceWidget.dc.html` e `VoiceSettings.dc.html`.
- Componentes do widget, um por pasta em `components/`: Pill (button glass que morfa altura/radius), Waveform (64 barras em 100% da largura, para com reduced-motion), StatusLabel, Timer (m:ss tabular), TranscriptPreview (shimmer), CheckIcon (chip `.icon-chip` reutilizável).
- Máquina de estados no `useWidgetStore` (Zustand): idle → listening (timer 1s) → transcribing (mock 2.1s) → done → idle; clique não interrompe o refino.
- Composição `features/voice-widget/VoiceWidget.tsx`: 4 estados fiéis ao design, hint contextual, keycap ⌥ Space, foco de teclado (button nativo), `prefers-reduced-motion`.
- Primitivos de formulário para batches 4/5: Input (status idle/checking/ok/error), Toggle (switch iOS grayscale do VoiceSettings), Button, StatusDot (sólido/anel/pulso) — validação sem vermelho/verde.
- IPC `set-ignore-mouse-events`: hover na pílula desliga o click-through via `useClickThrough`; fora dela, cliques atravessam.
- `.gitattributes` fixando LF; ESLint ignora `pscode/` e `.claude/`.

## Changed
- Janela do widget: 400×60 → 520×220 (pílula 460px + estado alto + hint + sombra); voltou a ser focável para teclado.
- Status do store: 'recording'/'transcribing' → máquina completa de 4 estados.

## Removed
- `.pill` provisório da batch 1 no `main.css` (substituído pelo componente Pill).
