# Configurações com largura da pílula e altura sem corte — Delta

## Changed
- Painel de configurações (`.settings-panel`): largura `452px` → `var(--pill-width)`
  (460px), igualando a largura da pílula.
- Janela de configurações (`openSettingsWindow`): `500×560` → `520×660` —
  largura acompanha o widget (folga pro shadow do vidro) e altura cabe o painel
  inteiro (mede ~598px) sem cortar o último row ("Chave OpenAI").
