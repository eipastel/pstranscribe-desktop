import './AppShell.css'
import { useEffect, useState } from 'react'
import SettingsWindow from '@/features/settings/SettingsWindow'
import CostWindow from '@/features/cost/CostWindow'

type Tab = 'settings' | 'custos'

const TABS: { id: Tab; label: string }[] = [
  { id: 'settings', label: 'Configurações' },
  { id: 'custos', label: 'Custos' }
]

// Lembra a última aba entre aberturas (nav puramente do renderer)
const STORE_KEY = 'app.tab'
const initialTab = (): Tab => (localStorage.getItem(STORE_KEY) === 'custos' ? 'custos' : 'settings')

// Shell "Aplicativo": menu lateral + área de conteúdo, com um único fechar/Esc.
export default function AppShell(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>(initialTab)

  useEffect(() => {
    localStorage.setItem(STORE_KEY, tab)
  }, [tab])

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') window.close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="app-shell">
      <nav className="app-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={t.id === tab ? 'app-nav-item active' : 'app-nav-item'}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div className="app-content">
        <button
          type="button"
          className="app-close"
          aria-label="Fechar"
          onClick={() => window.close()}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {tab === 'settings' ? <SettingsWindow /> : <CostWindow />}
      </div>
    </div>
  )
}
