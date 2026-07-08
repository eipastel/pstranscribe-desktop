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

// Colagem incremental dos deltas do tempo real. Cada Ctrl+V custa um spawn de
// PowerShell (~0.5s), então colar palavra a palavra empilha e trava. Solução:
// coalescer — enquanto uma colagem roda, os deltas que chegam se acumulam num
// buffer e a próxima colagem manda tudo de uma vez. O clipboard do usuário é
// salvo no primeiro delta e restaurado só no flush.
let pending = ''
let pumpPromise: Promise<void> | null = null
let savedClipboard: string | null = null

export function enqueuePaste(text: string): void {
  pending += text
  if (!pumpPromise) pumpPromise = pump()
}

async function pump(): Promise<void> {
  while (pending) {
    const chunk = pending // leva tudo que acumulou durante a colagem anterior
    pending = ''
    if (savedClipboard === null) savedClipboard = clipboard.readText()
    clipboard.writeText(chunk)
    await sendCtrlV()
    await sleep(40) // pequena folga p/ o alvo ler antes do próximo lote
  }
  pumpPromise = null
}

export async function flushPasteQueue(): Promise<void> {
  await pumpPromise // cola o que ainda estiver no buffer
  if (savedClipboard !== null) {
    clipboard.writeText(savedClipboard) // ponytail: restaura só texto, como pasteText
    savedClipboard = null
  }
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
