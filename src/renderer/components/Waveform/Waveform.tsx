import './Waveform.css'

export const WAVEFORM_BAR_COUNT = 64

const BARS = Array.from({ length: WAVEFORM_BAR_COUNT }, (_, i) => ({
  height: 22 + Math.round(18 * Math.abs(Math.sin(i * 1.7))),
  delay: (i * 0.06).toFixed(2)
}))

interface WaveformProps {
  /** Níveis 0..1 por barra (mic real); sem eles, roda a animação mock do design */
  levels?: number[]
}

function Waveform({ levels }: WaveformProps): React.JSX.Element {
  return (
    <div className="waveform" aria-hidden="true">
      {BARS.map((bar, i) => (
        <span
          key={i}
          className={levels ? 'waveform-bar is-live' : 'waveform-bar'}
          style={
            levels
              ? { height: '30px', transform: `scaleY(${0.1 + (levels[i] ?? 0) * 0.9})` }
              : { height: `${bar.height}px`, animationDelay: `${bar.delay}s` }
          }
        />
      ))}
    </div>
  )
}

export default Waveform
