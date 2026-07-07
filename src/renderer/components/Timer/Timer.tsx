import './Timer.css'

interface TimerProps {
  seconds: number
}

function format(total: number): string {
  const m = Math.floor(total / 60)
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}

function Timer({ seconds }: TimerProps): React.JSX.Element {
  return <span className="timer">{format(seconds)}</span>
}

export default Timer
