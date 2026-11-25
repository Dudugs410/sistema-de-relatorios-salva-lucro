import { useLocation, useNavigate } from 'react-router-dom'
import { FiMessageSquare } from 'react-icons/fi'
import './supportChatButton.scss'

const SUPPORT_PATH = '/suporte'

// Atalho flutuante para a abertura de chamado, exibido em todas as telas logadas.
// Complementa o item "Suporte" do menu do usuário no cabeçalho.
const SupportChatButton = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  if (pathname === SUPPORT_PATH) return null

  return (
    <button
      type='button'
      className='support-chat-button'
      onClick={() => navigate(SUPPORT_PATH)}
      aria-label='Abrir suporte'
    >
      <FiMessageSquare className='support-chat-button__icon' aria-hidden='true' />
      <span className='support-chat-button__label'>Suporte</span>
    </button>
  )
}

export default SupportChatButton
