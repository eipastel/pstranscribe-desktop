import './Button.css'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
}

function Button({ children, onClick, disabled = false }: ButtonProps): React.JSX.Element {
  return (
    <button type="button" className="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
