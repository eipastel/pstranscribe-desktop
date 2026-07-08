# Grill Me — decisões

- [x] **Duração do áudio** → reusar `elapsed` do widget (segundos do push-to-talk).
- [x] **Custos contabilizados** → STT **+** formatação (capturar modelo do STT e
  `usage` de tokens da formatação, hoje descartados).
- [x] **Preços** → constantes fixas em USD por modelo, no código.
- [x] **Tela/Histórico** → métricas agregadas + lista (data, duração, modelo,
  custo); **sem** guardar o texto transcrito.

## Em aberto
- [ ] Retenção do histórico: por ora sem limite (array JSON). Revisar se crescer.
