/** Uma linha de log capturada pelo modo debug. */
export interface LogEntry {
  /** epoch ms de quando foi capturada */
  time: number
  level: 'log' | 'warn' | 'error'
  text: string
}

// ponytail: cap fixo de 1000 linhas basta pra debug; buffer rotativo em memória
// e no logs.json. Subir só se precisar de janela maior.
export const LOG_CAP = 1000
