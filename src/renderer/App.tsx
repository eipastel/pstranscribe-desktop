import { useEffect } from 'react'
import { useWidgetStore } from '@/state/widget'

function App(): React.JSX.Element {
  const status = useWidgetStore((s) => s.status)

  useEffect(() => {
    void window.api.ping()
  }, [])

  return <div className="pill" data-status={status} />
}

export default App
