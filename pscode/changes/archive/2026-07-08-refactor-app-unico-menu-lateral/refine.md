# Unificar Configurações e Custos em janela única com menu lateral

## Summary
Hoje Configurações e Custos são duas janelas separadas. Esta mudança junta as
duas numa só janela "Aplicativo": um menu lateral à esquerda alterna entre elas
numa mesma área de conteúdo, com um único cabeçalho e botão de fechar. O app
reabre na última tela usada.

## Technical detail
- Nova janela única (`#app`) substitui `openSettingsWindow`/`openCostWindow`.
  Reaproveita o padrão frameless/transparent atual, alargada para ~760px pra
  caber sidebar + conteúdo.
- App.tsx passa a rotear `#app` para um novo `AppShell` que renderiza a sidebar
  (Configurações / Custos) + a tela selecionada.
- `SettingsWindow` e `CostWindow` viram painéis de conteúdo (sem seu próprio
  cabeçalho/close); o close e o Esc passam a viver no shell. As rotas antigas
  `#settings`/`#custo` deixam de ser usadas como janelas.
- A última aba selecionada persiste em `localStorage` (nav puramente do
  renderer, sem tocar no store de settings).
- Bandeja: um único item "Aplicativo" (remove "Configurações"/"Custo");
  duplo-clique também abre o app.

## Scope
### In
- Janela única com sidebar + área de conteúdo.
- Migrar Settings e Cost para painéis embutidos.
- Ajuste de tamanho da janela e do CSS do shell.
- Bandeja com um item só; persistência da última aba.
### Out
- Mudar o conteúdo/funcionalidade interna de cada tela.
- Redimensionamento pelo usuário / novas telas no menu.

## Subtasks
- [x] Criar `openAppWindow` (janela `#app`, ~760px) e remover
      `openSettingsWindow`/`openCostWindow`.
- [x] Criar `AppShell` (sidebar Configurações/Custos + área de conteúdo, com
      close/Esc e persistência da última aba em localStorage) e rotear `#app`
      no App.tsx.
- [x] Converter `SettingsWindow` e `CostWindow` em painéis de conteúdo (tirar
      cabeçalho/close próprios) e ajustar o CSS do shell.
- [x] Atualizar a bandeja para um único item "Aplicativo" + duplo-clique.
