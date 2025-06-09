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
    clientUserId, getUserData, updateUserById,
	} = useContext(AuthContext)

  useEffect(()=>{
    if(servicesPageArray.length>0){
      setServicesPageAdminArray(groupServicesByAdmin(servicesPageArray))
    }
  },[servicesPageArray])

  const resetValues = () => {
    setServicesPageArray([])
    setServicesPageAdminArray([])
    setBtnDisabledServices(false)
    servicesTableData.length = 0
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

    // Joyride state
  
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
      localStorage.setItem('currentPath', location.pathname)
      
      try {
        let userTemp = getUserData()
        console.log('userTemp: ', userTemp)
        
        // Check if userTemp exists and has joyrideComplete property
        if (!userTemp?.joyrideComplete) {
          console.error('User data or joyrideComplete property is missing')
          return
        }
        
        const tutorialCompleted = userTemp.joyrideComplete.servicosCalendar
        
        if (!tutorialCompleted) {
          // Wait a moment for the DOM to fully render
          const timer = setTimeout(() => {
            setRunTutorial(true)
          }, 1000)
          return () => clearTimeout(timer)
        }
      } catch (error) {
        console.error('Error while processing user data:', error)
      }
    }, [location])
  
    const handleTutorialEnd = () => {
      setRunTutorial(false)
      updateUserById(clientUserId, {
        joyrideComplete: {
          servicosCalendar: true,
        },
      })
      localStorage.setItem('servicosCalendarTutorialCompleted', 'true')
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
              scrollToFirstStep={true}
              showProgress={true}
              showSkipButton={true}
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
            (servicesPageArray.length > 0 ? (
              <DisplayData 
                dataArray={servicesPageArray} 
                adminDataArray={servicesPageAdminArray} 
                totals={null} 
                onGoBack={resetValues}
              />
              ) : (
              <MyCalendar 
                onLoadData={handleLoadData} 
                getCalendarDate={handleDateRangeChange} 
                btnDisabled={btnDisabledServices}
              />
              )
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

