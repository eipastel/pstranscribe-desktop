import './StatusDot.css'

export type DotStatus = 'ok' | 'error' | 'checking'

interface StatusDotProps {
  status: DotStatus
}

// ok = ponto sólido, erro = anel vazado, verificando = pulso — grayscale, sem cor
function StatusDot({ status }: StatusDotProps): React.JSX.Element {
  return <span className="status-dot" data-status={status} aria-hidden="true" />
}

export default StatusDot
