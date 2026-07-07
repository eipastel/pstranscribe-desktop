import './VoiceWidget.css'
import Pill from '@/components/Pill/Pill'
import Waveform from '@/components/Waveform/Waveform'
import StatusLabel from '@/components/StatusLabel/StatusLabel'
import Timer from '@/components/Timer/Timer'
import TranscriptPreview from '@/components/TranscriptPreview/TranscriptPreview'
import CheckIcon from '@/components/CheckIcon/CheckIcon'
import { useWidgetStore, type WidgetStatus } from '@/state/widget'
import { useClickThrough } from '@/hooks/useClickThrough'
import { useRecording } from './useRecording'
import { useMicLevels } from './useMicLevels'

// Texto mock do design (VoiceWidget.dc.html); a transcrição real vem em batch futura
const RAW_TEXT =
  'então tipo assim ó eu queria ah marcar tipo uma reunião sabe com o pessoal de vendas pra semana que vem talvez quinta e ah acho que umas três da tarde'

const HINTS: Record<WidgetStatus, string> = {
  idle: 'Clique no widget para começar a falar',
  listening: 'Clique para parar e transcrever',
  transcribing: 'A IA está enxugando o texto…',
  done: 'Texto tratado colado onde o cursor estava'
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
  const tap = useWidgetStore((s) => s.tap)
  const micStream = useWidgetStore((s) => s.micStream)
  const hoverHandlers = useClickThrough()
  useRecording()
  const levels = useMicLevels(micStream)

  return (
    <div className="voice-widget">
      <div {...hoverHandlers}>
        <Pill tall={status === 'transcribing'} ariaLabel={HINTS[status]} onClick={tap}>
          {status === 'idle' && (
            <div className="vw-row">
              <MicIcon />
              <StatusLabel
                title="Falar para transcrever"
                subtitle="A IA deixa sua mensagem enxuta"
              />
              <span className="vw-kbd">
                <span>⌥</span>
                <span>Space</span>
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
              <TranscriptPreview text={RAW_TEXT} />
            </div>
          )}
          {status === 'done' && (
            <div className="vw-row">
              <CheckIcon />
              <StatusLabel title="Colado no cursor" subtitle="Clique para gravar de novo" />
            </div>
          )}
        </Pill>
      </div>
      <div className="vw-hint">{HINTS[status]}</div>
    </div>
  )
}

export default VoiceWidget
