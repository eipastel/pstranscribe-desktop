import { clipboard } from 'electron'
import { execFile, spawn, type ChildProcess } from 'child_process'

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

// --- Digitação em tempo real (imune ao modificador do PTT) -------------------
// Colar com Ctrl+V não serve aqui: o atalho PTT (ex.: Alt+M) mantém o Alt
// pressionado, então "^v" vira Ctrl+Alt+V e nada cola. Em vez disso DIGITAMOS o
// texto como Unicode via SendInput (KEYEVENTF_UNICODE), que injeta os caracteres
// direto — sem depender de modificadores nem tocar no clipboard, e com acentos.
// Um PowerShell vivo carrega o P/Invoke uma vez e digita cada delta (base64
// utf-8) lido do stdin, em ordem.
let typer: ChildProcess | null = null

// C# em uma linha: SendInput de dois eventos (down/up) por caractere. A struct
// INPUT tem 40 bytes no x64 (uint type + KEYBDINPUT + padding), daí o campo pad.
const TYPER_CSHARP =
  'using System;using System.Runtime.InteropServices;' +
  'public static class T{' +
  '[StructLayout(LayoutKind.Sequential)]struct KI{public ushort wVk;public ushort wScan;public uint dwFlags;public uint time;public IntPtr ex;}' +
  '[StructLayout(LayoutKind.Sequential)]struct IN{public uint type;public KI ki;public ulong pad;}' +
  '[DllImport("user32.dll")]static extern uint SendInput(uint n,IN[] p,int cb);' +
  'public static void Type(string s){foreach(char c in s){IN[] a=new IN[2];' +
  'a[0].type=1;a[0].ki.wScan=c;a[0].ki.dwFlags=4;' + // KEYEVENTF_UNICODE
  'a[1].type=1;a[1].ki.wScan=c;a[1].ki.dwFlags=6;' + // UNICODE | KEYUP
  'SendInput(2,a,Marshal.SizeOf(typeof(IN)));' +
  'System.Threading.Thread.Sleep(4);}}}' // pausa p/ o alvo não dropar teclas

function ensureTyper(): ChildProcess {
  if (typer && !typer.killed) return typer
  typer = spawn('powershell', ['-NoProfile', '-Command', '-'], { windowsHide: true })
  typer.on('error', () => (typer = null))
  typer.stdin?.write(`Add-Type -TypeDefinition '${TYPER_CSHARP}' -Language CSharp\n`)
  return typer
}

// Pré-carrega o typer (compila o Add-Type) enquanto a sessão realtime abre, para
// o primeiro delta já digitar sem esperar a compilação.
export function warmPaste(): void {
  ensureTyper()
}

// Digita o delta no cursor. Cada linha carrega seu próprio texto (base64), então
// não há estado compartilhado: o PowerShell executa em ordem, sem corrida.
export function enqueuePaste(text: string): void {
  const b64 = Buffer.from(text, 'utf8').toString('base64')
  ensureTyper().stdin?.write(
    `[T]::Type([System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${b64}')))\n`
  )
}

// Digitação não usa clipboard nem enfileira no lado do Node — nada a restaurar.
export async function flushPasteQueue(): Promise<void> {}
