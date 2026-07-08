// Preços em USD por modelo. STT é cobrado por minuto de áudio; a formatação
// (chat) por token. Fonte: tabela pública da OpenAI — revisar quando mudar.
// ponytail: valores de referência; o "custo por minuto" depende deles, então
// esta tabela é o botão de calibração — ajuste aqui quando o preço mudar.
const STT_USD_PER_MINUTE: Record<string, number> = {
  'gpt-4o-transcribe': 0.006,
  'gpt-4o-mini-transcribe': 0.003,
  'whisper-1': 0.006
}

// gpt-5.4-mini não tem preço público estável — placeholder conservador por token
// (mistura input/output). Calibrar quando a OpenAI publicar o valor.
const FORMAT_USD_PER_TOKEN: Record<string, number> = {
  'gpt-5.4-mini': 0.5 / 1_000_000
}

export interface CostInput {
  sttModel?: string
  seconds?: number
  formatModel?: string
  formatTokens?: number
}

// Custo total em USD de uma transcrição (STT por minuto + formatação por token).
// Modelo/preço desconhecido conta 0 — nunca quebra o registro do histórico.
export function computeCost({
  sttModel,
  seconds = 0,
  formatModel,
  formatTokens = 0
}: CostInput): number {
  const sttRate = sttModel ? (STT_USD_PER_MINUTE[sttModel] ?? 0) : 0
  const stt = (seconds / 60) * sttRate
  const fmtRate = formatModel ? (FORMAT_USD_PER_TOKEN[formatModel] ?? 0) : 0
  const fmt = formatTokens * fmtRate
  return stt + fmt
}
