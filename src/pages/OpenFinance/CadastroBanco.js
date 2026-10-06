// CadastroBanco.jsx
import { useState, useEffect, useCallback } from 'react'
import Select from 'react-select'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiUsers, FiUser } from 'react-icons/fi'
import './CadastroBanco.scss'

// Custom Select styles (reuse from OpenFinance)
const customSelectStyles = {
  control: (base, { isFocused }) => ({
    ...base,
    minWidth: 200,
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
      return <FiUsers size={16} />;
    case 'user':
      return <FiUser size={16} />;
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

const CadastroBanco = ({ onBankRegistered }) => {
  // State for client selection
  const [clientOptions, setClientOptions] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [loadingClients, setLoadingClients] = useState(false)

  // State for form fields
  const [formData, setFormData] = useState({
    Adquirente: null,
    Agencia: '',
    Banco: '',
    Bandeira: null,
    CodigoBancoCliente: 0,
    CodigoCliente: null,
    CodigoClienteAdquirente: 0,
    CodigoEstabelecimento: '',
    Conta: '',
    Produto: null,
    Subproduto: null
  })

  // State for dropdown options
  const [bandeiraOptions, setBandeiraOptions] = useState([])
  const [adquirenteOptions, setAdquirenteOptions] = useState([])
  const [loadingBandeiras, setLoadingBandeiras] = useState(false)
  const [loadingAdquirentes, setLoadingAdquirentes] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Product options (placeholder - these are common values based on your example)
  const produtoOptions = [
    { value: 1, label: 'Crédito' },
    { value: 2, label: 'Débito' },
    { value: 3, label: 'Voucher' },
    { value: 4, label: 'Pix' }
  ]

  // Subproduct options (placeholder - adjust as needed)
  const subprodutoOptions = [
    { value: 1, label: 'Subproduto 1' },
    { value: 2, label: 'Subproduto 2' },
    { value: 3, label: 'Subproduto 3' },
    { value: 4, label: 'Subproduto 4' },
    { value: 5, label: 'Subproduto 5' },
    { value: 6, label: 'Subproduto 6' },
    { value: 7, label: 'Subproduto 7' },
    { value: 8, label: 'Subproduto 8' },
    { value: 9, label: 'Subproduto 9' },
    { value: 10, label: 'Subproduto 10' },
    { value: 11, label: 'Subproduto 11' },
    { value: 12, label: 'Subproduto 12' },
    { value: 13, label: 'Subproduto 13' },
    { value: 14, label: 'Subproduto 14' },
    { value: 15, label: 'Subproduto 15' },
    { value: 16, label: 'Subproduto 16' },
    { value: 17, label: 'Subproduto 17' },
    { value: 18, label: 'Subproduto 18' },
    { value: 19, label: 'Subproduto 19' },
    { value: 20, label: 'Subproduto 20' },
    { value: 21, label: 'Subproduto 21' },
    { value: 22, label: 'Subproduto 22' },
    { value: 23, label: 'Subproduto 23' },
    { value: 24, label: 'Subproduto 24' },
    { value: 25, label: 'Subproduto 25' },
    { value: 26, label: 'Subproduto 26' },
    { value: 27, label: 'Subproduto 27' },
    { value: 28, label: 'Subproduto 28' },
    { value: 29, label: 'Subproduto 29' },
    { value: 30, label: 'Subproduto 30' },
    { value: 31, label: 'Subproduto 31' },
    { value: 32, label: 'Subproduto 32' },
    { value: 33, label: 'Subproduto 33' },
    { value: 34, label: 'Subproduto 34' },
    { value: 35, label: 'Subproduto 35' },
    { value: 36, label: 'Subproduto 36' },
    { value: 37, label: 'Subproduto 37' },
    { value: 38, label: 'Subproduto 38' },
    { value: 39, label: 'Subproduto 39' },
    { value: 40, label: 'Subproduto 40' },
    { value: 41, label: 'Subproduto 41' },
    { value: 42, label: 'Subproduto 42' },
    { value: 43, label: 'Subproduto 43' },
    { value: 44, label: 'Subproduto 44' },
    { value: 45, label: 'Subproduto 45' },
    { value: 46, label: 'Subproduto 46' },
    { value: 47, label: 'Subproduto 47' },
    { value: 48, label: 'Subproduto 48' },
    { value: 49, label: 'Subproduto 49' },
    { value: 50, label: 'Subproduto 50' },
    { value: 51, label: 'Subproduto 51' },
    { value: 52, label: 'Subproduto 52' },
    { value: 53, label: 'Subproduto 53' },
    { value: 54, label: 'Subproduto 54' },
    { value: 55, label: 'Subproduto 55' },
    { value: 56, label: 'Subproduto 56' },
    { value: 57, label: 'Subproduto 57' },
    { value: 58, label: 'Subproduto 58' },
    { value: 59, label: 'Subproduto 59' },
    { value: 60, label: 'Subproduto 60' },
    { value: 61, label: 'Subproduto 61' },
    { value: 62, label: 'Subproduto 62' },
    { value: 63, label: 'Subproduto 63' },
    { value: 64, label: 'Subproduto 64' },
    { value: 65, label: 'Subproduto 65' },
    { value: 66, label: 'Subproduto 66' },
    { value: 67, label: 'Subproduto 67' },
    { value: 68, label: 'Subproduto 68' },
    { value: 69, label: 'Subproduto 69' },
    { value: 70, label: 'Subproduto 70' },
    { value: 71, label: 'Subproduto 71' },
    { value: 72, label: 'Subproduto 72' },
    { value: 73, label: 'Subproduto 73' },
    { value: 74, label: 'Subproduto 74' },
    { value: 75, label: 'Subproduto 75' },
    { value: 76, label: 'Subproduto 76' },
    { value: 77, label: 'Subproduto 77' },
    { value: 78, label: 'Subproduto 78' },
    { value: 79, label: 'Subproduto 79' },
    { value: 80, label: 'Subproduto 80' },
    { value: 81, label: 'Subproduto 81' },
    { value: 82, label: 'Subproduto 82' },
    { value: 83, label: 'Subproduto 83' },
    { value: 84, label: 'Subproduto 84' },
    { value: 85, label: 'Subproduto 85' },
    { value: 86, label: 'Subproduto 86' },
    { value: 87, label: 'Subproduto 87' },
    { value: 88, label: 'Subproduto 88' },
    { value: 89, label: 'Subproduto 89' },
    { value: 90, label: 'Subproduto 90' },
    { value: 91, label: 'Subproduto 91' },
    { value: 92, label: 'Subproduto 92' },
    { value: 93, label: 'Subproduto 93' },
    { value: 94, label: 'Subproduto 94' },
    { value: 95, label: 'Subproduto 95' },
    { value: 96, label: 'Subproduto 96' },
    { value: 97, label: 'Subproduto 97' },
    { value: 98, label: 'Subproduto 98' },
    { value: 99, label: 'Subproduto 99' },
    { value: 100, label: 'Subproduto 100' }
  ]

  // Load client options from localStorage (same as OpenFinance)
  const loadClientOptions = useCallback(() => {
    try {
      setLoadingClients(true)
      
      // Get groups from localStorage
      const groupsStorage = localStorage.getItem('groupsStorage')
      if (!groupsStorage) {
        toast.error('Nenhum grupo encontrado')
        setLoadingClients(false)
        return
      }

      const groups = JSON.parse(groupsStorage)
      
      // Create client options from all groups
      const allClients = []
      
      groups.forEach(group => {
        if (group.CLIENTES && group.CLIENTES.length > 0) {
          group.CLIENTES.forEach(client => {
            // Check if client already exists in the list (deduplicate by CNPJ)
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

      // Sort clients by name
      const sortedClients = allClients.sort((a, b) => a.label.localeCompare(b.label))
      setClientOptions(sortedClients)

      // Restore previously selected client from localStorage
      const savedClient = localStorage.getItem('selectedOFCadastroClient')
      if (savedClient) {
        try {
          const parsedClient = JSON.parse(savedClient)
          const foundClient = sortedClients.find(c => c.cod === parsedClient.cod)
          if (foundClient) {
            setSelectedClient(foundClient)
            setFormData(prev => ({
              ...prev,
              CodigoCliente: foundClient.cod
            }))
          }
        } catch (e) {
          console.error('Error parsing saved client:', e)
        }
      }
    } catch (error) {
      console.error('Error loading client options:', error)
      toast.error('Erro ao carregar lista de clientes')
    } finally {
      setLoadingClients(false)
    }
  }, [])

  // Load Bandeiras
  const loadBandeiras = useCallback(async () => {
    try {
      setLoadingBandeiras(true)
      const response = await api.get('/bandeira')
      
      const options = response.data.map(item => ({
        value: item.codigoBandeira,
        label: item.descricaoBandeira,
        codigo: item.codigoBandeira,
        descricao: item.descricaoBandeira
      }))
      
      setBandeiraOptions(options)
    } catch (error) {
      console.error('Error loading bandeiras:', error)
      toast.error('Erro ao carregar lista de bandeiras')
    } finally {
      setLoadingBandeiras(false)
    }
  }, [])

  // Load Adquirentes
  const loadAdquirentes = useCallback(async () => {
    try {
      setLoadingAdquirentes(true)
      const response = await api.get('/adquirente')
      
      const options = response.data.map(item => ({
        value: item.codigoAdquirente,
        label: item.nomeAdquirente,
        codigo: item.codigoAdquirente,
        nome: item.nomeAdquirente
      }))
      
      setAdquirenteOptions(options)
    } catch (error) {
      console.error('Error loading adquirentes:', error)
      toast.error('Erro ao carregar lista de adquirentes')
    } finally {
      setLoadingAdquirentes(false)
    }
  }, [])

  // Load data on component mount
  useEffect(() => {
    loadClientOptions()
    loadBandeiras()
    loadAdquirentes()
  }, [loadClientOptions, loadBandeiras, loadAdquirentes])

  // Handle client selection
  const handleClientChange = (option) => {
    setSelectedClient(option)
    if (option) {
      localStorage.setItem('selectedOFCadastroClient', JSON.stringify(option))
      setFormData(prev => ({
        ...prev,
        CodigoCliente: option.cod
      }))
    } else {
      localStorage.removeItem('selectedOFCadastroClient')
      setFormData(prev => ({
        ...prev,
        CodigoCliente: null
      }))
    }
  }

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle Select changes
  const handleSelectChange = (name, option) => {
    setFormData(prev => ({
      ...prev,
      [name]: option ? option.value : null
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.CodigoCliente) {
      toast.warning('Selecione um cliente')
      return
    }

    if (!formData.Adquirente) {
      toast.warning('Selecione um adquirente')
      return
    }

    if (!formData.Bandeira) {
      toast.warning('Selecione uma bandeira')
      return
    }

    if (!formData.Banco) {
      toast.warning('Informe o código do banco')
      return
    }

    if (!formData.Agencia) {
      toast.warning('Informe a agência')
      return
    }

    if (!formData.Conta) {
      toast.warning('Informe a conta')
      return
    }

    if (!formData.Produto) {
      toast.warning('Selecione um produto')
      return
    }

    if (!formData.Subproduto) {
      toast.warning('Selecione um subproduto')
      return
    }

    try {
      setIsSubmitting(true)
      
      // Prepare payload
      const payload = {
        Adquirente: formData.Adquirente,
        Agencia: formData.Agencia,
        Banco: formData.Banco,
        Bandeira: formData.Bandeira,
        CodigoBancoCliente: formData.CodigoBancoCliente || 0,
        CodigoCliente: formData.CodigoCliente,
        CodigoClienteAdquirente: formData.CodigoClienteAdquirente || 0,
        CodigoEstabelecimento: formData.CodigoEstabelecimento || '',
        Conta: formData.Conta,
        Produto: formData.Produto,
        Subproduto: formData.Subproduto
      }

      const response = await api.post('/banco', payload)
      
      toast.success('Banco cadastrado com sucesso!')
      
      // Reset form after successful submission (keep client selected)
      setFormData(prev => ({
        ...prev,
        Adquirente: null,
        Agencia: '',
        Banco: '',
        Bandeira: null,
        CodigoBancoCliente: 0,
        CodigoCliente: selectedClient?.cod || null,
        CodigoClienteAdquirente: 0,
        CodigoEstabelecimento: '',
        Conta: '',
        Produto: null,
        Subproduto: null
      }))

      // Notify parent component
      if (onBankRegistered) {
        onBankRegistered(response.data)
      }

    } catch (error) {
      console.error('Error registering bank:', error)
      toast.error(error.response?.data?.message || 'Erro ao cadastrar banco')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get selected option helpers
  const getSelectedBandeira = () => {
    return bandeiraOptions.find(opt => opt.value === formData.Bandeira) || null
  }

  const getSelectedAdquirente = () => {
    return adquirenteOptions.find(opt => opt.value === formData.Adquirente) || null
  }

  const getSelectedProduto = () => {
    return produtoOptions.find(opt => opt.value === formData.Produto) || null
  }

  const getSelectedSubproduto = () => {
    return subprodutoOptions.find(opt => opt.value === formData.Subproduto) || null
  }

  return (
    <div className="bank-registration-container">
      <div className="bank-registration-header">
        <h2>Cadastro de Banco</h2>
        <hr className='hr-global'/>
      </div>

      <form onSubmit={handleSubmit} className="bank-registration-form">
        {/* Client Select */}
        <div className="form-row">
          <div className="form-group form-group-full">
            <label htmlFor="cliente">Cliente / Filial *</label>
            <Select
              className='seletor-cliente-select'
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
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="Adquirente">Adquirente *</label>
            <Select
              id="Adquirente"
              options={adquirenteOptions}
              value={getSelectedAdquirente()}
              onChange={(option) => handleSelectChange('Adquirente', option)}
              placeholder={loadingAdquirentes ? "Carregando..." : "Selecione um adquirente"}
              isLoading={loadingAdquirentes}
              isClearable={true}
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

          <div className="form-group">
            <label htmlFor="Bandeira">Bandeira *</label>
            <Select
              id="Bandeira"
              options={bandeiraOptions}
              value={getSelectedBandeira()}
              onChange={(option) => handleSelectChange('Bandeira', option)}
              placeholder={loadingBandeiras ? "Carregando..." : "Selecione uma bandeira"}
              isLoading={loadingBandeiras}
              isClearable={true}
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
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="Banco">Código do Banco *</label>
            <input
              type="text"
              id="Banco"
              name="Banco"
              value={formData.Banco}
              onChange={handleInputChange}
              placeholder="Ex: 001, 033, 104..."
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Agencia">Agência *</label>
            <input
              type="text"
              id="Agencia"
              name="Agencia"
              value={formData.Agencia}
              onChange={handleInputChange}
              placeholder="Ex: 1234-5"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Conta">Conta *</label>
            <input
              type="text"
              id="Conta"
              name="Conta"
              value={formData.Conta}
              onChange={handleInputChange}
              placeholder="Ex: 12345-6"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="Produto">Produto *</label>
            <Select
              id="Produto"
              options={produtoOptions}
              value={getSelectedProduto()}
              onChange={(option) => handleSelectChange('Produto', option)}
              placeholder="Selecione um produto"
              isClearable={true}
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

          <div className="form-group">
            <label htmlFor="Subproduto">Subproduto *</label>
            <Select
              id="Subproduto"
              options={subprodutoOptions}
              value={getSelectedSubproduto()}
              onChange={(option) => handleSelectChange('Subproduto', option)}
              placeholder="Selecione um subproduto"
              isClearable={true}
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
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="CodigoBancoCliente">Código Banco Cliente</label>
            <input
              type="number"
              id="CodigoBancoCliente"
              name="CodigoBancoCliente"
              value={formData.CodigoBancoCliente}
              onChange={handleInputChange}
              placeholder="0"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="CodigoClienteAdquirente">Código Cliente Adquirente</label>
            <input
              type="number"
              id="CodigoClienteAdquirente"
              name="CodigoClienteAdquirente"
              value={formData.CodigoClienteAdquirente}
              onChange={handleInputChange}
              placeholder="0"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="CodigoEstabelecimento">Código Estabelecimento</label>
            <input
              type="text"
              id="CodigoEstabelecimento"
              name="CodigoEstabelecimento"
              value={formData.CodigoEstabelecimento}
              onChange={handleInputChange}
              placeholder="Ex: 000000000004536"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary btn-register"
            disabled={isSubmitting || !selectedClient}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Banco'}
          </button>
          <button 
            type="reset" 
            className="btn btn-secondary btn-clear"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                Adquirente: null,
                Agencia: '',
                Banco: '',
                Bandeira: null,
                CodigoBancoCliente: 0,
                CodigoCliente: selectedClient?.cod || null,
                CodigoClienteAdquirente: 0,
                CodigoEstabelecimento: '',
                Conta: '',
                Produto: null,
                Subproduto: null
              }))
            }}
          >
            Limpar
          </button>
        </div>
      </form>
    </div>
  )
}

export default CadastroBanco