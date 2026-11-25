import { useEffect, useState } from 'react'
import { FiDownload, FiShare, FiPlusSquare, FiX } from 'react-icons/fi'
import {
  canPromptInstall,
  isIOSDevice,
  isManuallyInstalled,
  isRunningInstalled,
  markManuallyInstalled,
  needsManualInstall,
  promptInstall,
  subscribeInstallPrompt,
} from '../../util/installPrompt'
import { getCurrentTenant } from '../../util/pwaManifest'
import './installAppButton.scss'

// Regras de exibição:
// - Rodando como app instalado (standalone): nunca mostra.
// - Chrome/Edge/Android: mostra apenas enquanto o navegador oferece a instalação (beforeinstallprompt).
//   Depois de instalado o navegador deixa de disparar o evento, e o botão some.
// - iOS / Safari macOS: não há evento nem como detectar a instalação; mostra instruções
//   até o usuário confirmar que adicionou o app.
const computeState = (tenantPath) => {
  if (isRunningInstalled()) return { visible: false, manual: false }
  if (canPromptInstall()) return { visible: true, manual: false }
  if (needsManualInstall() && !isManuallyInstalled(tenantPath)) return { visible: true, manual: true }
  return { visible: false, manual: false }
}

const InstallAppButton = ({ className = '' }) => {
  const tenant = getCurrentTenant()
  const [state, setState] = useState(() => computeState(tenant.path))
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    const update = () => setState(computeState(tenant.path))
    const unsubscribe = subscribeInstallPrompt(update)
    const media = window.matchMedia?.('(display-mode: standalone)')
    media?.addEventListener?.('change', update)
    update()
    return () => {
      unsubscribe()
      media?.removeEventListener?.('change', update)
    }
  }, [tenant.path])

  if (!state.visible) return null

  const handleClick = async () => {
    if (state.manual) {
      setShowInstructions(true)
      return
    }
    await promptInstall()
    setState(computeState(tenant.path))
  }

  const confirmManualInstall = () => {
    markManuallyInstalled(tenant.path)
    setShowInstructions(false)
  }

  const ios = isIOSDevice()

  return (
    <>
      <button type='button' className={`install-app-button ${className}`} onClick={handleClick}>
        <FiDownload aria-hidden='true' />
        <span>Instalar Aplicativo</span>
      </button>

      {showInstructions && (
        <div className='install-app-modal' role='dialog' aria-modal='true' aria-labelledby='install-app-modal-title'>
          <div className='install-app-modal__card'>
            <button
              type='button'
              className='install-app-modal__close'
              onClick={() => setShowInstructions(false)}
              aria-label='Fechar'
            >
              <FiX />
            </button>
            <h2 id='install-app-modal-title' className='install-app-modal__title'>Instalar {tenant.nome}</h2>
            {ios ? (
              <ol className='install-app-modal__steps'>
                <li>
                  Toque em <FiShare className='install-app-modal__icon' aria-label='Compartilhar' /> <strong>Compartilhar</strong> na barra do Safari.
                </li>
                <li>
                  Escolha <FiPlusSquare className='install-app-modal__icon' aria-hidden='true' /> <strong>Adicionar à Tela de Início</strong>.
                </li>
                <li>Toque em <strong>Adicionar</strong>.</li>
              </ol>
            ) : (
              <ol className='install-app-modal__steps'>
                <li>No menu do Safari, abra <strong>Arquivo</strong>.</li>
                <li>Escolha <strong>Adicionar ao Dock</strong>.</li>
                <li>Clique em <strong>Adicionar</strong>.</li>
              </ol>
            )}
            <div className='install-app-modal__actions'>
              <button type='button' className='install-app-modal__secondary' onClick={() => setShowInstructions(false)}>
                Agora não
              </button>
              <button type='button' className='install-app-modal__primary' onClick={confirmManualInstall}>
                Já instalei
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InstallAppButton
