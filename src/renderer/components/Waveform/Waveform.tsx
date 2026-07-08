import './Waveform.css'

export const WAVEFORM_BAR_COUNT = 64

interface WaveformProps {
  /** Níveis 0..1 por barra (mic real); sem eles, barras baixas (silêncio) */
  levels?: number[]
}

function Waveform({ levels }: WaveformProps): React.JSX.Element {
  return (
    <div className="waveform" aria-hidden="true">
      {Array.from({ length: WAVEFORM_BAR_COUNT }, (_, i) => (
        <span
          key={i}
          className="waveform-bar is-live"
          style={{ height: '30px', transform: `scaleY(${0.1 + (levels?.[i] ?? 0) * 0.9})` }}
        />
      ))}
    </div>
  )
}

export default Waveform
