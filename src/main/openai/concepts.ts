import { loadApiKey } from './key'
import { FORMAT_MODEL } from './format'

// Extração de conceitos: mesma lineup barata da formatação (gpt-5.4-mini).
const SYSTEM_PROMPT = `Você recebe uma transcrição de fala em português. Liste termos que parecem nomes próprios, empresas, produtos ou jargões — e sobretudo os que parecem grafados errado por engano de transcrição.
Regras:
- Só termos que valham virar entrada de glossário; ignore palavras comuns.
- No máximo 10 termos, cada um exatamente como apareceu no texto.
- Responda SÓ com JSON: {"terms": ["...", "..."]}. Sem comentários.`

// Termos candidatos a glossário. Falha (sem chave, rede, JSON inválido) → [], o
// caller simplesmente não enfileira nada. Fora do caminho crítico.
export async function extractConcepts(text: string): Promise<string[]> {
  const key = loadApiKey()
  if (!key || !text.trim()) return []
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: FORMAT_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text }
        ]
      })
    })
    if (!res.ok) return []
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const content = data.choices?.[0]?.message?.content
    if (!content) return []
    const parsed = JSON.parse(content) as { terms?: unknown }
    if (!Array.isArray(parsed.terms)) return []
    return parsed.terms.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
  } catch {
    return []
  }
}
