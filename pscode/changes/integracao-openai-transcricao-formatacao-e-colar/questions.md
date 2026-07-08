# Grill Me
- [x] Porta da chave no primeiro uso? — No próprio widget: sem chave válida, a pílula vira painel glass com Input + Salvar; após validar, volta ao idle.
- [x] Transcrição ok mas formatação falhou? — Cola o texto bruto (degrada com elegância), hint discreto avisa.
- [x] Idioma do STT? — `language: 'pt'` fixo.
- [x] Arquitetura (decisão técnica): chamadas OpenAI no main process — CSP do renderer bloqueia fetch externo e a chave nunca sai do main (safeStorage).
