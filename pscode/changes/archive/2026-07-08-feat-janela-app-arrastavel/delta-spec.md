# Janela do app arrastável — Delta

## Added
- Barra de título na janela "Aplicativo": nome "PSTranscribe" à esquerda e botão fechar à direita.
- Arrasto da janela pela barra (`-webkit-app-region: drag`); botão fechar como `no-drag`.

## Changed
- Layout do `.app-shell`: de linha (sidebar | conteúdo) para coluna (barra sobre `.app-body`, que contém sidebar + conteúdo).
- Botão fechar: de flutuante absoluto na área de conteúdo → fixo na barra de título.
