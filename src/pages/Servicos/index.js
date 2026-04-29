import './servicos.scss'
import { useContext, useEffect, useState } from 'react' 
import Joyride from 'react-joyride'
import Select from 'react-select'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import MyCalendar from '../../components/Componente_Calendario'
import { toast } from 'react-toastify'
import DisplayData from '../../components/Componente_DisplayData'
import { FiHelpCircle } from 'react-icons/fi'
import api from '../../services/api'

const Servicos = () => {
  const location = useLocation()
  const [downloading, setDownloading] = useState(false)
  const [bandeira, setBandeira] = useState(null)
  const [administradora, setAdministradora] = useState(null)
  const [listaBandeiras, setListaBandeiras] = useState([])
  const [listaAdministradoras, setListaAdministradoras] = useState([])

  const resetValues = () => {
    setServicesPageArray([])
    setServicesPageAdminArray([])
    setBtnDisabledServices(false)
    servicesTableData.length = 0
    setAdministradora(null)
    setBandeira(null)
    localStorage.removeItem('selectedAdmServices')
    localStorage.removeItem('selectedBanServices')
  }

  useEffect(() => {
    const inicializar = async () => {
      setListaBandeiras(await loadBanners())
      setListaAdministradoras(await loadAdmins())
    }
    inicializar()
  }, [])

  useEffect(() => {
    resetValues()
  }, [])

  useEffect(() => {
    localStorage.setItem('currentPath', location.pathname)
  }, [location])

  const handleAdmin = (option) => {
    setAdministradora(option?.codigoAdquirente || null)
    localStorage.setItem('selectedAdmServices', JSON.stringify(option))
  }

  const handleBan = (option) => {
    setBandeira(option?.codigoBandeira || null)
    localStorage.setItem('selectedBanServices', JSON.stringify(option))
  }

  // Use the new functions from AuthContext
  const {
    servicesPageArray, setServicesPageArray,
    servicesPageAdminArray, setServicesPageAdminArray,
    servicesDateRange, setServicesDateRange,
    servicesTableData,
    btnDisabledServices, setBtnDisabledServices,
    exportServices,
    newLoadServices,
    newGroupByAdminServices,
    newLoadTotalServices,
    servicesTotal, setServicesTotal,
    loadAdmins, loadBanners
  } = useContext(AuthContext)

  // Update totals when servicesPageArray changes using new function
  useEffect(() => {
    if (servicesPageArray.length > 0) {
      const groupedData = newGroupByAdminServices(servicesPageArray)
      setServicesPageAdminArray(groupedData)
      newLoadTotalServices(servicesPageArray)
    }
  }, [servicesPageArray, newGroupByAdminServices, newLoadTotalServices])

  // Helper function to format date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (date) => {
    if (!date) return ''
    
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date
    }
    
    if (date instanceof Date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    if (typeof date === 'string' && date.includes('/')) {
      const [day, month, year] = date.split('/')
      return `${year}-${month}-${day}`
    }
    
    const dateObj = new Date(date)
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const day = String(dateObj.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    return ''
  }

  // Get the request object for API downloads
  const getRequestObject = (format) => {
    const cliente = JSON.parse(localStorage.getItem('selectedClientBody'))
    const grupo = JSON.parse(localStorage.getItem('selectedGroupBody'))
    const dataInicial = localStorage.getItem('dataInicial')
    const dataFinal = localStorage.getItem('dataFinal')
    
    const bandeiraObj = JSON.parse(localStorage.getItem('selectedBanServices')) || ''
    const adquirenteObj = JSON.parse(localStorage.getItem('selectedAdmServices')) || ''
    
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

    return {
      dataInicial: formatDateToYYYYMMDD(dataInicial),
      dataFinal: formatDateToYYYYMMDD(dataFinal),
      clientes: clientesString,
      nomeGrupo: nomeGrupo,
      bandeira: ban,
      adquirente: adq,
      produto: '',
      modalidade: '',
      arquivo: format,
      modelo: 'AJUSTE'
    }
  }

  // Generic download function using the API
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
        
        const startDate = formatDateToYYYYMMDD(servicesDateRange[0])
        const endDate = formatDateToYYYYMMDD(servicesDateRange[1])
        const dateRangeStr = startDate === endDate ? startDate : `${startDate}_a_${endDate}`
        const fileName = `Relatorio_Servicos_${dateRangeStr}.${fileExtension}`
        
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast.success(`${format} report downloaded successfully!`)
      } else {
        toast.error(response.data.mensagem || `Failed to generate ${format} report`)
      }
    } catch (err) {
      toast.error(err.response?.data?.mensagem || err.message || `An error occurred while generating the ${format} report`)
    } finally {
      setDownloading(false)
    }
  }

  const handleExcelDownload = async () => {
    if (!servicesPageArray || servicesPageArray.length === 0) {
      toast.warning('No data available to export. Please load data first.')
      return
    }
    await downloadReport('XLSX')
  }

  const handlePDFDownload = async () => {
    if (!servicesPageArray || servicesPageArray.length === 0) {
      toast.warning('No data available to export. Please load data first.')
      return
    }
    await downloadReport('PDF')
  }

  async function handleLoadData(e) {
    e.preventDefault()
    try {
      setBtnDisabledServices(true)
      toast.dismiss()
      await toast.promise(loadData(), {
        pending: 'Carregando...',
      })
      setBtnDisabledServices(false)
    } catch (error) {
      console.error('Error handling busca:', error)
      toast.error('Erro ao carregar dados')
      setBtnDisabledServices(false)
    }
  }
  
  async function loadData() {
    try {
      const startDate = servicesDateRange[0]
      const endDate = servicesDateRange[1]
      
      const formattedStartDate = startDate instanceof Date 
        ? startDate.toLocaleDateString('pt-BR')
        : startDate
      const formattedEndDate = endDate instanceof Date 
        ? endDate.toLocaleDateString('pt-BR')
        : endDate
      
      const servicesData = await newLoadServices(formattedStartDate, formattedEndDate)
      
      setServicesPageArray(servicesData || [])
      
      return servicesData
    } catch (error) {
      toast.dismiss()
      toast.error(error.response?.data?.mensagem || error.message || 'Erro ao carregar serviços')
      throw error
    }
  }

  useEffect(() => {
    if (servicesPageArray.length > 0) {
      exportServices(servicesPageArray)
    }
  }, [servicesPageArray, localStorage.getItem('currentPath')])

  const handleDateRangeChange = (dateRange) => {
    setServicesDateRange(dateRange)
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
      content: 'Clique em duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="pesquisar-section"]',
      content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta dos serviços.',
      placement: 'bottom'
    },
  ])

  useEffect(() => {
    if (servicesPageArray.length > 0) {
      let stepsTemp = [
        {
          target: '[data-tour="exportacao-section"]',
          content: 'Exporta as informações de serviços/ajustes sendo exibidas, para os formatos Excel ou PDF.',
          placement: 'bottom'
        },
        {
          target: '[data-tour="bandeiraadquirente-section"]',
          content: 'Filtra os ajustes/serviços de acordo com a combinação de adquirente/tipo de serviço selecionada.',
          placement: 'bottom'
        },
        {
          target: '[data-tour="tabelavendas-section"]',
          content: 'Serviços/Ajustes do período selecionado. Podem ser filtrados por adquirente/tipo de serviço.',
          placement: 'bottom'
        },
        {
          target: '[data-tour="totaladq-section"]',
          content: 'Valores totais dos serviços/ajustes sendo exibidas, separados por adquirente.',
          placement: 'bottom'
        },
        {
          target: '[data-tour="botaovoltar-section"]',
          content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
          placement: 'bottom'
        },
      ]
      setSteps(stepsTemp)
    }
  }, [servicesPageArray])

  const handleTutorialEnd = () => {
    setRunTutorial(false)
  }

  const calculateServicesTotal = (servicesArray) => {
    if (!servicesArray || servicesArray.length === 0) return 0
    return servicesArray.reduce((total, service) => total + Math.abs(service.valor || 0), 0)
  }

  return (
    <div className='appPage'>
      <div className='page-vendas-background'>
        <div className='page-content-vendas'>
          <div className='vendas-title-container'>
            <h1 className='vendas-title'>Serviços</h1>
          </div>
          <hr className='hr-global' />
          
          <div className='component-container-vendas' data-tour="calendario-section">
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
            
            {servicesPageArray !== null ?
              servicesPageArray.length > 0 ? (
                <DisplayData 
                  dataArray={servicesPageArray} 
                  adminDataArray={servicesPageAdminArray} 
                  totals={{ total: calculateServicesTotal(servicesPageArray) }} 
                  onGoBack={resetValues}
                  setRunTutorial={setRunTutorial}
                  location={location}
                  onExcelDownload={handleExcelDownload}
                  onPDFDownload={handlePDFDownload}
                  downloading={downloading}
                />
              ) : (
                <>
                  {/* Filters Section - exactly like Vendas and Creditos */}
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
                        styles={{
                          control: (base) => ({
                            ...base,
                            minWidth: 250,
                            width: '100%',
                          }),
                          menu: (base) => ({
                            ...base,
                            minWidth: 250,
                            width: '100%',
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }),
                          singleValue: (base) => ({
                            ...base,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '90%',
                          }),
                        }}
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
                        styles={{
                          control: (base) => ({
                            ...base,
                            minWidth: 250,
                            width: '100%',
                          }),
                          menu: (base) => ({
                            ...base,
                            minWidth: 250,
                            width: '100%',
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }),
                          singleValue: (base) => ({
                            ...base,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '90%',
                          }),
                        }}
                      />
                    </div>
                  </div>

                  <MyCalendar 
                    onLoadData={handleLoadData} 
                    getCalendarDate={handleDateRangeChange} 
                    btnDisabled={btnDisabledServices}
                  />
                </>
              )
            : null}
            
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
    </div>
  )
}

export default Servicos