import './KeyGate.css'
import { useState } from 'react'
import Input, { type FieldStatus } from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import { useInteractiveWindow } from '@/hooks/useInteractiveWindow'
import { useWidgetStore } from '@/state/widget'
import type { KeyErrorCode } from '@shared/ipc'

const ERROR_MESSAGES: Record<KeyErrorCode, string> = {
  invalid: 'Chave inválida — confira em platform.openai.com/api-keys',
  rate_limit: 'A OpenAI pediu uma pausa — tente de novo em instantes',
  no_credit: 'Sua conta está sem crédito — ative o billing na OpenAI',
  network: 'Sem conexão — verifique a internet e tente de novo'
}

// Porta de primeiro uso: sem chave válida o app não grava.
function KeyGate(): React.JSX.Element {
  const [key, setKey] = useState('')
  const [status, setStatus] = useState<FieldStatus>('idle')
  const [message, setMessage] = useState('Cole sua chave da OpenAI para começar')
  useInteractiveWindow()
  const setHasKey = useWidgetStore((s) => s.setHasKey)

  const submit = async (): Promise<void> => {
    if (!key.trim() || status === 'checking') return
    setStatus('checking')
    setMessage('Validando a chave…')
    const result = await window.api.setApiKey(key.trim())
    if (result.ok) {
      setStatus('ok')
      setMessage('Tudo certo — segure o atalho e fale')
      setTimeout(() => setHasKey(true), 900)
    } else {
      setStatus('error')
      setMessage(ERROR_MESSAGES[result.error ?? 'network'])
    }
  }

  return (
    <div className="key-gate">
      <div className="key-gate-title">Conecte sua chave OpenAI</div>
      <form
        className="key-gate-row"
        onSubmit={(e) => {
          e.preventDefault()
          void submit()
        }}
      >
        <Input
          value={key}
          onChange={setKey}
          placeholder="sk-..."
          type="password"
          status={status}
          ariaLabel="Chave da OpenAI"
        />
        <Button disabled={!key.trim() || status === 'checking'} onClick={() => void submit()}>
          Salvar
        </Button>
      </form>
      <div className="key-gate-message" data-status={status}>
        {message}
      </div>
    </div>
  )
}

export default KeyGate
