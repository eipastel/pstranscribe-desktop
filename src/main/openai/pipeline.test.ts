import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Settings } from '../../shared/settings'

vi.mock('../settings', () => ({ loadSettings: vi.fn() }))
vi.mock('../../shared/settings', () => ({ FORMAT_LOCKED: false }))
vi.mock('../glossary', () => ({ correctText: vi.fn((t: string) => t) }))
vi.mock('./stt', () => ({ transcribeAudio: vi.fn() }))
vi.mock('./format', () => ({ formatText: vi.fn() }))

import { processAudio } from './pipeline'
import { loadSettings } from '../settings'
import { correctText } from '../glossary'
import { transcribeAudio } from './stt'
import { formatText } from './format'

const audio = Buffer.from('pcm')
const settings = (over: Partial<Settings>): Settings =>
  ({
    keybind: { ctrl: true, alt: false, shift: false, key: 'P' },
    keybindContinuo: { ctrl: true, alt: false, shift: true, key: 'Space' },
    transcrever: true,
    formatar: true,
    respostaRapida: false,
    autoLaunch: false,
    opacity: 1,
    onboarded: false,
    ...over
  }) as Settings

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(correctText).mockImplementation((t: string) => t)
})

describe('processAudio', () => {
  it('transcrição desligada → disabled', async () => {
    vi.mocked(loadSettings).mockReturnValue(settings({ transcrever: false }))
    expect(await processAudio(audio)).toEqual({ ok: false, error: 'disabled' })
  })

  it('erro no STT → repassa o erro', async () => {
    vi.mocked(loadSettings).mockReturnValue(settings({}))
    vi.mocked(transcribeAudio).mockResolvedValue({ ok: false, error: 'network' } as never)
    expect(await processAudio(audio)).toEqual({ ok: false, error: 'network' })
  })

  it('formatar desligado → cola o bruto e dispara onRaw', async () => {
    vi.mocked(loadSettings).mockReturnValue(settings({ formatar: false }))
    vi.mocked(transcribeAudio).mockResolvedValue({
      ok: true,
      text: '  oi  ',
      model: 'stt-1'
    } as never)
    const onRaw = vi.fn()
    const out = await processAudio(audio, onRaw)
    expect(onRaw).toHaveBeenCalledWith('oi')
    expect(out).toEqual({
      ok: true,
      raw: 'oi',
      text: 'oi',
      formatted: false,
      sttModel: 'stt-1',
      formatTokens: 0
    })
  })

  it('formatar ligado → aplica a formatação', async () => {
    vi.mocked(loadSettings).mockReturnValue(settings({}))
    vi.mocked(transcribeAudio).mockResolvedValue({ ok: true, text: 'oi', model: 'stt-1' } as never)
    vi.mocked(formatText).mockResolvedValue({ text: 'Oi.', model: 'fmt-1', tokens: 7 } as never)
    const out = await processAudio(audio)
    expect(out).toMatchObject({
      ok: true,
      raw: 'oi',
      text: 'Oi.',
      formatted: true,
      formatModel: 'fmt-1',
      formatTokens: 7
    })
  })

  it('formatText nulo → cai para o bruto', async () => {
    vi.mocked(loadSettings).mockReturnValue(settings({}))
    vi.mocked(transcribeAudio).mockResolvedValue({ ok: true, text: 'oi', model: 'stt-1' } as never)
    vi.mocked(formatText).mockResolvedValue(null as never)
    const out = await processAudio(audio)
    expect(out).toMatchObject({ ok: true, text: 'oi', formatted: false, formatTokens: 0 })
  })

  it('bruto vazio → não formata', async () => {
    vi.mocked(loadSettings).mockReturnValue(settings({}))
    vi.mocked(transcribeAudio).mockResolvedValue({ ok: true, text: '   ', model: 'stt-1' } as never)
    vi.mocked(correctText).mockReturnValue('')
    const out = await processAudio(audio)
    expect(out).toMatchObject({ ok: true, raw: '', text: '', formatted: false })
    expect(formatText).not.toHaveBeenCalled()
  })
})
