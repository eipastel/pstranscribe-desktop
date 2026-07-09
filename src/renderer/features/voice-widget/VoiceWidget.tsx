import './VoiceWidget.css'
import { useEffect, useState } from 'react'
import Pill from '@/components/Pill/Pill'
import Waveform from '@/components/Waveform/Waveform'
import StatusLabel from '@/components/StatusLabel/StatusLabel'
import Timer from '@/components/Timer/Timer'
import StatusDot from '@/components/StatusDot/StatusDot'
import { useWidgetStore, type WidgetStatus, type WidgetError } from '@/state/widget'
import { useClickThrough } from '@/hooks/useClickThrough'
import { useRecording } from './useRecording'
import { useMicLevels } from './useMicLevels'
import { keybindParts } from '@shared/settings'

const HINTS: Record<WidgetStatus, string> = {
  idle: 'Segure o atalho para falar',
  listening: 'Solte para transcrever',
  transcribing: 'A IA está enxugando o texto…',
  error: 'Segure o atalho para tentar de novo'
}

const ERRORS: Record<WidgetError, { title: string; hint: string }> = {
  invalid: { title: 'Chave inválida', hint: 'Confira sua chave em platform.openai.com' },
  rate_limit: { title: 'A OpenAI pediu uma pausa', hint: 'Espere um instante e fale de novo' },
  no_credit: { title: 'Conta sem crédito', hint: 'Ative o billing na OpenAI' },
  network: { title: 'Sem conexão', hint: 'Verifique a internet e tente de novo' },
  disabled: { title: 'Transcrição desligada', hint: 'Ative nas configurações' },
  paste_failed: { title: 'Não consegui colar', hint: 'O texto está no clipboard — use Ctrl+V' }
}

function VoiceWidget(): React.JSX.Element {
  const status = useWidgetStore((s) => s.status)
  const elapsed = useWidgetStore((s) => s.elapsed)
  const micStream = useWidgetStore((s) => s.micStream)
  const errorCode = useWidgetStore((s) => s.errorCode)
  const hoverHandlers = useClickThrough()
  useRecording()
  const levels = useMicLevels(micStream)
  const error = ERRORS[errorCode ?? 'network']

  const [keyParts, setKeyParts] = useState<string[]>([])
  useEffect(() => {
    const load = (): void => {
      void window.api.getSettings().then((s) => setKeyParts(keybindParts(s.keybind)))
    }
    load()
    return window.api.onSettingsChanged(load) // keycap acompanha o atalho ao vivo
  }, [])

  // Conceitos pendentes de revisão; a contagem acompanha a extração ao vivo.
  const [pending, setPending] = useState(0)
  useEffect(() => {
    const load = (): void => void window.api.getConceptsCount().then(setPending)
    load()
    return window.api.onConceptsChanged(load)
  }, [])

  // Em repouso: só uma marca d'água discreta no canto; a pílula surge sob demanda.
  if (status === 'idle') {
    return (
      <div className="voice-widget">
        {pending > 0 && (
          <button className="vw-badge" {...hoverHandlers} onClick={() => window.api.openConcepts()}>
            {pending} {pending === 1 ? 'conceito' : 'conceitos'} para revisar
          </button>
        )}
        <div className="vw-watermark">
          Segure {keyParts.length ? keyParts.join(' + ') : 'o atalho'} para falar
        </div>
      </div>
    )
  }

  return (
    <div className="voice-widget">
      <div className="vw-pill">
        <div {...hoverHandlers}>
          <Pill ariaLabel={HINTS[status]}>
            {status === 'listening' && (
              <div className="vw-row">
                <span className="vw-dot" aria-hidden="true" />
                <div className="vw-wave">
                  <Waveform levels={levels} />
                </div>
                <Timer seconds={elapsed} />
              </div>
            )}
            {status === 'transcribing' && (
              <div className="vw-col">
                <span className="vw-spin" aria-hidden="true" />
              </div>
            )}
            {status === 'error' && (
              <div className="vw-row">
                <StatusDot status="error" />
                <StatusLabel title={error.title} subtitle={error.hint} />
              </div>
            )}
          </Pill>
        </div>
        {status !== 'transcribing' && <div className="vw-hint">{HINTS[status]}</div>}
      </div>
    </div>
  )
}

export default VoiceWidget
