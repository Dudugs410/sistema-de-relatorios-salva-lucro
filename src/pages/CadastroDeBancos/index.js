// Bancos.jsx
import { useEffect, useState, useCallback, useContext } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import Joyride from 'react-joyride'
import { FiHelpCircle, FiUsers, FiUser } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'
import TabelaBancos from './TabelaBancos'
import ModalBanco from './ModalBanco'
import './Bancos.scss'

// Custom Select styles
const customSelectStyles = {
  control: (base, { isFocused }) => ({
    ...base,
    minWidth: 250,
    width: '100%',
    backgroundColor: 'var(--background-color)',
    borderColor: isFocused ? 'var(--secondary-color)' : 'var(--bs-border-color)',
    color: 'var(--font-color)',
    '&:hover': {
      borderColor: 'var(--secondary-color)',
    },
    boxShadow: isFocused ? '0 0 0 1px var(--secondary-color)' : 'none',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--background-color)',
    borderColor: 'var(--bs-border-color)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: 'var(--background-color)',
    padding: '4px 0',
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
    '::-webkit-scrollbar-thumb': {
      background: 'var(--secondary-color)',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: 'var(--primary-color)',
    },
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected 
      ? 'var(--secondary-color)' 
      : isFocused 
        ? 'rgba(var(--secondary-color-rgb), 0.2)' 
        : 'transparent',
    color: isSelected ? 'var(--primary-color)' : 'var(--font-color)',
    cursor: 'pointer',
    padding: '8px 12px',
    '&:active': {
      backgroundColor: 'var(--secondary-color)',
      color: 'var(--primary-color)',
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--font-color)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '90%',
  }),
  input: (base) => ({
    ...base,
    color: 'var(--font-color)',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--font-color)',
    opacity: 0.6,
  }),
  valueContainer: (base) => ({
    ...base,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: 'var(--font-color)',
    '&:hover': {
      color: 'var(--secondary-color)',
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: 'var(--font-color)',
    '&:hover': {
      color: 'var(--secondary-color)',
    },
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: 'var(--bs-border-color)',
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: 'var(--font-color)',
  }),
  loadingMessage: (base) => ({
    ...base,
    color: 'var(--font-color)',
  }),
}

// Helper function to get icon based on type
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

  // State for client selection
  const [clientOptions, setClientOptions] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [loadingClients, setLoadingClients] = useState(false)

  // State for banks data
  const [banksList, setBanksList] = useState([])
  const [isLoadingBanks, setIsLoadingBanks] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBank, setEditingBank] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for tutorial
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

  // Load client options from localStorage
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

      // Reset selected client on page load - user must select one
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

  // Load banks for selected client using context's loadBanks (GET /banco/cliente)
  const fetchBanks = useCallback(async () => {
    if (!selectedClient || !selectedClient.cod) {
      toast.warning('Selecione um cliente primeiro')
      return
    }

    // loadBanks reads clientCode from localStorage
    localStorage.setItem('clientCode', selectedClient.cod)

    try {
      setIsLoadingBanks(true)
      toast.dismiss()

      const data = await loadBanks() || []

      setBanksList(data)
      setIsDataLoaded(true)

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

  // Load clients on component mount
  useEffect(() => {
    loadClientOptions()
  }, [loadClientOptions])

  // Handle client selection
  const handleClientChange = (option) => {
    setSelectedClient(option)
    setBanksList([])
    setIsDataLoaded(false)
  }

  // Handle search button click
  const handleSearch = (e) => {
    e.preventDefault()
    fetchBanks()
  }

  // Reset values and go back
  const resetValues = () => {
    setBanksList([])
    setIsDataLoaded(false)
    setSelectedClient(null)
    setRunTutorial(false)
    localStorage.removeItem('selectedBancosClient')
  }

  // Handle add bank - opens modal
  const handleAddBank = () => {
    if (!selectedClient) {
      toast.warning('Selecione um cliente primeiro')
      return
    }
    setEditingBank(null)
    setIsModalOpen(true)
  }

  // Handle edit bank - opens modal with bank data
  const handleEditBank = (bank) => {
    setEditingBank(bank)
    setIsModalOpen(true)
  }

  // Handle view cards
  const handleViewCards = (bank) => {
    toast.info(`Ver cartões do banco: ${bank.NOMECEDENTE || bank.CODIGOBANCO}`)
    console.log('View cards for bank:', bank)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBank(null)
  }

  // Handle save (add or edit) — modal builds the payload including CODIGO when editing
  const handleSaveBank = useCallback(async (payload) => {
    setIsSubmitting(true)
    try {
      const result = editingBank
        ? await editBank(payload)   // payload includes CODIGO from the modal
        : await addBank(payload)    // addBank strips CODIGO internally

      if (result && result.success) {
        await fetchBanks()
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

  // Handle delete — receives the full bank object and builds the payload matching the API body
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
      await fetchBanks()
    }
    return result
  }, [deleteBank, fetchBanks])

  return (
    <div className='page-content-global'>
      <div className='component-container-vendas'>
        <div className='title-container-global'>
          <h1 className='title-global'>Cadastro de Bancos</h1>
        </div>
        <hr className='hr-global'/>

        {!isDataLoaded ? (
          <>
            {/* Joyride for initial view */}
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
                    primaryColor: '#99cc33',
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

            <div className='select-container-bancos'>
              <div className='select-wrapper' data-tour="cliente-section">
                <h5>Cliente / Filial</h5>
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
                  styles={customSelectStyles}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: 'var(--secondary-color)',
                      primary75: 'var(--secondary-color)',
                      primary50: 'rgba(var(--secondary-color-rgb), 0.5)',
                      primary25: 'rgba(var(--secondary-color-rgb), 0.25)',
                      neutral0: 'var(--background-color)',
                      neutral5: 'var(--background-color)',
                      neutral10: 'var(--background-color)',
                      neutral20: 'var(--bs-border-color)',
                      neutral30: 'var(--bs-border-color)',
                      neutral40: 'var(--font-color)',
                      neutral50: 'var(--font-color)',
                      neutral60: 'var(--font-color)',
                      neutral70: 'var(--font-color)',
                      neutral80: 'var(--font-color)',
                      neutral90: 'var(--font-color)',
                    },
                  })}
                />
              </div>

              <div className='select-wrapper' data-tour="pesquisar-section">
                <h5>&nbsp;</h5>
                <button 
                  className='btn btn-search'
                  onClick={handleSearch}
                  disabled={!selectedClient || isLoadingBanks}
                >
                  {isLoadingBanks ? 'Carregando...' : 'Pesquisar'}
                </button>
              </div>
            </div>

            <button 
              className='btn btn-tutorial'
              onClick={() => {
                setRunTutorial(false)
                setTimeout(() => {
                  setRunTutorial(true)
                }, 50)
              }}
            >
              <FiHelpCircle />
            </button>
          </>
        ) : (
          <>
            <TabelaBancos 
              banksList={banksList}
              selectedClient={selectedClient}
              onRefresh={fetchBanks}
              onGoBack={resetValues}
              onAddBank={handleAddBank}
              onEditBank={handleEditBank}
              onViewCards={handleViewCards}
              onDeleteBank={handleDeleteBank}
            />
          </>
        )}
      </div>

      {/* Modal for Add/Edit Bank */}
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
    </div>
  )
}

export default Bancos