import './UpdateWindow.css'
import { useEffect, useState } from 'react'
import Button from '@/components/Button/Button'
import type { UpdateStatus } from '@shared/ipc'

// Texto de estado que a aba mostra, um por estado do updater.
const LABEL: Record<UpdateStatus['state'], string> = {
  checking: 'Verificando atualizações…',
  'not-available': 'Você está com a versão mais recente.',
  available: 'Nova versão disponível.',
  downloading: 'Baixando atualização…',
  downloaded: 'Pronto para reiniciar e instalar.',
  error: 'Não foi possível verificar agora.'
}

// Tela de Atualização (bandeja → app → aba "Atualização"): mostra versão
// atual/disponível e um botão que muda conforme o estado do updater.
export default function UpdateWindow(): React.JSX.Element {
  const [status, setStatus] = useState<UpdateStatus | null>(null)
  // "Buscando" local com piso de tempo: mesmo quando a checagem responde na hora
  // (ou é no-op em dev), o botão mostra o spinner por um instante — feedback suave.
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    void window.api.getUpdateStatus().then(setStatus)
    return window.api.onUpdateStatus(setStatus) // cleanup remove o listener
  }, [])

  const runCheck = (): void => {
    setChecking(true)
    void window.api.checkForUpdate()
    window.setTimeout(() => setChecking(false), 1000) // piso suave de ~1s
  }

  const state = status?.state ?? 'not-available'
  const percent = status?.percent ?? 0
  const busy = checking || state === 'checking'

  // Botão contextual: rótulo + ação + se está travado, por estado.
  let btnLabel = 'Verificar novamente'
  let onClick = runCheck
  let disabled = false
  if (busy) {
    btnLabel = 'Verificando…'
    disabled = true
  } else if (state === 'available') {
    btnLabel = 'Baixar'
    onClick = (): void => void window.api.downloadUpdate()
  } else if (state === 'downloading') {
    btnLabel = `Baixando ${percent}%`
    disabled = true
  } else if (state === 'downloaded') {
    btnLabel = 'Reiniciar e instalar'
    onClick = (): void => void window.api.installUpdate()
  }

  return (
    <div className="update-panel">
      <div className="update-head">
        <div>
          <div className="update-title">Atualização</div>
          <div className="update-sub">Versão atual {status?.version ?? '—'}</div>
        </div>
      </div>
      <div className="update-body">
        <div className="update-state">{busy ? LABEL.checking : LABEL[state]}</div>
        {status?.available && <div className="update-version">Disponível: {status.available}</div>}
        {!busy && state === 'error' && status?.error && (
          <div className="update-error">{status.error}</div>
        )}
        <div className="update-action">
          <Button onClick={onClick} disabled={disabled}>
            {busy && <span className="update-spin" aria-hidden="true" />}
            {btnLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
