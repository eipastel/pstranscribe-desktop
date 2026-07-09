import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Settings } from '../../shared/settings'

vi.mock('../settings', () => ({ loadSettings: vi.fn(), saveSettings: vi.fn() }))
vi.mock('electron', () => ({
  safeStorage: {
    encryptString: vi.fn((s: string) => Buffer.from('enc:' + s)),
    decryptString: vi.fn((b: Buffer) => b.toString().replace(/^enc:/, ''))
  }
}))

import { mapError, validateApiKey, storeApiKey, loadApiKey, clearApiKey, maskedApiKey } from './key'
import { loadSettings, saveSettings } from '../settings'
import { safeStorage } from 'electron'

const base: Settings = {
  keybind: { ctrl: true, alt: false, shift: false, key: 'P' },
  keybindContinuo: { ctrl: true, alt: false, shift: true, key: 'Space' },
  transcrever: true,
  formatar: true,
  respostaRapida: false,
  autoLaunch: false,
  opacity: 1,
  onboarded: false,
  debugLogs: false
}

// Chave "sk-test1234" já no formato que loadApiKey espera (base64 do ciphertext do mock).
const encrypted = Buffer.from('enc:sk-test1234').toString('base64')

const res = (status: number, body?: unknown, ok = false): Response =>
  ({ ok, status, json: async () => body }) as unknown as Response

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(loadSettings).mockReturnValue({ ...base })
})

describe('mapError', () => {
  it('mapeia os status que importam', () => {
    expect(mapError(401)).toBe('invalid')
    expect(mapError(402)).toBe('no_credit')
    expect(mapError(500, 'insufficient_quota')).toBe('no_credit')
    expect(mapError(429)).toBe('rate_limit')
    expect(mapError(500)).toBe('network')
  })
})

describe('validateApiKey', () => {
  it('chave válida → ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res(200, undefined, true)))
    expect(await validateApiKey('sk-x')).toEqual({ ok: true })
  })

  it('401 → invalid (lê error.code do corpo)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(res(401, { error: { code: 'invalid_api_key' } }))
    )
    expect(await validateApiKey('sk-x')).toEqual({ ok: false, error: 'invalid' })
  })

  it('429 com corpo não-JSON → decide pelo status', async () => {
    const bad = {
      ok: false,
      status: 429,
      json: async () => {
        throw new Error('not json')
      }
    } as unknown as Response
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(bad))
    expect(await validateApiKey('sk-x')).toEqual({ ok: false, error: 'rate_limit' })
  })

  it('fetch estoura → network', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    expect(await validateApiKey('sk-x')).toEqual({ ok: false, error: 'network' })
  })
})

describe('armazenamento da chave', () => {
  it('storeApiKey grava o ciphertext em base64', () => {
    storeApiKey('sk-abc')
    expect(safeStorage.encryptString).toHaveBeenCalledWith('sk-abc')
    expect(vi.mocked(saveSettings).mock.calls[0][0].apiKeyEncrypted).toBe(
      Buffer.from('enc:sk-abc').toString('base64')
    )
  })

  it('loadApiKey: ausente → null', () => {
    vi.mocked(loadSettings).mockReturnValue({ ...base })
    expect(loadApiKey()).toBeNull()
  })

  it('loadApiKey: presente → decifra', () => {
    vi.mocked(loadSettings).mockReturnValue({ ...base, apiKeyEncrypted: encrypted })
    expect(loadApiKey()).toBe('sk-test1234')
  })

  it('loadApiKey: ciphertext corrompido → null', () => {
    vi.mocked(loadSettings).mockReturnValue({ ...base, apiKeyEncrypted: encrypted })
    vi.mocked(safeStorage.decryptString).mockImplementationOnce(() => {
      throw new Error('corrompido')
    })
    expect(loadApiKey()).toBeNull()
  })

  it('clearApiKey remove a chave e salva', () => {
    vi.mocked(loadSettings).mockReturnValue({ ...base, apiKeyEncrypted: encrypted })
    clearApiKey()
    expect(vi.mocked(saveSettings).mock.calls[0][0].apiKeyEncrypted).toBeUndefined()
  })

  it('maskedApiKey: só os 4 últimos, ou null', () => {
    vi.mocked(loadSettings).mockReturnValue({ ...base, apiKeyEncrypted: encrypted })
    expect(maskedApiKey()).toBe('sk-…1234')
    vi.mocked(loadSettings).mockReturnValue({ ...base })
    expect(maskedApiKey()).toBeNull()
  })
})
