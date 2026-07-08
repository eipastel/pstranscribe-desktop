import { safeStorage } from 'electron'
import { loadSettings, saveSettings } from '../settings'
import type { KeyErrorCode, KeySetResult } from '../../shared/ipc'

// Valida barato com GET /v1/models (não gasta token) e mapeia os erros que importam.
export async function validateApiKey(key: string): Promise<KeySetResult> {
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` }
    })
    if (res.ok) return { ok: true }
    let code: string | undefined
    try {
      const body = (await res.json()) as { error?: { code?: string } }
      code = body.error?.code
    } catch {
      // corpo não-JSON: decide só pelo status
    }
    return { ok: false, error: mapError(res.status, code) }
  } catch {
    return { ok: false, error: 'network' }
  }
}

export function mapError(status: number, code?: string): KeyErrorCode {
  if (status === 401) return 'invalid'
  if (code === 'insufficient_quota' || status === 402) return 'no_credit'
  if (status === 429) return 'rate_limit'
  return 'network'
}

export function storeApiKey(key: string): void {
  const encrypted = safeStorage.encryptString(key).toString('base64')
  saveSettings({ ...loadSettings(), apiKeyEncrypted: encrypted })
}

export function loadApiKey(): string | null {
  const { apiKeyEncrypted } = loadSettings()
  if (!apiKeyEncrypted) return null
  try {
    return safeStorage.decryptString(Buffer.from(apiKeyEncrypted, 'base64'))
  } catch {
    return null // ciphertext corrompido ou de outra máquina
  }
}

export function clearApiKey(): void {
  const settings = loadSettings()
  delete settings.apiKeyEncrypted
  saveSettings(settings)
}
