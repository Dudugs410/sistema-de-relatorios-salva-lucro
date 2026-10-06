// ModalBanco.jsx
import { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { FiX } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'
import './ModalBanco.scss'

// Custom Select styles
const customSelectStyles = {
  control: (base, { isFocused }) => ({
    ...base,
    minWidth: 200,
    width: '100%',
    backgroundColor: 'var(--background-color)',
    borderColor: isFocused ? 'var(--secondary-color)' : 'var(--bs-border-color)',
    color: 'var(--font-color)',
    '&:hover': { borderColor: 'var(--secondary-color)' },
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
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--font-color)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '90%',
  }),
  input: (base) => ({ ...base, color: 'var(--font-color)' }),
  placeholder: (base) => ({ ...base, color: 'var(--font-color)', opacity: 0.6 }),
  valueContainer: (base) => ({
    ...base,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  dropdownIndicator: (base) => ({ ...base, color: 'var(--font-color)' }),
  clearIndicator: (base) => ({ ...base, color: 'var(--font-color)' }),
  indicatorSeparator: (base) => ({ ...base, backgroundColor: 'var(--bs-border-color)' }),
  noOptionsMessage: (base) => ({ ...base, color: 'var(--font-color)' }),
  loadingMessage: (base) => ({ ...base, color: 'var(--font-color)' }),
}

// Format CNPJ for display: XX.XXX.XXX/XXXX-XX
const formatCNPJ = (value) => {
  if (!value) return ''
  const cleaned = value.replace(/\D/g, '')
  const limited = cleaned.slice(0, 14)
  if (limited.length <= 2) return limited
  if (limited.length <= 5) return `${limited.slice(0, 2)}.${limited.slice(2)}`
  if (limited.length <= 8) return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`
  if (limited.length <= 12) return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8)}`
  return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8, 12)}-${limited.slice(12, 14)}`
}

const ModalBanco = ({ 
  isOpen, 
  onClose, 
  onSave, 
  bank = null, 
  selectedClient,
  isSubmitting = false
}) => {
  const { loadBankSelectOptions } = useContext(AuthContext)

  const [bancoOptions, setBancoOptions] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [optionsLoaded, setOptionsLoaded] = useState(false)

  const [formData, setFormData] = useState({
    Banco: null,
    CnpjCedente: '',
    RazaoSocial: '',
    Agencia: '',
    Conta: '',
    Digito: '',
    CodigoCliente: null,
    CodigoBancoCliente: 0,
  })

  // ---- Fetch options FIRST when the modal opens ----
  useEffect(() => {
    if (!isOpen) return

    let isCancelled = false

    const fetchOptions = async () => {
      setLoadingOptions(true)
      setOptionsLoaded(false)

      try {
        if (typeof loadBankSelectOptions !== 'function') {
          console.error('[ModalBanco] loadBankSelectOptions is not a function')
          throw new Error('Função de carregamento de bancos indisponível')
        }

        const options = await loadBankSelectOptions()

        if (isCancelled) return

        setBancoOptions(Array.isArray(options) ? options : [])
        setOptionsLoaded(true)
      } catch (error) {
        console.error('[ModalBanco] Error loading options:', error)
        if (!isCancelled) {
          toast.error('Erro ao carregar lista de bancos')
          setBancoOptions([])
          setOptionsLoaded(true) // still mark loaded so we can show fallback
        }
      } finally {
        if (!isCancelled) setLoadingOptions(false)
      }
    }

    fetchOptions()

    return () => {
      isCancelled = true
    }
  }, [isOpen, loadBankSelectOptions])

  useEffect(() => {
    if (!isOpen || !optionsLoaded) return

    if (bank) {
      // Match the bank against the option whose value equals its CODIGO
      const matchingOption = bancoOptions.find(
        opt => String(opt.value) === String(bank.CODIGO)
      )

      // Fallback: build a local option if not found in the list
      const bancoValue = matchingOption || (bank.CODIGO
        ? {
            value: String(bank.CODIGO),
            label: String(bank.NOME || bank.CODIGO),
          }
        : null)

      setFormData({
        Banco: bancoValue,
        CnpjCedente: bank.CNPJCEDENTE ? formatCNPJ(bank.CNPJCEDENTE) : '',
        RazaoSocial: bank.NOMECEDENTE || '',
        Agencia: bank.CODIGOAGENCIA || '',
        Conta: bank.NUMEROCONTA || '',
        Digito: bank.DIGITOCONTA || '',
        CodigoCliente: bank.CLICODIGO || selectedClient?.cod || null,
        CodigoBancoCliente: bank.CODIGO || 0,
      })
    } else {
      setFormData({
        Banco: null,
        CnpjCedente: '',
        RazaoSocial: '',
        Agencia: '',
        Conta: '',
        Digito: '',
        CodigoCliente: selectedClient?.cod || null,
        CodigoBancoCliente: 0,
      })
    }
  }, [isOpen, optionsLoaded, bank, bancoOptions, selectedClient])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value)
    setFormData(prev => ({ ...prev, CnpjCedente: formatted }))
  }

  const handleSelectChange = (name, option) => {
    setFormData(prev => ({ ...prev, [name]: option }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.CodigoCliente) return toast.warning('Cliente não selecionado')
    if (!formData.Banco) return toast.warning('Selecione um banco')
    if (!formData.RazaoSocial) return toast.warning('Informe a Razão Social')
    if (!formData.Agencia) return toast.warning('Informe a agência')
    if (!formData.Conta) return toast.warning('Informe a conta corrente')

    const payload = {
      CLICODIGO: parseInt(formData.CodigoCliente),
      CODIGOBANCO: String(formData.Banco.value || ''),
      NOME: String(formData.Banco.label || ''),
      NOMECEDENTE: formData.RazaoSocial,
      CNPJCEDENTE: formData.CnpjCedente,
      CODIGOAGENCIA: formData.Agencia,
      NUMEROCONTA: formData.Conta,
      DIGITOCONTA: formData.Digito || '',
    }

    if (bank && formData.CodigoBancoCliente) {
      payload.CODIGO = formData.CodigoBancoCliente
    }

    await onSave(payload)
  }

  if (!isOpen) return null

  // ---- Loading state: don't render the form until options are ready ----
  if (loadingOptions || !optionsLoaded) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{bank ? 'Edição de Banco' : 'Inclusão de Banco'}</h2>
            <button className="modal-close" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <div className="modal-loading">
            <div className="spinner" />
            <p>Carregando bancos...</p>
          </div>
        </div>
      </div>
    )
  }

  // ---- Form render (options are ready) ----
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{bank ? 'Edição de Banco' : 'Inclusão de Banco'}</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Cliente</label>
              <input
                type="text"
                value={selectedClient?.label || 'N/A'}
                disabled
                className="form-input-disabled"
              />
            </div>
            <div className="form-group">
              <label>Código Cliente</label>
              <input
                type="text"
                value={formData.CodigoCliente || ''}
                disabled
                className="form-input-disabled"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Banco *</label>
              <Select
                options={bancoOptions}
                value={formData.Banco}
                onChange={(option) => handleSelectChange('Banco', option)}
                placeholder={
                  bancoOptions.length === 0
                    ? 'Nenhum banco disponível'
                    : 'Selecione um banco'
                }
                isClearable
                isSearchable
                styles={customSelectStyles}
                noOptionsMessage={() => 'Nenhum banco disponível'}
              />
            </div>
            <div className="form-group">
              <label>CNPJ *</label>
              <input
                type="text"
                name="CnpjCedente"
                value={formData.CnpjCedente}
                onChange={handleCNPJChange}
                className="form-input"
                placeholder="XX.XXX.XXX/XXXX-XX"
                maxLength={18}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Razão Social *</label>
              <input
                type="text"
                name="RazaoSocial"
                value={formData.RazaoSocial}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Razão social do cedente"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Agência *</label>
              <input
                type="text"
                name="Agencia"
                value={formData.Agencia}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ex: 0491"
              />
            </div>
            <div className="form-group">
              <label>Conta Corrente *</label>
              <input
                type="text"
                name="Conta"
                value={formData.Conta}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ex: 24357598"
              />
            </div>
            <div className="form-group form-group-small">
              <label>Dígito</label>
              <input
                type="text"
                name="Digito"
                value={formData.Digito}
                onChange={handleInputChange}
                className="form-input"
                placeholder="X"
                maxLength={2}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-save" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : (bank ? 'Atualizar' : 'Cadastrar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalBanco