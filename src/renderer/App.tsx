import { useEffect } from 'react'

function App(): React.JSX.Element {
  useEffect(() => {
    void window.api.ping()
  }, [])

  return <div className="pill" />
}

export default App
