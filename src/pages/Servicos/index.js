import './servicos.scss'
import { useContext, useEffect, useState } from 'react' 
import Joyride from 'react-joyride'
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

  const resetValues = () => {
    setServicesPageArray([])
    setServicesPageAdminArray([])
    setBtnDisabledServices(false)
    servicesTableData.length = 0
  }

  useEffect(() => {
    resetValues()
  }, [])

  useEffect(() => {
    localStorage.setItem('currentPath', location.pathname)
  }, [location])

  // Use the new functions from AuthContext
  const {
    servicesPageArray, setServicesPageArray,
    servicesPageAdminArray, setServicesPageAdminArray,
    servicesDateRange, setServicesDateRange,
    servicesTableData,
    btnDisabledServices, setBtnDisabledServices,
    exportServices,
    newLoadServices,           // New function
    newGroupByAdminServices,   // New function  
    newLoadTotalServices,      // New function
    servicesTotal, setServicesTotal  // Add these if you have them
  } = useContext(AuthContext)

  // Update totals when servicesPageArray changes using new function
  useEffect(() => {
    if (servicesPageArray.length > 0) {
      // Group by admin using the new function
      const groupedData = newGroupByAdminServices(servicesPageArray)
      setServicesPageAdminArray(groupedData)
      
      // Load totals using the new function
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
    
    // Get selected filters from localStorage (if any for services)
    const bandeiraObj = JSON.parse(localStorage.getItem('selectedBanServices')) || ''
    const adquirenteObj = JSON.parse(localStorage.getItem('selectedAdmServices')) || ''
    
    // Get clientes string
    let clientesString = ""
    
    if (cliente && cliente.label === 'TODOS') {
      const clientCodes = grupo?.clients?.map(client => client.CODIGOCLIENTE) || []
      clientesString = clientCodes.join(', ')
      console.log('All client codes (TODOS):', clientesString)
    } else if (cliente && cliente.cod) {
      clientesString = String(cliente.cod)
      console.log('Single client code:', clientesString)
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
      arquivo: format, // 'PDF' or 'XLSX'
      modelo: 'AJUSTE' // For services/adjustments
    }
  }

  // Generic download function using the API
  const downloadReport = async (format) => {
    setDownloading(true)
    
    try {
      const requestObject = getRequestObject(format)
      
      console.log(`Downloading ${format} report for Services with request:`, requestObject)
      
      const response = await api.post('relatorios/detalhado', requestObject)
      
      if (response.data.success === true && response.data.formato === format) {
        // Convert base64 to blob and download
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
        
        // Create filename with date range
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
        console.log(`${format} report downloaded successfully`)
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

  // Excel download handler
  const handleExcelDownload = async () => {
    if (!servicesPageArray || servicesPageArray.length === 0) {
      toast.warning('No data available to export. Please load data first.')
      return
    }
    await downloadReport('XLSX')
  }

  // PDF download handler
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
      // Get the date range from the calendar
      const startDate = servicesDateRange[0]
      const endDate = servicesDateRange[1]
      
      // Format dates to the expected format
      const formattedStartDate = startDate instanceof Date 
        ? startDate.toLocaleDateString('pt-BR')
        : startDate
      const formattedEndDate = endDate instanceof Date 
        ? endDate.toLocaleDateString('pt-BR')
        : endDate
      
      // Use the newLoadServices function from AuthContext
      const servicesData = await newLoadServices(formattedStartDate, formattedEndDate)
      
      console.log('Services data loaded:', servicesData?.length || 0, 'records')
      setServicesPageArray(servicesData || [])
      
      return servicesData
    } catch (error) {
      console.error('Error fetching services data:', error)
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

  const [runTutorial, setRunTutorial] = useState(false)
  const [steps, setSteps] = useState([
    {
      target: '[data-tour="calendario-section"]',
      content: 'Clique em duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
      disableBeacon: true,
      placement: 'bottom'
    },
    {
      target: '[data-tour="pesquisar-section"]',
      content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta das vendas da data ou período selecionado.',
      placement: 'bottom'
    },
  ])

  useEffect(() => {
    if (servicesPageArray.length > 0) {
      let stepsTemp = [
        {
          target: '[data-tour="exportacao-section"]',
          content: 'Exporta as informações de serviços/ajustes sendo exibidas, para os formatos Excel ou PDF.',
          disableBeacon: true,
          placement: 'bottom'
        },
        {
          target: '[data-tour="bandeiraadquirente-section"]',
          content: 'Filtra os ajustes/serviços de acordo com a combinação de adquirente/tipo de serviço selecionada.',
          disableBeacon: true,
          placement: 'bottom'
        },
        {
          target: '[data-tour="tabelavendas-section"]',
          content: 'Serviços/Ajustes do período selecionado. Podem ser filtrados por adquirente/tipo de serviço.',
          disableBeacon: true,
          placement: 'bottom'
        },
        {
          target: '[data-tour="totaladq-section"]',
          content: 'Valores totais dos serviços/ajustes sendo exibidas, separados por adquirente.',
          disableBeacon: true,
          placement: 'bottom'
        },
        {
          target: '[data-tour="botaovoltar-section"]',
          content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
          disableBeacon: true,
          placement: 'bottom'
        },
      ]
      setSteps(stepsTemp)
    } else {
      setSteps([
        {
          target: '[data-tour="calendario-section"]',
          content: 'Clique em duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
          disableBeacon: true,
          placement: 'bottom'
        },
        {
          target: '[data-tour="pesquisar-section"]',
          content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta das vendas da data ou período selecionado.',
          placement: 'bottom'
        },
      ])
    }
  }, [servicesPageArray])

  const handleTutorialEnd = () => {
    setRunTutorial(false)
    if (servicesPageArray.length > 0) {
      // Additional logic if needed
    } else {
      // Additional logic if needed
    }
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
                <MyCalendar 
                  onLoadData={handleLoadData} 
                  getCalendarDate={handleDateRangeChange} 
                  btnDisabled={btnDisabledServices}
                />
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