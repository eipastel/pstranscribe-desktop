import './StatusLabel.css'

interface StatusLabelProps {
  title: string
  subtitle?: string
}

function StatusLabel({ title, subtitle }: StatusLabelProps): React.JSX.Element {
  return (
    <div className="status-label">
      <div className="status-label-title">{title}</div>
      {subtitle && <div className="status-label-sub">{subtitle}</div>}
    </div>
  )
}

export default StatusLabel
