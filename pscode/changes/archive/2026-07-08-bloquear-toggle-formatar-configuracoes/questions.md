# Perguntas — bloquear toggle Formatar

- [x] Estado visual enquanto bloqueado? → **Desligado + desabilitado** (mostra OFF e não-clicável; não altera o valor salvo).
- [x] Mecanismo do bloqueio? → **Flag/constante única** compartilhada (ex.: `FORMAT_LOCKED`) lida pela UI e pelo pipeline; voltar depois = mudar 1 linha.
