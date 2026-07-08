import { clipboard } from 'electron'
import { execFile } from 'child_process'

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms))

// Cola no campo em foco: clipboard → Ctrl+V simulado → clipboard anterior de volta.
export async function pasteText(text: string): Promise<boolean> {
  const previous = clipboard.readText()
  clipboard.writeText(text)
  const sent = await sendCtrlV()
  if (!sent) return false // falhou: deixa o texto no clipboard para o usuário colar manual
  await sleep(300) // dá tempo do alvo ler o clipboard antes de restaurar
  clipboard.writeText(previous) // ponytail: restaura só texto; imagem/arquivo no clipboard se perde
  return true
}

// ponytail: spawn de PowerShell (~0.5s) em vez de dep nativa (nut.js virou paga);
// trocar por keysender/nut-fork se a latência incomodar.
function sendCtrlV(): Promise<boolean> {
  return new Promise((resolve) => {
    execFile(
      'powershell',
      ['-NoProfile', '-Command', "(New-Object -ComObject WScript.Shell).SendKeys('^v')"],
      { windowsHide: true }, // sem janela de console roubando o foco do alvo
      (error) => resolve(!error)
    )
  })
}
