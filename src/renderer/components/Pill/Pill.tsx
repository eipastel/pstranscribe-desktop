import './Pill.css'
import type { ReactNode } from 'react'

interface PillProps {
  tall?: boolean
  ariaLabel: string
  onClick?: () => void
  children: ReactNode
}

function Pill({ tall = false, ariaLabel, onClick, children }: PillProps): React.JSX.Element {
  return (
    <button
      type="button"
      className="pill"
      data-tall={tall}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Pill
