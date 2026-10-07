import { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { FiX } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'
import { EMPTY_DOMICILIO_FORM, REQUIRED_DOMICILIO_FIELDS, buildDomicilioPayload } from '../../util/domicilio'
import './ModalDomicilio.scss'
import { selectStyles, selectTheme } from '../../util/selectStyles'

const ModalDomicilio = ({ isOpen, onClose, banco, onCreated }) => {
  const { loadBanners, loadAdmins, loadProducts, loadMods, loadEstabelecimentos, addDomicilio } = useContext(AuthContext)

  const [formData, setFormData] = useState(EMPTY_DOMICILIO_FORM)

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
        const modalidades = await loadMods()
        setModalidadeOptions(
          (modalidades || []).map(m => ({
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
    setFormData(EMPTY_DOMICILIO_FORM)
  }, [isOpen, loadAdmins, loadBanners, loadProducts, loadMods])

  useEffect(() => {
    if (!isOpen) return

    if (!formData.ADQCODIGO) {
      setEstabelecimentoOptions([])
      setFormData(prev => ({ ...prev, CLDCODIGO: null }))
      return
    }

    const fetchEstabelecimentos = async () => {
      setLoadingEstabelecimentos(true)
      const estabelecimentos = await loadEstabelecimentos(formData.ADQCODIGO, banco?.CLICODIGO)
      setEstabelecimentoOptions(
        estabelecimentos.map(e => ({
          value: e.codigoClienteAdquirente,
          label: e.codigoEstabelecimento,
        })).sort((a, b) => String(a.label).localeCompare(String(b.label)))
      )
      setLoadingEstabelecimentos(false)
    }

    fetchEstabelecimentos()
  }, [isOpen, formData.ADQCODIGO, loadEstabelecimentos, banco?.CLICODIGO])

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

    const missing = REQUIRED_DOMICILIO_FIELDS.find(([field]) => !formData[field])
    if (missing) return toast.warning(missing[1])

    setIsSubmitting(true)
    const result = await addDomicilio(buildDomicilioPayload(banco, formData))
    setIsSubmitting(false)

    if (result.success) {
      if (onCreated) await onCreated()
      onClose()
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
                styles={selectStyles}
                theme={selectTheme}
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
                styles={selectStyles}
                theme={selectTheme}
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
                styles={selectStyles}
                theme={selectTheme}
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
                styles={selectStyles}
                theme={selectTheme}
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
                styles={selectStyles}
                theme={selectTheme}
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