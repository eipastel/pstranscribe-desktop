# 0003 — PowerShell `SendKeys` para colar

**Status:** aceito

## Contexto

Depois de transcrever, o texto precisa ir para o **app em foco** — ou seja,
simular `Ctrl+V`. A escolha natural seria uma lib nativa de automação de teclado
como o nut.js, mas ele **virou pago**.

## Decisão

Colar via **PowerShell `SendKeys`**: `paste.ts` põe o texto no clipboard, faz
spawn de `powershell -Command "(New-Object -ComObject WScript.Shell).SendKeys('^v')"`
(com `windowsHide` para não roubar o foco) e restaura o clipboard anterior.

## Consequências

- **A favor:** zero dependência nova, zero módulo nativo; PowerShell já existe em
  todo Windows.
- **Contra:** ~0,5 s de latência por spawn do PowerShell; só Windows; restaura só
  **texto** do clipboard (imagem/arquivo que estivesse lá se perde). Se falhar, o
  texto fica no clipboard para colar à mão.
- **Upgrade:** se a latência incomodar, trocar por `keysender` ou um fork livre
  do nut.js (ver a nota `ponytail:` em `src/main/paste.ts`).
