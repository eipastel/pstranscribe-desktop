import './Onboarding.css'
import { useEffect, useState } from 'react'
import Button from '@/components/Button/Button'
import KeyGate from '@/features/key-gate/KeyGate'
import { useInteractiveWindow } from '@/hooks/useInteractiveWindow'
import { useKeybindCapture } from '@/hooks/useKeybindCapture'
import { useWidgetStore } from '@/state/widget'
import { keybindParts, type Keybind } from '@shared/settings'

interface OnboardingProps {
  onDone: () => void
}

// Fluxo único de primeiro uso: chave → atalho → mini-tutorial
function Onboarding({ onDone }: OnboardingProps): React.JSX.Element {
  const hasKey = useWidgetStore((s) => s.hasKey)
  const [stepState, setStep] = useState(1)
  const [keybind, setKeybind] = useState<Keybind | null>(null)
  const [capturing, setCapturing] = useState(false)
  useInteractiveWindow()

  // chave validada na porta avança o passo 1 → 2 (derivado, sem setState em effect)
  const step = stepState === 1 && hasKey ? 2 : stepState

  useEffect(() => {
    void window.api.getSettings().then((s) => setKeybind(s.keybind))
  }, [])

  useKeybindCapture(
    capturing,
    (kb) => {
      void window.api.updateSettings({ keybind: kb }).then((s) => setKeybind(s.keybind))
      setCapturing(false)
    },
    () => setCapturing(false)
  )

  const finish = (): void => {
    void window.api.updateSettings({ onboarded: true }).then(onDone)
  }

  const chips = keybind ? keybindParts(keybind) : []

  return (
    <div className="onboarding">
      {step === 1 && <KeyGate />}
      {step === 2 && (
        <div className="onboarding-panel">
          <div className="onboarding-title">Escolha o atalho para falar</div>
          <div className="onboarding-desc">
            {capturing ? (
              'Pressione a combinação… (Esc cancela)'
            ) : (
              <span className="onboarding-chips">
                {chips.map((part) => (
                  <span key={part} className="keybind-chip">
                    {part}
                  </span>
                ))}
              </span>
            )}
          </div>
          <div className="onboarding-actions">
            <Button onClick={() => setCapturing(!capturing)}>
              {capturing ? 'Cancelar' : 'Alterar'}
            </Button>
            <Button onClick={() => setStep(3)} disabled={capturing}>
              Continuar
            </Button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="onboarding-panel">
          <div className="onboarding-title">Pronto para usar</div>
          <div className="onboarding-desc">
            Clique onde quer escrever, segure{' '}
            <span className="onboarding-chips">
              {chips.map((part) => (
                <span key={part} className="keybind-chip">
                  {part}
                </span>
              ))}
            </span>{' '}
            e fale. Ao soltar, a IA enxuga o texto e cola no lugar.
          </div>
          <div className="onboarding-actions">
            <Button onClick={finish}>Começar a usar</Button>
          </div>
        </div>
      )}
      <div className="onboarding-dots" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className="onboarding-dot" data-active={n === step} />
        ))}
      </div>
    </div>
  )
}

export default Onboarding
