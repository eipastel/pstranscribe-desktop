# onboarding intercepta cliques e trava o app

## Objetivo
O onboarding deve capturar os cliques do usuário corretamente, permitindo
interação com seus próprios controles.

## Comportamento esperado
O overlay do onboarding recebe e trata os cliques nos seus botões; o usuário
consegue interagir e avançar/concluir o fluxo. O mesmo vale para o KeyGate
mostrado sozinho quando a chave é removida depois.

## Comportamento atual (bug)
Os cliques "passam por trás": vão para a janela do app atrás do overlay, e o
usuário fica preso no onboarding sem conseguir avançar. Bug crítico, hotfix.

## Fora de escopo
- Redesign do onboarding ou mudança no conteúdo dos passos.
- Badge/pílula do VoiceWidget (mesmo padrão, mas outro fluxo).
