# Questions

- [x] Como mockar a OpenAI (roda no MAIN)? → **Injetar fakes** no boundary
  (`stt`/`format`/`validateApiKey` + `/v1/models`) sob o modo E2E.
- [x] Tamanho do card? → **Espinha primeiro**: harness + 1 fluxo ponta a ponta +
  job no CI. Settings/chave/posição da janela ficam para depois.
- [x] Pode adicionar código de produção só para teste? → **Sim**, canal IPC de
  teste + fakes, gated por `PSTRANSCRIBE_E2E=1`, inerte em produção.
- [x] Job E2E barra o merge? → **Sim** (ubuntu + xvfb, todo PR), traces em falha.
