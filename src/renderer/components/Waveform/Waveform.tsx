import './Waveform.css'

const BARS = Array.from({ length: 32 }, (_, i) => ({
  height: 22 + Math.round(18 * Math.abs(Math.sin(i * 1.7))),
  delay: (i * 0.06).toFixed(2)
}))

function Waveform(): React.JSX.Element {
  return (
    <div className="waveform" aria-hidden="true">
      {BARS.map((bar, i) => (
        <span
          key={i}
          className="waveform-bar"
          style={{ height: `${bar.height}px`, animationDelay: `${bar.delay}s` }}
        />
      ))}
    </div>
  )
}

export default Waveform
