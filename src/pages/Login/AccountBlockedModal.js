import { useEffect, useRef } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import './accountBlockedModal.css'

const SUPPORT_PHONE_LABEL = '(51) 9149-2740'
const SUPPORT_WHATSAPP_URL = 'https://wa.me/555191492740'

const AccountBlockedModal = ({ onClose }) => {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className='account-blocked-overlay' onClick={onClose}>
      <div
        className='account-blocked-modal'
        role='alertdialog'
        aria-modal='true'
        aria-labelledby='account-blocked-title'
        aria-describedby='account-blocked-message'
        onClick={(event) => event.stopPropagation()}
      >
        <FiAlertCircle className='account-blocked-icon' aria-hidden='true' />
        <h2 id='account-blocked-title' className='account-blocked-title'>Acesso indisponível</h2>
        <div id='account-blocked-message' className='account-blocked-message'>
          <p>
            Olá! No momento, o acesso ao sistema está temporariamente indisponível devido a uma pendência financeira.
          </p>
          <p>
            Para verificar a situação e realizar a regularização, entre em contato conosco pelo WhatsApp:{' '}
            <a href={SUPPORT_WHATSAPP_URL} target='_blank' rel='noopener noreferrer'>{SUPPORT_PHONE_LABEL}</a>.
          </p>
          <p>Estamos à disposição para ajudar!</p>
        </div>
        <button ref={closeButtonRef} type='button' className='btn btn-primary account-blocked-button' onClick={onClose}>
          Entendi
        </button>
      </div>
    </div>
  )
}

export default AccountBlockedModal
