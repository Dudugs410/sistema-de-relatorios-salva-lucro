import './servicos.scss'
import { useContext, useEffect, useState } from 'react' 
import Joyride from 'react-joyride'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import MyCalendar from '../../components/Componente_Calendario'
import { toast } from 'react-toastify'
import DisplayData from '../../components/Componente_DisplayData'
import { FiHelpCircle } from 'react-icons/fi'


const Servicos = () =>{
  const location = useLocation()

    const resetValues = () => {
    setServicesPageArray([])
    setServicesPageAdminArray([])
    setBtnDisabledServices(false)
    servicesTableData.length = 0
  }

  useEffect(()=>{
    resetValues()
  },[])

  useEffect(() => {
      localStorage.setItem('currentPath', location.pathname)
  }, [location])

	const {
	  servicesPageArray, setServicesPageArray,
	  servicesPageAdminArray, setServicesPageAdminArray,
	  servicesDateRange, setServicesDateRange,
	  loadServices, servicesTableData,
    btnDisabledServices, setBtnDisabledServices,
    groupServicesByAdmin,
    exportServices, 
	} = useContext(AuthContext)

  useEffect(()=>{
    if(servicesPageArray.length>0){
      setServicesPageAdminArray(groupServicesByAdmin(servicesPageArray))
    }
  },[servicesPageArray])

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
      setBtnDisabledServices(false)
    }
  }
  
  async function loadData() {
    try {
      setServicesPageArray(await loadServices(servicesDateRange[0].toLocaleDateString('pt-BR'), servicesDateRange[1].toLocaleDateString('pt-BR')))
    } catch (error) {
      console.error('Error fetching sales data:', error)
      toast.dismiss()
      toast.error(error)
      throw error
    }
  }

  useEffect(()=>{
    if(servicesPageArray.length > 0){
      exportServices(servicesPageArray)
    }
  },[servicesPageArray, localStorage.getItem('currentPath')])

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

    useEffect(()=>{
      if(servicesPageArray.length > 0){
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
    },[servicesPageArray])
/*  
    useEffect(() => {
      localStorage.setItem('currentPath', location.pathname)
      
      try {
        
        const tutorialCompleted = userTemp.joyrideComplete.servicosCalendar
        
        if (!tutorialCompleted) {
          const timer = setTimeout(() => {
            setRunTutorial(true)
          }, 1000)
          return () => clearTimeout(timer)
        }
      } catch (error) {
        console.error('Error while processing user data:', error)
      }
    }, [location])
  */
  const handleTutorialEnd = () => {
    setRunTutorial(false)
    if (servicesPageArray.length > 0){

    } else{

    }
  }

  const calculateServicesTotal = (servicesArray) => {
    if (!servicesArray || servicesArray.length === 0) return 0
    return servicesArray.reduce((total, service) => total + Math.abs(service.valor), 0)
  }

	return(
		<div className='appPage'>
		  <div className='page-vendas-background'>
			<div className='page-content-vendas'>
			  <div className='vendas-title-container'>
				<h1 className='vendas-title'>Serviços</h1>
			  </div>
			  <div className='component-container-vendas' data-tour="calendario-section">
          { runTutorial &&
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
          { servicesPageArray !== null ?
              servicesPageArray.length > 0 ? (
                <DisplayData 
                  dataArray={servicesPageArray} 
                  adminDataArray={servicesPageAdminArray} 
                  totals={{ total: calculateServicesTotal(servicesPageArray) }} 
                  onGoBack={resetValues}
                  setRunTutorial={setRunTutorial}
                  location={location}
                />
              ) : (
                <MyCalendar 
                  onLoadData={handleLoadData} 
                  getCalendarDate={handleDateRangeChange} 
                  btnDisabled={btnDisabledServices}
                />
              )
          : null }
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

