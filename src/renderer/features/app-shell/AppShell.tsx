import './AppShell.css'
import { useEffect, useState } from 'react'
import SettingsWindow from '@/features/settings/SettingsWindow'
import CostWindow from '@/features/cost/CostWindow'
import ConceptsSaved from '@/features/concepts/ConceptsSaved'
import UpdateWindow from '@/features/update/UpdateWindow'
import LogsWindow from '@/features/logs/LogsWindow'

type Tab = 'settings' | 'custos' | 'conceitos' | 'atualizacao' | 'logs'

const TABS: { id: Tab; label: string }[] = [
  { id: 'settings', label: 'Configurações' },
  { id: 'custos', label: 'Custos' },
  { id: 'conceitos', label: 'Conceitos' },
  { id: 'atualizacao', label: 'Atualização' }
]

// Lembra a última aba entre aberturas (nav puramente do renderer)
const STORE_KEY = 'app.tab'
const initialTab = (): Tab => {
  const saved = localStorage.getItem(STORE_KEY)
  return TABS.some((t) => t.id === saved) ? (saved as Tab) : 'settings'
}

// Shell "Aplicativo": menu lateral + área de conteúdo, com um único fechar/Esc.
export default function AppShell(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>(initialTab)
  const [debugLogs, setDebugLogs] = useState(false)

  // A aba Logs só existe com o modo debug ligado; reage ao toggle ao vivo
  // (o próprio painel de Settings dispara SETTINGS_CHANGED nesta janela).
  useEffect(() => {
    const load = (): void => void window.api.getSettings().then((s) => setDebugLogs(s.debugLogs))
    load()
    return window.api.onSettingsChanged(load)
  }, [])

  const tabs = debugLogs ? [...TABS, { id: 'logs' as Tab, label: 'Logs' }] : TABS
  const activeTab = tab === 'logs' && !debugLogs ? 'settings' : tab

  useEffect(() => {
    localStorage.setItem(STORE_KEY, activeTab)
  }, [activeTab])

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') window.close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="app-shell">
      {/* Barra de título: arrasta a janela (CSS -webkit-app-region: drag) */}
      <header className="app-titlebar">
        <span className="app-title">PSTranscribe</span>
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
      </header>
      <div className="app-body">
        <nav className="app-nav">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={t.id === activeTab ? 'app-nav-item active' : 'app-nav-item'}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="app-content">
          {/* Ambas montadas: alternar com `hidden` evita remontar (e re-buscar dados) na troca */}
          <div className="app-pane" hidden={activeTab !== 'settings'}>
            <SettingsWindow />
          </div>
          <div className="app-pane" hidden={activeTab !== 'custos'}>
            <CostWindow />
          </div>
          <div className="app-pane" hidden={activeTab !== 'conceitos'}>
            <ConceptsSaved />
          </div>
          <div className="app-pane" hidden={activeTab !== 'atualizacao'}>
            <UpdateWindow />
          </div>
          {debugLogs && (
            <div className="app-pane" hidden={activeTab !== 'logs'}>
              <LogsWindow />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
