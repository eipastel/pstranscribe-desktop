import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useWidgetStore } from './widget'

const st = (): ReturnType<typeof useWidgetStore.getState> => useWidgetStore.getState()

beforeEach(() => {
  vi.useFakeTimers()
  useWidgetStore.setState({
    status: 'idle',
    elapsed: 0,
    micStream: null,
    hasKey: null,
    rawText: null,
    errorCode: null
  })
})

afterEach(() => {
  st().reset() // limpa timers pendentes
  vi.useRealTimers()
})

describe('máquina de estados do widget', () => {
  it('começa ocioso', () => {
    expect(st().status).toBe('idle')
  })

  it('press: ocioso → ouvindo e conta o tempo', () => {
    st().press()
    expect(st().status).toBe('listening')
    expect(st().elapsed).toBe(0)
    vi.advanceTimersByTime(3000)
    expect(st().elapsed).toBe(3)
  })

  it('press é ignorado se já estiver ouvindo', () => {
    st().press()
    st().setRawText('parcial')
    st().press() // não deve reiniciar (limparia o rawText)
    expect(st().rawText).toBe('parcial')
  })

  it('release: ouvindo → refinando e para o cronômetro', () => {
    st().press()
    vi.advanceTimersByTime(2000)
    st().release()
    expect(st().status).toBe('transcribing')
    vi.advanceTimersByTime(2000)
    expect(st().elapsed).toBe(2) // cronômetro parado
  })

  it('release é ignorado fora de ouvindo', () => {
    st().release()
    expect(st().status).toBe('idle')
  })

  it('fail: vai para erro e volta a ocioso após 2s', () => {
    st().press()
    st().fail('network')
    expect(st().status).toBe('error')
    expect(st().errorCode).toBe('network')
    vi.advanceTimersByTime(2000)
    expect(st().status).toBe('idle')
    expect(st().errorCode).toBeNull()
  })

  it('press a partir de erro é permitido e cancela o auto-dismiss', () => {
    st().fail('paste_failed')
    st().press()
    expect(st().status).toBe('listening')
    vi.advanceTimersByTime(2000)
    expect(st().status).toBe('listening') // o reset agendado foi cancelado
  })

  it('reset volta tudo ao ocioso', () => {
    st().press()
    st().setRawText('x')
    st().reset()
    expect(st()).toMatchObject({ status: 'idle', elapsed: 0, rawText: null, errorCode: null })
  })

  it('setters simples', () => {
    const stream = {} as MediaStream
    st().setMicStream(stream)
    expect(st().micStream).toBe(stream)
    st().setHasKey(true)
    expect(st().hasKey).toBe(true)
    st().setRawText('oi')
    expect(st().rawText).toBe('oi')
  })
})
