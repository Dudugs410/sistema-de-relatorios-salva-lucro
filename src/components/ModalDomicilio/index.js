import { useState, useEffect, useCallback } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { FiX } from 'react-icons/fi'
import api from '../../services/api'
import { AuthContext } from '../../contexts/auth'
import { useContext } from 'react'
import './ModalDomicilio.scss'

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
  menuPortal: (base) => ({ ...base, zIndex: 99999 }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--background-color)',
    borderColor: 'var(--bs-border-color)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 99999,
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
  dropdownIndicator: (base) => ({
    ...base,
    color: 'var(--font-color)',
    '&:hover': { color: 'var(--secondary-color)' },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: 'var(--font-color)',
    '&:hover': { color: 'var(--secondary-color)' },
  }),
  indicatorSeparator: (base) => ({ ...base, backgroundColor: 'var(--bs-border-color)' }),
  noOptionsMessage: (base) => ({ ...base, color: 'var(--font-color)' }),
  loadingMessage: (base) => ({ ...base, color: 'var(--font-color)' }),
}

const themeConfig = (theme) => ({
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
})

const ModalDomicilio = ({ isOpen, onClose, banco, onCreated }) => {
  const { loadBanners, loadAdmins, loadProducts } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    ADQCODIGO: null,
    CLDCODIGO: null,
    BADCODIGO: null,
    PROCODIGO: null,
    MODCODIGO: null,
    PROPAGAR: false,
  })

  const [adquirenteOptions, setAdquirenteOptions] = useState([])
  const [bandeiraOptions, setBandeiraOptions] = useState([])
  const [produtoOptions, setProdutoOptions] = useState([])
  const [modalidadeOptions, setModalidadeOptions] = useState([])
  const [estabelecimentoOptions, setEstabelecimentoOptions] = useState([])

  const [loadingAdquirentes, setLoadingAdquirentes] = useState(false)
  const [loadingBandeiras, setLoadingBandeiras] = useState(false)
  const [loadingProdutos, setLoadingProdutos] = useState(false)
  const [loadingModalidades, setLoadingModalidades] = useState(false)
  const [loadingEstabelecimentos, setLoadingEstabelecimentos] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const loadAdquirentes = async () => {
      setLoadingAdquirentes(true)
      try {
        const admins = await loadAdmins()
        setAdquirenteOptions(
          (admins || []).map(a => ({
            value: a.codigoAdquirente,
            label: a.nomeAdquirente,
          })).sort((a, b) => a.label.localeCompare(b.label))
        )
      } catch (e) {
        console.error('Error loading adquirentes:', e)
      } finally {
        setLoadingAdquirentes(false)
      }
    }

    const loadBandeiras = async () => {
      setLoadingBandeiras(true)
      try {
        const banners = await loadBanners()
        setBandeiraOptions(
          (banners || []).map(b => ({
            value: b.codigoBandeira,
            label: b.descricaoBandeira,
          })).sort((a, b) => a.label.localeCompare(b.label))
        )
      } catch (e) {
        console.error('Error loading bandeiras:', e)
      } finally {
        setLoadingBandeiras(false)
      }
    }

    const loadProdutos = async () => {
      setLoadingProdutos(true)
      try {
        const products = await loadProducts()
        setProdutoOptions(
          (products || []).map(p => ({
            value: p.codigoProduto,
            label: p.descricaoProduto,
          })).sort((a, b) => a.label.localeCompare(b.label))
        )
      } catch (e) {
        console.error('Error loading produtos:', e)
      } finally {
        setLoadingProdutos(false)
      }
    }

    const loadModalidades = async () => {
      setLoadingModalidades(true)
      try {
        const response = await api.get('Modalidade')
        setModalidadeOptions(
          (response.data || []).map(m => ({
            value: m.codigoModalidade,
            label: m.descricaoModalidade,
          })).sort((a, b) => a.label.localeCompare(b.label))
        )
      } catch (e) {
        console.error('Error loading modalidades:', e)
      } finally {
        setLoadingModalidades(false)
      }
    }

    loadAdquirentes()
    loadBandeiras()
    loadProdutos()
    loadModalidades()
  }, [isOpen, loadAdmins, loadBanners, loadProducts])

  useEffect(() => {
    if (!isOpen) return

    if (!formData.ADQCODIGO) {
      setEstabelecimentoOptions([])
      setFormData(prev => ({ ...prev, CLDCODIGO: null }))
      return
    }

    const clientCode = localStorage.getItem('clientCode')

    const loadEstabelecimentos = async () => {
      setLoadingEstabelecimentos(true)
      try {
        const response = await api.get('clienteAdquirente', {
          params: {
            codigoCliente: clientCode,
            codigoAdquirente: formData.ADQCODIGO,
          },
        })

        setEstabelecimentoOptions(
          (response.data || []).map(e => ({
            value: e.codigoClienteAdquirente,
            label: e.codigoEstabelecimento,
          })).sort((a, b) => String(a.label).localeCompare(String(b.label)))
        )
      } catch (e) {
        console.error('Error loading estabelecimentos:', e)
        toast.error('Erro ao carregar estabelecimentos')
      } finally {
        setLoadingEstabelecimentos(false)
      }
    }

    loadEstabelecimentos()
  }, [isOpen, formData.ADQCODIGO])

  const handleSelectChange = (name, option) => {
    setFormData(prev => {
      const next = { ...prev, [name]: option ? option.value : null }
      if (name === 'ADQCODIGO') {
        next.CLDCODIGO = null
      }
      return next
    })
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.ADQCODIGO) return toast.warning('Selecione um adquirente')
    if (!formData.CLDCODIGO) return toast.warning('Selecione um estabelecimento')
    if (!formData.BADCODIGO) return toast.warning('Selecione uma bandeira')
    if (!formData.PROCODIGO) return toast.warning('Selecione um produto')
    if (!formData.MODCODIGO) return toast.warning('Selecione uma modalidade')

    const payload = {
      BANCODIGO: banco?.CODIGO,
      ADQCODIGO: formData.ADQCODIGO,
      CLDCODIGO: formData.CLDCODIGO,
      BADCODIGO: formData.BADCODIGO,
      PROCODIGO: formData.PROCODIGO,
      MODCODIGO: formData.MODCODIGO,
      PROPAGAR: formData.PROPAGAR === true,
    }

    try {
      setIsSubmitting(true)
      const response = await api.post('domiciliobancario', payload)
      toast.success(response.data?.mensagem || 'Domicílio adicionado com sucesso!')
      if (onCreated) await onCreated()
      onClose()
    } catch (error) {
      console.error('Erro ao criar domicílio:', error)
      toast.error(error.response?.data?.mensagem || 'Erro ao adicionar domicílio')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adicionar Domicílio Bancário</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Banco</label>
              <input
                type="text"
                value={banco?.NOME || banco?.CODIGOBANCO || ''}
                disabled
                className="form-input-disabled"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Adquirente *</label>
              <Select
                options={adquirenteOptions}
                value={adquirenteOptions.find(o => o.value === formData.ADQCODIGO) || null}
                onChange={(option) => handleSelectChange('ADQCODIGO', option)}
                placeholder={loadingAdquirentes ? 'Carregando...' : 'Selecione um adquirente'}
                isLoading={loadingAdquirentes}
                isClearable
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={customSelectStyles}
                theme={themeConfig}
              />
            </div>

            <div className="form-group">
              <label>Estabelecimento *</label>
              <Select
                options={estabelecimentoOptions}
                value={estabelecimentoOptions.find(o => o.value === formData.CLDCODIGO) || null}
                onChange={(option) => handleSelectChange('CLDCODIGO', option)}
                placeholder={
                  !formData.ADQCODIGO
                    ? 'Selecione um adquirente primeiro'
                    : loadingEstabelecimentos
                      ? 'Carregando...'
                      : 'Selecione um estabelecimento'
                }
                isLoading={loadingEstabelecimentos}
                isDisabled={!formData.ADQCODIGO || loadingEstabelecimentos}
                isClearable
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={customSelectStyles}
                theme={themeConfig}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bandeira *</label>
              <Select
                options={bandeiraOptions}
                value={bandeiraOptions.find(o => o.value === formData.BADCODIGO) || null}
                onChange={(option) => handleSelectChange('BADCODIGO', option)}
                placeholder={loadingBandeiras ? 'Carregando...' : 'Selecione uma bandeira'}
                isLoading={loadingBandeiras}
                isClearable
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={customSelectStyles}
                theme={themeConfig}
              />
            </div>

            <div className="form-group">
              <label>Produto *</label>
              <Select
                options={produtoOptions}
                value={produtoOptions.find(o => o.value === formData.PROCODIGO) || null}
                onChange={(option) => handleSelectChange('PROCODIGO', option)}
                placeholder={loadingProdutos ? 'Carregando...' : 'Selecione um produto'}
                isLoading={loadingProdutos}
                isClearable
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={customSelectStyles}
                theme={themeConfig}
              />
            </div>

            <div className="form-group">
              <label>Modalidade *</label>
              <Select
                options={modalidadeOptions}
                value={modalidadeOptions.find(o => o.value === formData.MODCODIGO) || null}
                onChange={(option) => handleSelectChange('MODCODIGO', option)}
                placeholder={loadingModalidades ? 'Carregando...' : 'Selecione uma modalidade'}
                isLoading={loadingModalidades}
                isClearable
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={customSelectStyles}
                theme={themeConfig}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="checkbox-label-modal">
                <input
                  type="checkbox"
                  name="PROPAGAR"
                  checked={formData.PROPAGAR}
                  onChange={handleCheckboxChange}
                />
                <span>Propagar</span>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-save" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalDomicilio