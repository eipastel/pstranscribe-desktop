import './KeyRow.css'
import { useEffect, useState } from 'react'
import Input, { type FieldStatus } from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import type { KeyErrorCode } from '@shared/ipc'

const ERROR_MESSAGES: Record<KeyErrorCode, string> = {
  invalid: 'Chave inválida — confira em platform.openai.com/api-keys',
  rate_limit: 'A OpenAI pediu uma pausa — tente de novo em instantes',
  no_credit: 'Sua conta está sem crédito — ative o billing na OpenAI',
  network: 'Sem conexão — verifique a internet e tente de novo'
}

// Gestão da chave: mascarada (só os 4 últimos saem do main), substituir e remover
function KeyRow(): React.JSX.Element {
  const [masked, setMasked] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState<FieldStatus>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const refresh = (): void => {
    void window.api.getMaskedApiKey().then(setMasked)
  }
  useEffect(refresh, [])

  const save = async (): Promise<void> => {
    if (!draft.trim() || status === 'checking') return
    setStatus('checking')
    setMessage('Validando a chave…')
    const result = await window.api.setApiKey(draft.trim())
    if (result.ok) {
      setStatus('idle')
      setMessage(null)
      setEditing(false)
      setDraft('')
      refresh()
    } else {
      setStatus('error')
      setMessage(ERROR_MESSAGES[result.error ?? 'network'])
    }
  }

  const remove = async (): Promise<void> => {
    await window.api.clearApiKey()
    refresh()
  }

  return (
    <div className="settings-row key-row">
      <div className="settings-row-text">
        <div className="settings-row-label">Chave OpenAI</div>
        {!editing && (
          <div className="settings-row-desc">
            {masked ?? 'Nenhuma chave configurada — o app não grava sem ela'}
          </div>
        )}
        {editing && (
          <form
            className="key-row-edit"
            onSubmit={(e) => {
              e.preventDefault()
              void save()
            }}
          >
            <Input
              value={draft}
              onChange={setDraft}
              placeholder="sk-..."
              type="password"
              status={status}
              ariaLabel="Nova chave da OpenAI"
            />
            <Button disabled={!draft.trim() || status === 'checking'} onClick={() => void save()}>
              Salvar
            </Button>
            <Button
              onClick={() => {
                setEditing(false)
                setStatus('idle')
                setMessage(null)
              }}
            >
              Cancelar
            </Button>
          </form>
        )}
        {message && <div className="key-row-message">{message}</div>}
      </div>
      {!editing && (
        <div className="key-row-actions">
          <Button onClick={() => setEditing(true)}>{masked ? 'Substituir' : 'Adicionar'}</Button>
          {masked && <Button onClick={() => void remove()}>Remover</Button>}
        </div>
      )}
    </div>
  )
}

export default KeyRow
