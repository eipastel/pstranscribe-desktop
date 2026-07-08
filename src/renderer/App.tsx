import { useEffect, useState } from 'react'
import VoiceWidget from '@/features/voice-widget/VoiceWidget'
import KeyGate from '@/features/key-gate/KeyGate'
import Onboarding from '@/features/onboarding/Onboarding'
import AppShell from '@/features/app-shell/AppShell'
import ConceptsWindow from '@/features/concepts/ConceptsWindow'
import { useWidgetStore } from '@/state/widget'

const isAppView = window.location.hash === '#app'
const isConceptsView = window.location.hash === '#conceitos'

function App(): React.JSX.Element | null {
  const hasKey = useWidgetStore((s) => s.hasKey)
  const setHasKey = useWidgetStore((s) => s.setHasKey)
  const [onboarded, setOnboarded] = useState<boolean | null>(null)

  useEffect(() => {
    if (isAppView || isConceptsView) return
    void window.api.hasApiKey().then(setHasKey)
    void window.api.getSettings().then((s) => setOnboarded(s.onboarded))
    // chave adicionada/removida pela tela de settings reflete aqui na hora
    return window.api.onKeyChanged(() => void window.api.hasApiKey().then(setHasKey))
  }, [setHasKey])

  if (isAppView) return <AppShell />
  if (isConceptsView) return <ConceptsWindow />
  if (hasKey === null || onboarded === null) return null // evita flash enquanto consulta
  if (!onboarded) return <Onboarding onDone={() => setOnboarded(true)} />
  if (!hasKey) return <KeyGate /> // já onboardado, só falta a chave (ex.: removida)
  return <VoiceWidget />
}

export default App
