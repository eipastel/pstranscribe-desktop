# Permissões de sistema

O PSTranscribe precisa de **uma** permissão para funcionar: acesso ao
**microfone**. A única plataforma suportada hoje é o **Windows**.

## Windows

### Microfone

Na primeira gravação, o app chama `getUserMedia` e o Windows decide se o áudio
pode ser capturado. Se não sair som/transcrição, libere manualmente:

1. **Configurações do Windows → Privacidade e segurança → Microfone.**
2. Ligue **"Acesso ao microfone"**.
3. Ligue **"Permitir que aplicativos da área de trabalho acessem o microfone"** —
   o PSTranscribe é um app desktop, então cai nessa categoria (não na lista de
   apps da Store).

Depois de liberar, feche e reabra o app.

### Colar (Ctrl+V simulado)

O paste usa PowerShell `SendKeys` para enviar `Ctrl+V` ao app em foco. **Não
exige permissão especial** no Windows — funciona direto. Se o texto não colar,
ele fica no clipboard para você colar à mão.

## macOS — planejado

macOS ainda **não é suportado**. Quando for, exigirá duas permissões que hoje o
Windows não pede:

- **Microfone** — Ajustes do Sistema → Privacidade e Segurança → Microfone.
- **Acessibilidade** — necessária para simular o `Cmd+V` de colar; é onde a
  maioria trava. Ajustes do Sistema → Privacidade e Segurança → Acessibilidade.

Enquanto isso, use no Windows.
