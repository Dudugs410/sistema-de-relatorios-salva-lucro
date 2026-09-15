// src/pages/PrevisaoRecebimentos/index.js
import { useEffect, useContext, useState, useCallback } from 'react'
import Select from 'react-select'
import '../Vendas/vendas.scss'
import Joyride from 'react-joyride'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import { toast } from 'react-toastify'
import { FiHelpCircle, FiFilePlus } from 'react-icons/fi'
import api from '../../services/api'

// Custom Select styles — same as Bancos/Vendas/Creditos
const customSelectStyles = {
  control: (base, { isFocused }) => ({
    ...base,
    minWidth: 250,
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
    '::-webkit-scrollbar': { width: '8px', height: '8px' },
    '::-webkit-scrollbar-track': { background: 'rgba(255, 255, 255, 0.1)' },
    '::-webkit-scrollbar-thumb': { background: 'var(--secondary-color)', borderRadius: '4px' },
    '::-webkit-scrollbar-thumb:hover': { background: 'var(--primary-color)' },
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
    '&:active': { backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)' },
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

const PrevisaoRecebimentos = () => {
  const location = useLocation()

  const resetValues = useCallback(() => {
    setAdministradora(null)
    setBandeira(null)
    setDateRange(null)
    localStorage.removeItem('selectedAdmCredits')
    localStorage.removeItem('selectedBanCredits')
  }, [])

  useEffect(() => {
    resetValues()
  }, [resetValues])

  useEffect(() => {
    localStorage.setItem('currentPath', location.pathname)
  }, [location])

  const [bandeira, setBandeira] = useState(null)
  const [administradora, setAdministradora] = useState(null)
  const [dateRange, setDateRange] = useState(null)
  const [downloading, setDownloading] = useState(false)

  const [listaBandeiras, setListaBandeiras] = useState([])
  const [listaAdministradoras, setListaAdministradoras] = useState([])

  useEffect(() => {
    const inicializar = async () => {
      setListaBandeiras(await loadBanners())
      setListaAdministradoras(await loadAdmins())
    }
    inicializar()
  }, [])

  const handleAdmin = (option) => {
    setAdministradora(option?.codigoAdquirente || null)
    localStorage.setItem('selectedAdmCredits', JSON.stringify(option))
  }

  const handleBan = (option) => {
    setBandeira(option?.codigoBandeira || null)
    localStorage.setItem('selectedBanCredits', JSON.stringify(option))
  }

  const {
    loadAdmins, loadBanners,
    creditsDateRange, setCreditsDateRange
  } = useContext(AuthContext)

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return ''
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date
    if (date instanceof Date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    return ''
  }

  const getRequestObject = (format) => {
    const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
    const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'))
    const bandeiraObj = JSON.parse(localStorage.getItem('selectedBanCredits')) || ''
    const adquirenteObj = JSON.parse(localStorage.getItem('selectedAdmCredits')) || ''

    let clientesString = ""

    if (cliente && cliente.label === 'TODOS') {
      const clientCodes = grupo?.clients?.map(client => client.CODIGOCLIENTE) || []
      clientesString = clientCodes.join(', ')
    } else if (cliente && cliente.cod) {
      clientesString = String(cliente.cod)
    } else if (cliente && cliente.value) {
      clientesString = String(cliente.value)
    } else {
      const apiCNPJ = localStorage.getItem('cnpj')
      const apiGroupCode = localStorage.getItem('groupCode')
      clientesString = apiCNPJ === 'todos' ? String(apiGroupCode) : String(apiCNPJ)
    }

    const nomeGrupo = grupo?.label || localStorage.getItem('clientName') || ""
    const ban = bandeiraObj?.codigoBandeira || ''
    const adq = adquirenteObj?.codigoAdquirente || ''

    let dataInicial = ''
    let dataFinal = ''

    if (dateRange && dateRange.length === 2) {
      dataInicial = formatDateToYYYYMMDD(dateRange[0])
      dataFinal = formatDateToYYYYMMDD(dateRange[1])
    } else if (creditsDateRange && creditsDateRange.length === 2) {
      dataInicial = formatDateToYYYYMMDD(creditsDateRange[0])
      dataFinal = formatDateToYYYYMMDD(creditsDateRange[1])
    }

    return {
      dataInicial: dataInicial,
      dataFinal: dataFinal,
      clientes: clientesString,
      nomeGrupo: nomeGrupo,
      bandeira: ban,
      adquirente: adq,
      produto: '',
      modalidade: '',
      arquivo: format,
      modelo: 'FLUXO'
    }
  }

  const downloadReport = async (format) => {
    setDownloading(true)

    try {
      const requestObject = getRequestObject(format)

      const response = await api.post('relatorios/detalhado', requestObject)

      if (response.data.success === true && response.data.formato === format) {
        const binaryData = atob(response.data.base64)
        const arrayBuffer = new ArrayBuffer(binaryData.length)
        const uint8Array = new Uint8Array(arrayBuffer)
        for (let i = 0; i < binaryData.length; i++) {
          uint8Array[i] = binaryData.charCodeAt(i)
        }

        const mimeType = format === 'PDF'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        const fileExtension = format === 'PDF' ? 'pdf' : 'xlsx'
        const blob = new Blob([arrayBuffer], { type: mimeType })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url

        let startDateStr = ''
        let endDateStr = ''

        if (dateRange && dateRange.length === 2) {
          startDateStr = formatDateToYYYYMMDD(dateRange[0])
          endDateStr = formatDateToYYYYMMDD(dateRange[1])
        } else if (creditsDateRange && creditsDateRange.length === 2) {
          startDateStr = formatDateToYYYYMMDD(creditsDateRange[0])
          endDateStr = formatDateToYYYYMMDD(creditsDateRange[1])
        }

        const dateRangeStr = startDateStr === endDateStr ? startDateStr : `${startDateStr}_a_${endDateStr}`

        const requestGroup = JSON.parse(localStorage.getItem('selectedGroupBody'))
        const requestGroupName = requestGroup?.label || localStorage.getItem('clientName') || ""
        const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
        const isTodos = cliente?.label === 'TODOS'
        const clientName = cliente?.label || localStorage.getItem('clientName') || ""

        const fileName = isTodos
          ? `Fluxo_de_Recebimentos_${requestGroupName}_TODAS_FILIAIS_${dateRangeStr}.${fileExtension}`
          : `Fluxo_de_Recebimentos_${requestGroupName}_${clientName}_${dateRangeStr}.${fileExtension}`

        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success(`${format} baixado com sucesso!`)
      } else {
        console.error('API returned unsuccessful response:', response.data)
        toast.error(response.data.mensagem || `Failed to generate ${format} report`)
      }
    } catch (err) {
      console.error(`Error downloading ${format} report:`, err)
      toast.error(err.response?.data?.mensagem || err.message || `An error occurred while generating the ${format} report`)
    } finally {
      setDownloading(false)
    }
  }

  const handleExcelDownload = async () => {
    await downloadReport('XLSX')
  }

  const handlePDFDownload = async () => {
    await downloadReport('PDF')
  }

  const handleDateRangeChange = (dateRange) => {
    setDateRange(dateRange)
    setCreditsDateRange(dateRange)
  }

  const getSelectedAdminOption = () => {
    if (!administradora || listaAdministradoras.length === 0) return null
    return listaAdministradoras.find(option => option.codigoAdquirente === administradora)
  }

  const getSelectedBanOption = () => {
    if (!bandeira || listaBandeiras.length === 0) return null
    return listaBandeiras.find(option => option.codigoBandeira === bandeira)
  }

  const [runTutorial, setRunTutorial] = useState(false)
  const [steps, setSteps] = useState([
    {
      target: '[data-tour="select-container-calendario"]',
      content: 'Selecione os filtros desejados para o relatório.',
      disableBeacon: true,
      placement: 'bottom'
    },
    {
      target: '[data-tour="calendario-section"]',
      content: 'Selecione a data ou período desejado.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="exportacao-section"]',
      content: 'Exporta os dados para os formatos Excel ou PDF.',
      placement: 'bottom'
    },
  ])

  const handleTutorialEnd = () => {
    setRunTutorial(false)
  }

  return (
    <div className='appPage'>
      <div className='page-content-vendas'>
        <div className='component-container-vendas'>
          <div className='vendas-title-container'>
            <h1 className='vendas-title'>Previsão de Recebimentos</h1>
          </div>
          <hr className='hr-global' />
          {runTutorial &&
            <Joyride
              steps={steps}
              run={runTutorial}
              continuous={true}
              scrollToFirstStep={false}
              showProgress={true}
              showSkipButton={true}
              scrollOffset={80}
              styles={{
                options: {
                  primaryColor: '#99cc33',
                  textColor: '#0a3d70',
                  zIndex: 10000,
                }
              }}
              callback={(data) => {
                if (data.status === 'finished' || data.status === 'skipped') {
                  handleTutorialEnd()
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
          }

          <div data-tour="select-container-calendario" className='select-container-calendario'>
            <div className='select-wrapper'>
              <h5>Adquirente</h5>
              <Select
                className='seletor-adq-select fixed-width-select'
                id='adquirente'
                options={listaAdministradoras}
                getOptionLabel={(option) => option.nomeAdquirente}
                getOptionValue={(option) => option.codigoAdquirente}
                onChange={(option) => handleAdmin(option)}
                value={getSelectedAdminOption()}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                placeholder="Selecione uma adquirente..."
                isClearable={true}
                styles={customSelectStyles}
                theme={themeConfig}
              />
            </div>
            <div className='select-wrapper'>
              <h5>Bandeira</h5>
              <Select
                className='seletor-adq-select fixed-width-select'
                id='bandeira'
                options={listaBandeiras}
                getOptionLabel={(option) => option.descricaoBandeira}
                getOptionValue={(option) => option.codigoBandeira}
                onChange={(option) => handleBan(option)}
                value={getSelectedBanOption()}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                placeholder="Selecione uma bandeira..."
                isClearable={true}
                styles={customSelectStyles}
                theme={themeConfig}
              />
            </div>
          </div>

          <div data-tour="calendario-section">
            <MyCalendar
              getCalendarDate={handleDateRangeChange}
            />
          </div>

          <div data-tour="exportacao-section" className='container' style={{ marginTop: '0px' }}>
            <div className='export-column'>
              <button
                className="btn btn-exportar btn-exportar-excel"
                onClick={handleExcelDownload}
                disabled={downloading}
              >
                {downloading ? 'Gerando...' : 'Download Excel'} <FiFilePlus />
              </button>
            </div>
            <div className='export-column'>
              <button
                className='btn btn-exportar btn-exportar-pdf'
                onClick={handlePDFDownload}
                disabled={downloading}
              >
                {downloading ? 'Gerando...' : 'Download PDF'} <FiFilePlus />
              </button>
            </div>
          </div>

          <button
            className='btn btn-success-dados btn-tutorial px-2 py-1'
            onClick={() => setRunTutorial(true)}
            style={{
              position: 'relative',
              bottom: '0px',
              right: '-10px',
              zIndex: 10,
              padding: '10px 15px',
              background: 'none',
              color: '#99cc33',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            <FiHelpCircle />
          </button> 
        </div>
      </div>
    </div>
  )
}

export default PrevisaoRecebimentos