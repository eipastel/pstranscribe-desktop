import { useEffect } from 'react'
import VoiceWidget from '@/features/voice-widget/VoiceWidget'
import KeyGate from '@/features/key-gate/KeyGate'
import SettingsWindow from '@/features/settings/SettingsWindow'
import { useWidgetStore } from '@/state/widget'

const isSettingsView = window.location.hash === '#settings'

function App(): React.JSX.Element | null {
  const hasKey = useWidgetStore((s) => s.hasKey)
  const setHasKey = useWidgetStore((s) => s.setHasKey)

  useEffect(() => {
    if (!isSettingsView) void window.api.hasApiKey().then(setHasKey)
  }, [setHasKey])

  if (isSettingsView) return <SettingsWindow />
  if (hasKey === null) return null // evita flash enquanto consulta a chave
  return hasKey ? <VoiceWidget /> : <KeyGate />
}

export default App
