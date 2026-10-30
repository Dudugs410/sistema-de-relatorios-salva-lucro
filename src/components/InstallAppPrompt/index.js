import { useEffect, useState } from 'react'
import { FiDownload, FiShare, FiMoreVertical, FiX } from 'react-icons/fi'
import {
  canPromptInstall,
  isInstallPromptSnoozed,
  isIOSDevice,
  isMobileDevice,
  isRunningInstalled,
  promptInstall,
  snoozeInstallPrompt,
  subscribeInstallPrompt,
} from '../../util/installPrompt'
import './installAppPrompt.scss'

const SHOW_DELAY_MS = 3000

const shouldOffer = () => isMobileDevice() && !isRunningInstalled() && !isInstallPromptSnoozed()

const InstallAppPrompt = () => {
  const [visible, setVisible] = useState(false)
  const [nativeAvailable, setNativeAvailable] = useState(canPromptInstall())

  useEffect(() => {
    const unsubscribe = subscribeInstallPrompt(() => {
      setNativeAvailable(canPromptInstall())
      if (isRunningInstalled()) setVisible(false)
    })
    const timer = setTimeout(() => setVisible(shouldOffer()), SHOW_DELAY_MS)
    return () => {
      unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  if (!visible) return null

  const dismiss = () => {
    snoozeInstallPrompt()
    setVisible(false)
  }

  const handleInstall = async () => {
    const outcome = await promptInstall()
    if (outcome === 'accepted') setVisible(false)
    else if (outcome === 'dismissed') dismiss()
  }

  const ios = isIOSDevice()

  return (
    <div className='install-prompt' role='dialog' aria-labelledby='install-prompt-title'>
      <button type='button' className='install-prompt__close' onClick={dismiss} aria-label='Fechar'>
        <FiX />
      </button>
      <div className='install-prompt__icon' aria-hidden='true'>
        <FiDownload />
      </div>
      <div className='install-prompt__content'>
        <p id='install-prompt-title' className='install-prompt__title'>Instale o app no seu celular</p>
        {nativeAvailable ? (
          <>
            <p className='install-prompt__text'>Acesse mais rápido, direto da tela inicial.</p>
            <button type='button' className='install-prompt__action' onClick={handleInstall}>
              Instalar
            </button>
          </>
        ) : ios ? (
          <p className='install-prompt__text'>
            Toque em <FiShare className='install-prompt__inline-icon' aria-label='Compartilhar' /> <strong>Compartilhar</strong> e
            depois em <strong>Adicionar à Tela de Início</strong>.
          </p>
        ) : (
          <p className='install-prompt__text'>
            Abra o menu do navegador <FiMoreVertical className='install-prompt__inline-icon' aria-label='menu' /> e toque em{' '}
            <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.
          </p>
        )}
      </div>
    </div>
  )
}

export default InstallAppPrompt
