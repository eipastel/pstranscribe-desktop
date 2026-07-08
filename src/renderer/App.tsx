import { useEffect } from 'react'
import VoiceWidget from '@/features/voice-widget/VoiceWidget'
import KeyGate from '@/features/key-gate/KeyGate'
import { useWidgetStore } from '@/state/widget'

function App(): React.JSX.Element | null {
  const hasKey = useWidgetStore((s) => s.hasKey)
  const setHasKey = useWidgetStore((s) => s.setHasKey)

  useEffect(() => {
    void window.api.hasApiKey().then(setHasKey)
  }, [setHasKey])

  if (hasKey === null) return null // evita flash enquanto consulta a chave
  return hasKey ? <VoiceWidget /> : <KeyGate />
}

export default App
