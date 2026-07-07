import { useEffect } from 'react'
import VoiceWidget from '@/features/voice-widget/VoiceWidget'

function App(): React.JSX.Element {
  useEffect(() => {
    void window.api.ping()
  }, [])

  return <VoiceWidget />
}

export default App
