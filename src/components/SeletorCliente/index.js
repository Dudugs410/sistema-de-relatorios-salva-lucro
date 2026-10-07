import { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import { AuthContext } from '../../contexts/auth'
import { cancelOngoingRequests } from '../../services/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Seletor.scss'
import { FiChevronDown, FiUsers, FiUser, FiCheck } from 'react-icons/fi'

const SeletorCliente = ({ onClose }) => {
  const {
    changedOption, setChangedOption,
    setIsLoadedDashboard,
    setIsLoadedSalesDashboard,
    setIsLoadedCreditsDashboard,
    setIsLoadedServicesDashboard,
    setExportName,
    setSalesPageArray,
    setCreditsPageArray,
    setServicesPageArray,
    setDisplayGroup,
    setDisplayClient,
    setCanceledSales,
    setCanceledCredits,
    setCanceledServices
  } = useContext(AuthContext)

  const [selectorGroupList, setSelectorGroupList] = useState(
    JSON.parse(localStorage.getItem('groupsStorage')) || []
  )
  const [isLoading, setIsLoading] = useState(false)
  const [groupOptions, setGroupOptions] = useState([])
  const [clientOptions, setClientOptions] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#fff',
      borderColor: state.isFocused ? 'var(--highlight-color)' : '#d1d5db',
      borderRadius: '8px',
      padding: '4px 8px',
      minHeight: '48px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(var(--highlight-color-rgb), 0.15)' : 'none',
      '&:hover': {
        borderColor: 'var(--highlight-color)'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'var(--highlight-color)' : 
                      state.isFocused ? 'rgba(var(--highlight-color-rgb), 0.12)' : 'white',
      color: state.isSelected ? 'var(--on-highlight-color)' : '#1f2937',
      padding: '12px 16px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '14px'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1f2937',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      zIndex: 9999
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        color: 'var(--highlight-color)'
      }
    })
  }

  const getIcon = (type) => {
    switch(type) {
      case 'users':
        return <FiUsers size={16} />;
      case 'user':
        return <FiUser size={16} />;
      case 'check':
        return <FiCheck size={16} />;
      default:
        return null;
    }
  }

  const formatOptionLabel = ({ label, iconType }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {getIcon(iconType)}
      <span>{label}</span>
    </div>
  )

  const handleLoad = async (e) => {
    e.preventDefault()
    if (!selectedGroup || !selectedClient) {
      toast.warning('Selecione um grupo e um cliente/filial')
      return
    }

    setIsLoading(true)
    
    try {
      cancelOngoingRequests()
      setIsLoadedDashboard(false)
      setIsLoadedSalesDashboard(false)
      setIsLoadedCreditsDashboard(false)
      setIsLoadedServicesDashboard(false)
      setChangedOption(!changedOption)
      setCanceledSales(false)
      setCanceledCredits(false)
      setCanceledServices(false)
      
      if (selectedGroup && selectedClient) {
        setDisplayGroup(selectedGroup.label)
        setDisplayClient(selectedClient.label)
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    localStorage.setItem('selectedGroupBody', JSON.stringify(selectedGroup))
    localStorage.setItem('selectedClientBody', JSON.stringify(selectedClient))
  },[])

  useEffect(() => {
    if (selectorGroupList && selectorGroupList.length > 0) {
      const sortedOptions = selectorGroupList
        .map((GRU) => ({
          value: GRU.CODIGOGRUPO,
          label: GRU.NOMEGRUPO,
          clients: GRU.CLIENTES,
          iconType: 'users'
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
      setGroupOptions(sortedOptions)

      const isFirstLoad = localStorage.getItem('isSelected') !== 'true'
      
      if (isFirstLoad) {
        if (sortedOptions.length > 0) {
          const initialGroup = sortedOptions[0]
          const initialClientOptions = getClientOptions(initialGroup)
          
          setSelectedGroup({
            ...initialGroup,
            icon: undefined
          })
          setClientOptions(initialClientOptions)
          setSelectedClient({
            ...initialClientOptions[0],
            icon: undefined
          })
          
          updateLocalStorage(initialGroup, initialClientOptions, initialClientOptions[0])
        }
      } else {
        restoreFromLocalStorage()
      }
    }
  }, [selectorGroupList])

  useEffect(() => {
    if (selectedGroup) {
      const options = getClientOptions(selectedGroup)
      setClientOptions(options)
      localStorage.setItem('selectedGroupBody', JSON.stringify(selectedGroup))
      if (!localStorage.getItem('selectedClient')) {
        setSelectedClient({
          ...options[0],
          icon: undefined
        })
        localStorage.setItem('selectedClient', JSON.stringify(options[0]))
      }

      localStorage.setItem('clientOptions', JSON.stringify(options))
      localStorage.setItem('groupName', selectedGroup.label)
      localStorage.setItem('groupClients', JSON.stringify(selectedGroup.clients))
      
      const groupToStore = {
        value: selectedGroup.value,
        label: selectedGroup.label,
        clients: selectedGroup.clients,
        iconType: selectedGroup.iconType
      }
      localStorage.setItem('selectedGroup', JSON.stringify(groupToStore))
      localStorage.setItem('groupCode', selectedGroup.value)
    }
  }, [selectedGroup])

  useEffect(() => {
    setSalesPageArray([])
    setCreditsPageArray([])
    setServicesPageArray([])
    localStorage.setItem('selectedClientBody', JSON.stringify(selectedClient))
    if (selectedClient && selectedClient.label !== 'TODOS') {
      localStorage.setItem('cnpj', selectedClient.value)
      localStorage.setItem('clientCode', selectedClient.cod)
      setExportName(selectedClient.label)
    } else if (selectedClient) {
      localStorage.setItem('cnpj', selectedClient.value)
      localStorage.setItem('clientCode', 'todos')
      setExportName(selectedGroup ? `${selectedGroup.label}_TODAS_FILIAIS` : '')
    }
  }, [selectedClient, selectedGroup])

  const getClientOptions = (group) => {
    const todosOption = { 
      label: 'TODOS', 
      value: 'todos',
      cod: 'todos',
      iconType: 'users'
    }
    
    const foundGroup = groupOptions.find((option) => option.value === group.value)
    if (foundGroup) {
      const sortedClientOptions = foundGroup.clients
        .map((CLI) => ({
          value: CLI.CNPJ,
          label: CLI.NOMECLIENTE,
          cod: CLI.CODIGOCLIENTE,
          iconType: 'user'
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
      return [todosOption, ...sortedClientOptions]
    }
    return [todosOption]
  }

  const updateLocalStorage = (group, clientOptions, client) => {
    const groupToStore = {
      value: group.value,
      label: group.label,
      clients: group.clients,
      iconType: group.iconType
    }
    
    const clientToStore = {
      value: client.value,
      label: client.label,
      cod: client.cod,
      iconType: client.iconType
    }
    
    localStorage.setItem('selectedGroup', JSON.stringify(groupToStore))
    localStorage.setItem('clientOptions', JSON.stringify(clientOptions.map(opt => ({
      value: opt.value,
      label: opt.label,
      cod: opt.cod,
      iconType: opt.iconType
    }))))
    localStorage.setItem('selectedClient', JSON.stringify(clientToStore))
    localStorage.setItem('groupCode', group.value)
    localStorage.setItem('isSelected', 'true')
  }

  const restoreFromLocalStorage = () => {
    const savedGroup = localStorage.getItem('selectedGroup')
    const savedClientOptions = localStorage.getItem('clientOptions')
    const savedClient = localStorage.getItem('selectedClient')

    if (savedGroup) {
      const parsedGroup = JSON.parse(savedGroup)
      setSelectedGroup({
        ...parsedGroup,
        icon: undefined
      })
    }
    
    if (savedClientOptions) {
      const parsedClientOptions = JSON.parse(savedClientOptions)
      setClientOptions(parsedClientOptions)
    }
    
    if (savedClient) {
      const parsedClient = JSON.parse(savedClient)
      setSelectedClient({
        ...parsedClient,
        icon: undefined
      })
    }
  }

  const handleGroupChange = (selected) => {
    const cleanedSelected = {
      value: selected.value,
      label: selected.label,
      clients: selected.clients,
      iconType: selected.iconType
    }
    
    setSelectedGroup(cleanedSelected)
    const options = getClientOptions(cleanedSelected)
    setClientOptions(options)
    
    const firstClient = {
      ...options[0],
      icon: undefined
    }
    setSelectedClient(firstClient)
    
    updateLocalStorage(cleanedSelected, options, firstClient)
  }

  const handleClientChange = (selected) => {
    cancelOngoingRequests()
    const cleanedSelected = {
      value: selected.value,
      label: selected.label,
      cod: selected.cod,
      iconType: selected.iconType
    }
    setSelectedClient(cleanedSelected)
    localStorage.setItem('selectedClient', JSON.stringify(cleanedSelected))
  }

  return (
    <div className="selector-modal">
      <div className="selector-overlay" onClick={onClose} />
      <div className="selector-container">
        <div className="selector-header">
          <h2 className="selector-title">
            <FiUsers className="selector-title-icon" />
            Selecione o Grupo e Cliente/Filial
          </h2>
          <p className="selector-subtitle">
            Escolha o grupo e cliente/filial para visualizar os dados
          </p>
        </div>

        <form className="selector-form" onSubmit={handleLoad}>
          <div className="selector-fields">
            <div className="selector-field">
              <label className="selector-label">
                <FiUsers className="selector-label-icon" />
                Grupo
              </label>
              <Select
                styles={customStyles}
                options={groupOptions}
                onChange={handleGroupChange}
                value={selectedGroup}
                formatOptionLabel={formatOptionLabel}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                isSearchable
                placeholder="Selecione um grupo..."
                noOptionsMessage={() => "Nenhum grupo disponível"}
              />
            </div>

            <div className="selector-field">
              <label className="selector-label">
                <FiUser className="selector-label-icon" />
                Cliente / Filial
              </label>
              <Select
                styles={customStyles}
                options={clientOptions}
                onChange={handleClientChange}
                value={selectedClient}
                formatOptionLabel={formatOptionLabel}
                isDisabled={!selectedGroup}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                isSearchable
                placeholder={selectedGroup ? "Selecione o cliente/filial..." : "Selecione um grupo primeiro"}
                noOptionsMessage={() => "Nenhum cliente/filial disponível"}
              />
            </div>
          </div>

          <div className="selector-summary">
            {selectedGroup && selectedClient && (
              <div className="summary-card">
                <div className="summary-item">
                  <span className="summary-label">Grupo selecionado:</span>
                  <span className="summary-value">{selectedGroup.label}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Cliente/Filial:</span>
                  <span className="summary-value">{selectedClient.label}</span>
                </div>
              </div>
            )}
          </div>

          <div className="selector-actions">
            <button
              type="button"
              className="selector-btn selector-btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="selector-btn selector-btn-primary"
              disabled={!selectedGroup || !selectedClient || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Carregando...
                </>
              ) : (
                <>
                  <FiCheck className="me-2" />
                  Aplicar Seleção
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SeletorCliente