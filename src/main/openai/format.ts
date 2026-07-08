import { loadApiKey } from './key'

// Modelo pequeno mais forte da lineup 2026; barato o bastante por mensagem
export const FORMAT_MODEL = 'gpt-5.4-mini'

export interface FormatResult {
  text: string
  model: string
  tokens: number
}

const SYSTEM_PROMPT = `Você recebe a transcrição bruta de uma fala em português e devolve a mesma mensagem enxuta, pronta para ser colada num chat.
Regras:
- Corte muletas de fala (tipo, ah, sabe, então), hesitações e repetições.
- Preserve o sentido, o tom informal e o jeito humano de digitar — não formalize.
- Não adicione informação, saudação ou despedida que não estava na fala.
- Responda SÓ com a mensagem final, sem aspas nem comentários.`

// null = formatação falhou → quem chama cola o texto bruto (degrada com elegância)
export async function formatText(raw: string): Promise<FormatResult | null> {
  const key = loadApiKey()
  if (!key) return null
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: FORMAT_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: raw }
        ]
      })
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
      usage?: { total_tokens?: number }
    }
    const text = data.choices?.[0]?.message?.content?.trim()
    if (!text) return null
    return { text, model: FORMAT_MODEL, tokens: data.usage?.total_tokens ?? 0 }
  } catch {
    return null
  }
}
