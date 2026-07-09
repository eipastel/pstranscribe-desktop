# Janela do app arrastável (barra de título própria)

## Summary
A janela "Aplicativo" (Configurações/Custos) ganha uma barra no topo com o nome
"PSTranscribe" e o botão de fechar. Arrastar essa barra move a janela pela tela,
como um programa comum do sistema.

## Technical detail
- A janela já é `frame: false` + `transparent` (`src/main/windows/app.ts`);
  arrasto sai por CSS, sem mudar o processo main.
- Barra de arrasto = `-webkit-app-region: drag` num header no topo do
  `.app-shell`; o botão fechar recebe `-webkit-app-region: no-drag` para
  continuar clicável.
- Layout do `.app-shell` passa de linha (sidebar | conteúdo) para coluna: barra
  no topo e, abaixo, a linha sidebar + conteúdo.
- O botão fechar flutuante de hoje (`.app-close` em `AppShell.tsx`) sai da área
  de conteúdo e vai para a barra (canto direito).
- Barra respeita os cantos arredondados (border-radius 20px do shell).

## Scope
### In
- Barra de título própria na janela Aplicativo: nome do app + fechar.
- Arrasto da janela pela barra; fechar segue funcionando.
### Out
- Redimensionar a janela; minimizar/maximizar.
- Janela de Conceitos e widget de voz principal.

## Subtasks
- [x] Reestruturar `AppShell.tsx`: barra no topo com "PSTranscribe" + botão fechar; layout em coluna (barra sobre sidebar+conteúdo).
- [x] Estilizar a barra em `AppShell.css`: região de arrasto (`-webkit-app-region: drag`), fechar como `no-drag`, cantos arredondados.
- [x] Rodar a janela e confirmar que arrasta pela barra e o fechar responde.
