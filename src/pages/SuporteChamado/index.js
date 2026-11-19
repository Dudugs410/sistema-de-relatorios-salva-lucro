import { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { FiSend } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'
import PageShell from '../../components/PageShell'
import { createSupportTicket } from '../../services/supportService'
import { getApiErrorMessage } from '../../services/apiErrors'
import { selectStyles, selectTheme } from '../../util/selectStyles'
import './suporteChamado.scss'

const MAX_DESCRICAO = 2000

const readJSON = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

// Clientes do grupo selecionado no cabeçalho (mesma origem dos relatórios).
// Se não houver grupo selecionado, usa todos os clientes disponíveis ao usuário.
const buildClientOptions = () => {
  const grupo = readJSON('selectedGroupBody') || readJSON('selectedGroup')
  const clients = grupo?.clients?.length
    ? grupo.clients
    : (readJSON('groupsStorage') || []).flatMap((g) => g.CLIENTES || [])

  const seen = new Set()
  return clients
    .filter((c) => c?.CODIGOCLIENTE != null && !seen.has(c.CODIGOCLIENTE) && seen.add(c.CODIGOCLIENTE))
    .map((c) => ({ value: c.CODIGOCLIENTE, label: c.NOMECLIENTE, cnpj: c.CNPJ }))
    .sort((a, b) => String(a.label).localeCompare(String(b.label)))
}

const getDefaultClient = (options) => {
  const cliente = readJSON('selectedClientBody')
  if (!cliente || cliente.label === 'TODOS') return options.length === 1 ? options[0] : null
  return options.find((o) => String(o.value) === String(cliente.cod)) || null
}

const SuporteChamado = () => {
  const location = useLocation()
  const { loadAdmins } = useContext(AuthContext)

  const userEmail = readJSON('userData')?.EMAIL || ''
  const clientOptions = useMemo(buildClientOptions, [])

  const [cliente, setCliente] = useState(() => getDefaultClient(clientOptions))
  const [adquirente, setAdquirente] = useState(null)
  const [listaAdquirentes, setListaAdquirentes] = useState([])
  const [descricao, setDescricao] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    localStorage.setItem('currentPath', location.pathname)
  }, [location])

  useEffect(() => {
    const carregar = async () => setListaAdquirentes((await loadAdmins()) || [])
    carregar()
  }, [loadAdmins])

  const resetForm = () => {
    setAdquirente(null)
    setDescricao('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!cliente) return toast.warning('Selecione o cliente')
    if (!adquirente) return toast.warning('Selecione a adquirente')
    if (!descricao.trim()) return toast.warning('Descreva o motivo do chamado')
    if (!userEmail) return toast.error('Não foi possível identificar o e-mail do usuário. Faça login novamente.')

    setIsSubmitting(true)
    try {
      const response = await createSupportTicket({
        codigoCliente: cliente.value,
        codigoAdquirente: adquirente.codigoAdquirente,
        descricao: descricao.trim(),
        contato: userEmail,
      })
      toast.success(response.data?.mensagem || 'Chamado aberto com sucesso! Nossa equipe entrará em contato.')
      resetForm()
    } catch (error) {
      console.error('Erro ao abrir chamado:', error.response?.status, error.response?.data ?? error)
      toast.error(getApiErrorMessage(error, 'Erro ao abrir chamado. Tente novamente mais tarde.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageShell title='Suporte'>
      <form className='suporte-chamado' onSubmit={handleSubmit}>
        <div className='suporte-chamado__grid'>
          <div className='suporte-chamado__field'>
            <label className='page-filter__label' htmlFor='chamado-cliente'>Cliente *</label>
            <Select
              inputId='chamado-cliente'
              options={clientOptions}
              value={cliente}
              onChange={setCliente}
              placeholder='Selecione um cliente...'
              noOptionsMessage={() => 'Nenhum cliente disponível'}
              isDisabled={isSubmitting}
              menuPortalTarget={document.body}
              menuPosition='fixed'
              styles={selectStyles}
              theme={selectTheme}
            />
          </div>

          <div className='suporte-chamado__field'>
            <label className='page-filter__label' htmlFor='chamado-adquirente'>Adquirente *</label>
            <Select
              inputId='chamado-adquirente'
              options={listaAdquirentes}
              getOptionLabel={(o) => o.nomeAdquirente}
              getOptionValue={(o) => o.codigoAdquirente}
              value={adquirente}
              onChange={setAdquirente}
              placeholder='Selecione uma adquirente...'
              noOptionsMessage={() => 'Nenhuma adquirente disponível'}
              isClearable
              isDisabled={isSubmitting}
              menuPortalTarget={document.body}
              menuPosition='fixed'
              styles={selectStyles}
              theme={selectTheme}
            />
          </div>

          <div className='suporte-chamado__field suporte-chamado__field--full'>
            <label className='page-filter__label' htmlFor='chamado-contato'>E-mail para contato</label>
            <input id='chamado-contato' className='form-control' type='email' value={userEmail} readOnly />
          </div>

          <div className='suporte-chamado__field suporte-chamado__field--full'>
            <label className='page-filter__label' htmlFor='chamado-descricao'>Descrição *</label>
            <textarea
              id='chamado-descricao'
              className='form-control suporte-chamado__textarea'
              rows={6}
              maxLength={MAX_DESCRICAO}
              placeholder='Descreva sua solicitação. Ex.: Verificar a diferença entre o valor previsto e o valor creditado.'
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              disabled={isSubmitting}
            />
            <small className='suporte-chamado__counter'>{descricao.length}/{MAX_DESCRICAO}</small>
          </div>
        </div>

        <div className='suporte-chamado__actions'>
          <button type='submit' className='btn suporte-chamado__submit' disabled={isSubmitting}>
            <FiSend /> {isSubmitting ? 'Enviando...' : 'Abrir chamado'}
          </button>
        </div>
      </form>
    </PageShell>
  )
}

export default SuporteChamado
