import { loadApiKey } from './key'

// Modelo pequeno mais forte da lineup 2026; barato o bastante por mensagem
const FORMAT_MODEL = 'gpt-5.4-mini'

const SYSTEM_PROMPT = `Você recebe a transcrição bruta de uma fala em português e devolve a mesma mensagem enxuta, pronta para ser colada num chat.
Regras:
- Corte muletas de fala (tipo, ah, sabe, então), hesitações e repetições.
- Preserve o sentido, o tom informal e o jeito humano de digitar — não formalize.
- Não adicione informação, saudação ou despedida que não estava na fala.
- Responda SÓ com a mensagem final, sem aspas nem comentários.`

// null = formatação falhou → quem chama cola o texto bruto (degrada com elegância)
export async function formatText(raw: string): Promise<string | null> {
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
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const text = data.choices?.[0]?.message?.content?.trim()
    return text || null
  } catch {
    return null
  }
}
