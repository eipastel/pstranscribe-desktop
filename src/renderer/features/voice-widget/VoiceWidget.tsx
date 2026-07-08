import './VoiceWidget.css'
import { useEffect, useState } from 'react'
import Pill from '@/components/Pill/Pill'
import Waveform from '@/components/Waveform/Waveform'
import StatusLabel from '@/components/StatusLabel/StatusLabel'
import Timer from '@/components/Timer/Timer'
import TranscriptPreview from '@/components/TranscriptPreview/TranscriptPreview'
import CheckIcon from '@/components/CheckIcon/CheckIcon'
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
  done: 'Texto tratado colado onde o cursor estava',
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

// Usa a classe .icon-chip do CheckIcon (importado acima), mesmo chip circular do design
function MicIcon(): React.JSX.Element {
  return (
    <span className="icon-chip" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x={9} y={3} width={6} height={11} rx={3} />
        <path d="M5 11a7 7 0 0 0 14 0" />
        <line x1={12} y1={18} x2={12} y2={21} />
      </svg>
    </span>
  )
}

function VoiceWidget(): React.JSX.Element {
  const status = useWidgetStore((s) => s.status)
  const elapsed = useWidgetStore((s) => s.elapsed)
  const micStream = useWidgetStore((s) => s.micStream)
  const rawText = useWidgetStore((s) => s.rawText)
  const errorCode = useWidgetStore((s) => s.errorCode)
  const hoverHandlers = useClickThrough()
  useRecording()
  const levels = useMicLevels(micStream)
  const error = ERRORS[errorCode ?? 'network']

  const [keyParts, setKeyParts] = useState<string[]>([])
  useEffect(() => {
    void window.api.getSettings().then((s) => setKeyParts(keybindParts(s.keybind)))
  }, [])

  return (
    <div className="voice-widget">
      <div {...hoverHandlers}>
        <Pill tall={status === 'transcribing'} ariaLabel={HINTS[status]}>
          {status === 'idle' && (
            <div className="vw-row">
              <MicIcon />
              <StatusLabel
                title="Falar para transcrever"
                subtitle="A IA deixa sua mensagem enxuta"
              />
              <span className="vw-kbd">
                {keyParts.map((part) => (
                  <span key={part}>{part}</span>
                ))}
              </span>
            </div>
          )}
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
              <div className="vw-crow">
                <span className="vw-spin" aria-hidden="true" />
                <span className="vw-title">Refinando com IA</span>
                <span className="vw-aux">transcrição bruta</span>
              </div>
              <TranscriptPreview text={rawText ?? 'Transcrevendo…'} />
            </div>
          )}
          {status === 'done' && (
            <div className="vw-row">
              <CheckIcon />
              <StatusLabel
                title="Colado no cursor"
                subtitle="Segure o atalho para gravar de novo"
              />
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
      <div className="vw-hint">{HINTS[status]}</div>
    </div>
  )
}

export default VoiceWidget
