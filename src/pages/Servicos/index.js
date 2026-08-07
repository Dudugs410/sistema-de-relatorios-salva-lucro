import './servicos.scss'
import { useContext, useEffect, useState, useRef } from 'react' 
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import MyCalendar from '../../components/Componente_Calendario'
import { toast } from 'react-toastify'
import NewDisplayData from '../../components/Component_NewDisplayData'
import { FiHelpCircle } from 'react-icons/fi'
import Joyride from 'react-joyride'

const Servicos = () => {
  const location = useLocation()
  const [downloading, setDownloading] = useState(false)
  const [listaBandeiras, setListaBandeiras] = useState([])
  const [listaAdministradoras, setListaAdministradoras] = useState([])

  const isProcessingRef = useRef(false)
  const lastProcessedArrayRef = useRef(null)

  const resetValues = () => {
    setServicesPageArray([])
    setServicesPageAdminArray([])
    setBtnDisabledServices(false)
    servicesTableData.length = 0
    lastProcessedArrayRef.current = null
    
    // Clear report-specific storage when resetting
    localStorage.removeItem('reportBandeira')
    localStorage.removeItem('reportAdquirente')
  }

  // Clean up report data when component unmounts or route changes
  useEffect(() => {
    return () => {
      localStorage.removeItem('reportBandeira')
      localStorage.removeItem('reportAdquirente')
    }
  }, [])

  // Clear report data when path changes (navigation)
  useEffect(() => {
    localStorage.removeItem('reportBandeira')
    localStorage.removeItem('reportAdquirente')
    localStorage.setItem('currentPath', location.pathname)
  }, [location])

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

  useEffect(() => {
    if (isProcessingRef.current) return
    if (servicesPageArray.length === 0) return
    
    const currentSignature = JSON.stringify(servicesPageArray)
    if (currentSignature === lastProcessedArrayRef.current) return
    
    isProcessingRef.current = true
    
    try {
      const groupedData = newGroupByAdminServices(servicesPageArray)
      if (JSON.stringify(groupedData) !== JSON.stringify(servicesPageAdminArray)) {
        setServicesPageAdminArray(groupedData)
      }
      newLoadTotalServices(servicesPageArray)
      lastProcessedArrayRef.current = currentSignature
    } finally {
      setTimeout(() => {
        isProcessingRef.current = false
      }, 100)
    }
  }, [servicesPageArray, newGroupByAdminServices, newLoadTotalServices, servicesPageAdminArray])

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return ''
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    if (typeof date === 'string' && date.includes('/')) {
      try {
        const [day, month, year] = date.split('/')
        if (day && month && year) {
          return `${year}-${month}-${day}`
        }
      } catch (e) {
        console.error('Error parsing date string:', e)
        return ''
      }
    }
    try {
      const dateObj = new Date(date)
      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
    } catch (e) {
      console.error('Error creating date object:', e)
    }
    return ''
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
      const startDate = servicesDateRange?.[0]
      const endDate = servicesDateRange?.[1]
      
      if (!startDate || !endDate) {
        toast.warning('Por favor, selecione um período de datas')
        throw new Error('Date range not selected')
      }
      
      const formattedStartDate = startDate instanceof Date 
        ? startDate.toLocaleDateString('pt-BR')
        : startDate
      const formattedEndDate = endDate instanceof Date 
        ? endDate.toLocaleDateString('pt-BR')
        : endDate
      
      // Store formatted dates in localStorage for export
      const formattedStart = formatDateToYYYYMMDD(startDate)
      const formattedEnd = formatDateToYYYYMMDD(endDate)
      localStorage.setItem('dataInicial', formattedStart)
      localStorage.setItem('dataFinal', formattedEnd)
      
      const servicesData = await newLoadServices(formattedStartDate, formattedEndDate)
      
      lastProcessedArrayRef.current = null
      setServicesPageArray(servicesData || [])
      
      return servicesData
    } catch (error) {
      toast.dismiss()
      toast.error(error.response?.data?.mensagem || error.message || 'Erro ao carregar serviços')
      throw error
    }
  }

  useEffect(() => {
    if (servicesPageArray && servicesPageArray.length > 0) {
      exportServices(servicesPageArray)
    }
  }, [servicesPageArray])

  const handleDateRangeChange = (dateRange) => {
    if (dateRange && Array.isArray(dateRange) && dateRange.length === 2) {
      setServicesDateRange(dateRange)
    } else {
      console.warn('Invalid date range received:', dateRange)
    }
  }

  const calculateServicesTotal = (servicesArray) => {
    if (!servicesArray || servicesArray.length === 0) return { total: 0 }
    const total = servicesArray.reduce((sum, service) => sum + Math.abs(service.valor || service.VALORLIQUIDO || 0), 0)
    return { total: total }
  }

  // Joyride state
  const [runTutorial, setRunTutorial] = useState(false)
  const [tutorialSteps, setTutorialSteps] = useState([
    {
      target: '[data-tour="bandeiraadquirente-section"]',
      content: 'Selecione os filtros desejados para o relatório.',
      disableBeacon: true,
      placement: 'bottom'
    },
    {
      target: '[data-tour="calendario-section"]',
      content: 'Clique duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
      disableBeacon: true,
      placement: 'bottom'
    },
    {
      target: '[data-tour="pesquisar-section"]',
      content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta dos serviços da data ou período selecionado.',
      placement: 'bottom'
    },
  ])

  useEffect(() => {
    if (servicesPageArray.length > 0) {
      let stepsTemp = [
        {
          target: '[data-tour="exportacao-section"]',
          content: 'Exporta os serviços sendo exibidos para os formatos Excel ou PDF.',
          placement: 'bottom'
        },
        {
          target: '[data-tour="tabelavendas-section"]',
          content: 'Serviços do período selecionado. Podem ser filtrados por adquirente.',
          placement: 'bottom'
        },
        {
          target: '[data-tour="botaovoltar-section"]',
          content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
          placement: 'bottom'
        },
      ]
      setTutorialSteps(stepsTemp)
    } else {
      setTutorialSteps([
        {
          target: '[data-tour="bandeiraadquirente-section"]',
          content: 'Selecione os filtros desejados para o relatório.',
          disableBeacon: true,
          placement: 'bottom'
        },
        {
          target: '[data-tour="calendario-section"]',
          content: 'Clique duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
          disableBeacon: true,
          placement: 'bottom'
        },
        {
          target: '[data-tour="pesquisar-section"]',
          content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta dos serviços da data ou período selecionado.',
          placement: 'bottom'
        },
      ])
    }
  }, [servicesPageArray])

  const handleTutorialEnd = () => {
    setRunTutorial(false)
  }

  return (
    <div className='page-content-vendas'>
      <div className='vendas-title-container'>
        <h1 className='vendas-title'>Serviços</h1>
      </div>
      <hr className='hr-global' />
      
      <div className='component-container-vendas'>
        {servicesPageArray !== null ?
          servicesPageArray.length > 0 ? (
            <NewDisplayData 
              dataArray={servicesPageArray} 
              adminDataArray={servicesPageAdminArray} 
              totals={calculateServicesTotal(servicesPageArray)} 
              onGoBack={resetValues}
              location={location}
              hideTotals={true}
              setRunTutorial={setRunTutorial}
              runTutorial={runTutorial}
              tutorialSteps={tutorialSteps}
              listaBandeiras={listaBandeiras}
              listaAdministradoras={listaAdministradoras}
              showSelects={false} // Hide selects when data is shown
            />
          ) : (
            <>
              {/* Joyride for calendar view */}
              {runTutorial && (
                <Joyride
                  steps={tutorialSteps}
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
              )}
              
              <NewDisplayData
                dataArray={[]}
                adminDataArray={[]}
                totals={null}
                onGoBack={resetValues}
                setRunTutorial={setRunTutorial}
                location={location}
                runTutorial={runTutorial}
                tutorialSteps={tutorialSteps}
                listaBandeiras={listaBandeiras}
                listaAdministradoras={listaAdministradoras}
                showSelects={true} // Show selects when no data
                onSearch={handleLoadData}
                isSearching={btnDisabledServices}
              />
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
          onClick={() => {
            setRunTutorial(false);
            setTimeout(() => {
              setRunTutorial(true);
            }, 50);
          }}
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
  )
}

export default Servicos