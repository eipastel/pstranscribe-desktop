# onboarding — primeiro uso

A tela de boas-vindas mostrada uma única vez, antes do widget, quando
`settings.onboarded` ainda é `false`. Apresenta o app e conduz o usuário ao
primeiro passo (incluindo a chave da OpenAI).

- **`Onboarding.tsx`** — o fluxo de onboarding; ao concluir marca `onboarded` e
  chama `onDone`, liberando o widget.
