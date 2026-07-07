# Grill Me
- [x] Clique no widget vs click-through da batch 1? — Toggle por hover via IPC: `forward: true` deixa o renderer detectar hover na pílula e pedir ao main para desligar o ignore; fora dela, cliques atravessam.
- [x] Máquina de estados? — Estender o `useWidgetStore` (Zustand) com idle→listening→transcribing→done; sem xstate.
- [x] Variante pill ou card? — Só pill (card fica de fora; componentes seguem reutilizáveis).
- [x] Dimensionamento da janela? — Fixa no máximo (~520×220, transparente); a pílula cresce para baixo só com CSS, sem resize via IPC.
- [x] Fonte do design? — Os zips foram extraídos em `design/` dentro da change (VoiceWidget.dc.html + VoiceSettings.dc.html + screenshots); usar como fonte fiel.
