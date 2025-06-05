import { useEffect, useContext, useState } from 'react'
import '../Vendas/vendas.scss'
import Joyride from 'react-joyride'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import DisplayData from '../../components/Componente_DisplayData'
import { toast } from 'react-toastify'
import { FiHelpCircle } from 'react-icons/fi'

const Creditos = () =>{
	const location = useLocation()

	useEffect(() => {
		localStorage.setItem('currentPath', location.pathname)
	}, [location])
  
	const {
	  creditsPageArray, setCreditsPageArray,
	  creditsPageAdminArray, setCreditsPageAdminArray,
	  creditsDateRange, setCreditsDateRange,
	  loadCredits, loadTotalCredits, creditsTotal, setCreditsTotal, tableData,
	  groupByAdmin, 
    btnDisabledCredits, setBtnDisabledCredits,
    exportCredits, creditsTableData,
    clientUserId, getUserData, updateUserById,
	} = useContext(AuthContext)
  

	useEffect(()=>{
		if(creditsPageArray.length>0){
		  setCreditsPageAdminArray(groupByAdmin(creditsPageArray))
		  loadTotalCredits(creditsPageArray)
		}
	  },[creditsPageArray])
	  
  const resetValues = () => {
    setCreditsPageArray([])
    setCreditsPageAdminArray([])
    setBtnDisabledCredits(false)
    setCreditsTotal({
      debit: 0,
      credit: 0,
      voucher: 0,
      total: 0
    })
    creditsTableData.length = 0
  }

async function handleLoadData(e) {
  e.preventDefault()
  try {
    setBtnDisabledCredits(true)
    toast.dismiss()
    await toast.promise(loadData(), {
      pending: 'Carregando...',
    })
    setBtnDisabledCredits(false)
  } catch (error) {
    console.error('Error handling busca:', error)
    toast.dismiss()
    toast.error('Ocorreu um Erro')
    setBtnDisabledCredits(false)
  }
}

async function loadData() {
  try {
    const creditsData = await loadCredits(creditsDateRange[0].toLocaleDateString('pt-BR'), creditsDateRange[1].toLocaleDateString('pt-BR'))
    setCreditsPageArray(creditsData)
    return creditsData // Resolve the promise with data if successful
  } catch (error) {
    console.error('Error fetching credits data:', error)
    throw error // Throw error to be caught by toast.promise
  }
}

  useEffect(()=>{
    if(creditsPageArray.length > 0){
      exportCredits(creditsPageArray)
    }
  },[creditsPageArray, localStorage.getItem('currentPath')])

  const handleDateRangeChange = (dateRange) => {
    setCreditsDateRange(dateRange)
  }

  const handleGoBack = () => {
	  resetValues()
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
        
        const tutorialCompleted = userTemp.joyrideComplete.creditosCalendar
        
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
          creditosCalendar: true,
        },
      })
      localStorage.setItem('creditosCalendarTutorialCompleted', 'true')
    }

	return(
		<div className='appPage'>
		  <div className='page-vendas-background'>
			<div className='page-content-vendas'>
			  <div className='vendas-title-container'>
				  <h1 className='vendas-title'>Calendário de Créditos</h1>
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
                  skip: 'Pular'
                }}
              />	
          }
          { creditsPageArray !== null ?
            (creditsPageArray.length > 0 ? (
                <DisplayData 
                  dataArray={creditsPageArray} 
                  adminDataArray={creditsPageAdminArray} 
                  totals={creditsTotal} 
                  onGoBack={resetValues}
                />
              ) : (
                <MyCalendar 
                  onLoadData={handleLoadData} 
                  getCalendarDate={handleDateRangeChange} 
                  btnDisabled={btnDisabledCredits} 
                />
              )
            ) : null }
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

export default Creditos