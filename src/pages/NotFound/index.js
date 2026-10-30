import { useNavigate } from 'react-router-dom'
import { FiCompass } from 'react-icons/fi'
import PageShell from '../../components/PageShell'
import './notFound.scss'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <PageShell title='Página não encontrada'>
      <div className='not-found'>
        <FiCompass className='not-found__icon' aria-hidden='true' />
        <p className='not-found__message'>
          O endereço acessado não existe ou não está mais disponível.
          Use o menu lateral para navegar ou volte para o início.
        </p>
        <button type='button' className='btn btn-primary btn-global not-found__button' onClick={() => navigate('/dashboard')}>
          Voltar ao início
        </button>
      </div>
    </PageShell>
  )
}

export default NotFound
