import { useEffect, useState, useCallback, useContext } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import Joyride from 'react-joyride'
import { FiUsers, FiUser } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'
import TabelaBancos from './TabelaBancos'
import ModalBanco from './ModalBanco'
import './Bancos.scss'
import PageShell from '../../components/PageShell'
import TutorialButton from '../../components/TutorialButton'
import { selectStyles, selectTheme } from '../../util/selectStyles'
import { getThemeColor } from '../../util/contextUtils'

const getIcon = (type) => {
  switch(type) {
    case 'users':
      return <FiUsers size={16} />
    case 'user':
      return <FiUser size={16} />
    default:
      return null
  }
}

const formatOptionLabel = ({ label, iconType }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    {getIcon(iconType)}
    <span>{label}</span>
  </div>
)

const Bancos = () => {
  const { 
    loadBanks,
    addBank,
    editBank,
    deleteBank,
  } = useContext(AuthContext)

  const [clientOptions, setClientOptions] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [loadingClients, setLoadingClients] = useState(false)

  const [banksList, setBanksList] = useState([])
  const [isLoadingBanks, setIsLoadingBanks] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBank, setEditingBank] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [runTutorial, setRunTutorial] = useState(false)
  const [tutorialSteps] = useState([
    {
      target: '[data-tour="cliente-section"]',
      content: 'Selecione o cliente/filial para visualizar os bancos cadastrados.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '[data-tour="pesquisar-section"]',
      content: 'Clique em "Pesquisar" para carregar a lista de bancos.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="tabela-section"]',
      content: 'Lista de bancos cadastrados para o cliente selecionado.',
      placement: 'bottom',
    },
  ])

  const loadClientOptions = useCallback(() => {
    try {
      setLoadingClients(true)
      
      const groupsStorage = localStorage.getItem('groupsStorage')
      if (!groupsStorage) {
        toast.error('Nenhum grupo encontrado')
        setLoadingClients(false)
        return
      }

      const groups = JSON.parse(groupsStorage)
      const allClients = []
      
      groups.forEach(group => {
        if (group.CLIENTES && group.CLIENTES.length > 0) {
          group.CLIENTES.forEach(client => {
            const exists = allClients.some(c => c.value === client.CNPJ)
            if (!exists) {
              allClients.push({
                value: client.CNPJ,
                label: client.NOMECLIENTE,
                cod: client.CODIGOCLIENTE,
                groupName: group.NOMEGRUPO,
                iconType: 'user'
              })
            }
          })
        }
      })

      const sortedClients = allClients.sort((a, b) => a.label.localeCompare(b.label))
      setClientOptions(sortedClients)

      setSelectedClient(null)
      setBanksList([])
      setIsDataLoaded(false)
      localStorage.removeItem('selectedBancosClient')
    } catch (error) {
      console.error('Error loading client options:', error)
      toast.error('Erro ao carregar lista de clientes')
    } finally {
      setLoadingClients(false)
    }
  }, [])

  const fetchBanks = useCallback(async ({ silent = false } = {}) => {
    if (!selectedClient || !selectedClient.cod) {
      toast.warning('Selecione um cliente primeiro')
      return
    }

    try {
      setIsLoadingBanks(true)
      if (!silent) toast.dismiss()

      const data = await loadBanks(selectedClient.cod) || []

      setBanksList(data)
      setIsDataLoaded(true)

      if (silent) return
      if (data.length === 0) {
        toast.info('Não há bancos cadastrados para o cliente selecionado')
      } else {
        toast.success(`Encontrados ${data.length} bancos para este cliente`)
      }
    } catch (error) {
      console.error('Error loading banks:', error)
      toast.error('Erro ao carregar bancos')
      setBanksList([])
      setIsDataLoaded(true)
    } finally {
      setIsLoadingBanks(false)
    }
  }, [selectedClient, loadBanks])

  useEffect(() => {
    loadClientOptions()
  }, [loadClientOptions])

  const handleClientChange = (option) => {
    setSelectedClient(option)
    setBanksList([])
    setIsDataLoaded(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchBanks()
  }

  const resetValues = () => {
    setBanksList([])
    setIsDataLoaded(false)
    setSelectedClient(null)
    setRunTutorial(false)
    localStorage.removeItem('selectedBancosClient')
  }

  const handleAddBank = () => {
    if (!selectedClient) {
      toast.warning('Selecione um cliente primeiro')
      return
    }
    setEditingBank(null)
    setIsModalOpen(true)
  }

  const handleEditBank = (bank) => {
    setEditingBank(bank)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBank(null)
  }

  const handleSaveBank = useCallback(async (payload) => {
    setIsSubmitting(true)
    try {
      const result = editingBank
        ? await editBank(payload)
        : await addBank(payload)

      if (result && result.success) {
        await fetchBanks({ silent: true })
        setIsModalOpen(false)
        setEditingBank(null)
      }
      return result
    } catch (error) {
      console.error('Error saving bank:', error)
      return { success: false }
    } finally {
      setIsSubmitting(false)
    }
  }, [editingBank, addBank, editBank, fetchBanks])

  const handleDeleteBank = useCallback(async (bank) => {
    const payload = {
      CODIGO: bank.CODIGO,
      CLICODIGO: bank.CLICODIGO,
      CODIGOBANCO: bank.CODIGOBANCO,
      NOME: bank.NOME,
      NOMECEDENTE: bank.NOMECEDENTE,
      CNPJCEDENTE: bank.CNPJCEDENTE,
      CODIGOAGENCIA: bank.CODIGOAGENCIA,
      NUMEROCONTA: bank.NUMEROCONTA,
      DIGITOCONTA: bank.DIGITOCONTA,
    }

    const result = await deleteBank(payload)
    if (result && result.success) {
      await fetchBanks({ silent: true })
    }
    return result
  }, [deleteBank, fetchBanks])

  return (
    <>
      <PageShell title='Cadastro de Bancos'>

        {!isDataLoaded ? (
          <>
            {runTutorial && (
              <Joyride
                steps={tutorialSteps}
                run={runTutorial}
                continuous={true}
                scrollToFirstStep={true}
                showProgress={true}
                showSkipButton={true}
                scrollOffset={80}
                disableOverlayClose={true}
                styles={{
                  options: {
                    primaryColor: getThemeColor('--highlight-color', '#99cc33'),
                    textColor: '#0a3d70',
                    zIndex: 10000,
                  },
                }}
                callback={(data) => {
                  if (data.status === 'finished' || data.status === 'skipped') {
                    setRunTutorial(false)
                  }
                }}
                locale={{
                  back: 'Voltar',
                  close: 'Fechar',
                  last: 'Finalizar',
                  next: 'Próximo',
                  skip: 'Pular',
                  nextLabelWithProgress: 'Próximo ({step} de {steps})',
                }}
              />
            )}

            <div className='page-filters'>
              <div className='page-filter' data-tour="cliente-section">
                <h5 className='page-filter__label'>Cliente / Filial</h5>
                <Select
                  className='seletor-cliente-select fixed-width-select'
                  id='cliente'
                  options={clientOptions}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.cod}
                  onChange={handleClientChange}
                  value={selectedClient}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  placeholder={loadingClients ? "Carregando clientes..." : "Selecione um cliente/filial..."}
                  isClearable={true}
                  isLoading={loadingClients}
                  isDisabled={loadingClients}
                  formatOptionLabel={formatOptionLabel}
                  styles={selectStyles}
                  theme={selectTheme}
                />
              </div>

              <div className='page-filter' data-tour="pesquisar-section">
                <button 
                  className='btn btn-search'
                  onClick={handleSearch}
                  disabled={!selectedClient || isLoadingBanks}
                >
                  {isLoadingBanks ? 'Carregando...' : 'Pesquisar'}
                </button>
              </div>
            </div>

            <TutorialButton onStart={() => {
                setRunTutorial(false)
                setTimeout(() => setRunTutorial(true), 50)
              }} />
          </>
        ) : (
          <>
            <TabelaBancos 
              banksList={banksList}
              selectedClient={selectedClient}
              onRefresh={() => fetchBanks()}
              onGoBack={resetValues}
              onAddBank={handleAddBank}
              onEditBank={handleEditBank}
              onDeleteBank={handleDeleteBank}
            />
          </>
        )}
      </PageShell>

      {isModalOpen && (
        <ModalBanco
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveBank}
          bank={editingBank}
          selectedClient={selectedClient}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  )
}

export default Bancos