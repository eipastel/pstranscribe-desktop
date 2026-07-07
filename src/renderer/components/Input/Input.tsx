import './Input.css'
import StatusDot from '@/components/StatusDot/StatusDot'

export type FieldStatus = 'idle' | 'checking' | 'ok' | 'error'

interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'password'
  status?: FieldStatus
  ariaLabel: string
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  status = 'idle',
  ariaLabel
}: InputProps): React.JSX.Element {
  return (
    <div className="input-field" data-status={status}>
      <input
        className="input-field-control"
        type={type}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-invalid={status === 'error'}
        onChange={(e) => onChange(e.target.value)}
      />
      {status !== 'idle' && <StatusDot status={status} />}
    </div>
  )
}

export default Input
