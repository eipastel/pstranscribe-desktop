import { useEffect, useState } from 'react'
import VoiceWidget from '@/features/voice-widget/VoiceWidget'
import KeyGate from '@/features/key-gate/KeyGate'
import Onboarding from '@/features/onboarding/Onboarding'
import SettingsWindow from '@/features/settings/SettingsWindow'
import { useWidgetStore } from '@/state/widget'

const isSettingsView = window.location.hash === '#settings'

function App(): React.JSX.Element | null {
  const hasKey = useWidgetStore((s) => s.hasKey)
  const setHasKey = useWidgetStore((s) => s.setHasKey)
  const [onboarded, setOnboarded] = useState<boolean | null>(null)

  useEffect(() => {
    if (isSettingsView) return
    void window.api.hasApiKey().then(setHasKey)
    void window.api.getSettings().then((s) => setOnboarded(s.onboarded))
    // chave adicionada/removida pela tela de settings reflete aqui na hora
    return window.api.onKeyChanged(() => void window.api.hasApiKey().then(setHasKey))
  }, [setHasKey])

  if (isSettingsView) return <SettingsWindow />
  if (hasKey === null || onboarded === null) return null // evita flash enquanto consulta
  if (!onboarded) return <Onboarding onDone={() => setOnboarded(true)} />
  if (!hasKey) return <KeyGate /> // já onboardado, só falta a chave (ex.: removida)
  return <VoiceWidget />
}

export default App
