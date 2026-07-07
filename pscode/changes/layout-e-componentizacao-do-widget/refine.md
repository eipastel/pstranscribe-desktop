# layout e componentização do widget

## Summary
O widget do design vivo em React: pílula dark glass com 4 estados visuais (ocioso → ouvindo → refinando → colado), transicionando por mock/clique, fiel ao design. Primitivos de formulário prontos para as batches 4 e 5.

## Technical detail
- Fonte fiel: `design/VoiceWidget.dc.html` (+ `VoiceSettings.dc.html` para tokens de painel/toggle), extraídos na pasta da change.
- Tokens do design: glass `rgba(30,30,33,.62)` + blur 34px, borda `rgba(255,255,255,.14)`, sombra dupla, easing `cubic-bezier(.32,.72,0,1)` .42s — centralizados em CSS custom properties (`styles/tokens.css`), zero valor solto.
- Pílula (variante pill apenas): 460px fixos; alturas 64 (idle/listening/done) e 104 (transcribing), radius 16/18, crescendo para baixo; hint 11.5px abaixo.
- Peças: Pill, Waveform (32 barras, delays escalonados), StatusLabel, Timer (tabular-nums), TranscriptPreview (shimmer), CheckIcon — uma pasta por componente em `components/`; composição em `features/voice-widget/`.
- Máquina de estados no `useWidgetStore` (Zustand): idle→listening→transcribing→done, timer por interval, transcribing→done por timeout mock (2.1s), textos mock do design.
- Janela: 520×220 fixa e transparente; click-through com toggle por hover na pílula via IPC (`setIgnoreMouseEvents` + `forward: true`).
- `prefers-reduced-motion` (desligar waveform/pulse/shimmer) e foco de teclado (pílula focável, Enter/Space avança) desde já.
- Primitivos de formulário em grayscale: Input glass, Toggle (track branco/knob escuro do VoiceSettings), Button, StatusDot — com estados ok/erro/verificando sem vermelho/verde.

## Scope
### In
- Tokens, componentes do widget, máquina de estados mock, composição fiel dos 4 estados, ajuste da janela + hover-toggle de clique, primitivos de formulário com validação grayscale.
### Out
- Áudio real, keybind global, tela de settings (batch 5), variante card, integração OpenAI.

## Subtasks
- [x] Tokens de design centralizados em `styles/tokens.css`, extraídos de VoiceWidget/VoiceSettings
- [ ] Componentes do widget: Pill, Waveform, StatusLabel, Timer, TranscriptPreview, CheckIcon
- [ ] Máquina de estados no Zustand (idle→listening→transcribing→done) com timer e avanço por mock
- [ ] Composição VoiceWidget: 4 estados fiéis ao design, hint, reduced-motion e foco de teclado
- [ ] Janela 520×220 + click-through com toggle por hover via IPC
- [ ] Primitivos de formulário: Input, Toggle, Button, StatusDot com ok/erro/verificando em grayscale
