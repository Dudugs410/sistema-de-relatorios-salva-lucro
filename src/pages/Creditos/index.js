import { useEffect, useContext, useState } from 'react'
import '../Vendas/vendas.scss'
import Joyride from 'react-joyride'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import DisplayData from '../../components/Componente_DisplayData'
import { toast } from 'react-toastify'

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
    exportCredits, creditsTableData
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
      const tutorialCompleted = localStorage.getItem('creditosCalendarTutorialCompleted')
      if (!tutorialCompleted) {
        // Wait a moment for the DOM to fully render
        const timer = setTimeout(() => {
          setRunTutorial(true)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }, [location])
  
    const handleTutorialEnd = () => {
      setRunTutorial(false)
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
              className='btn btn-success-dados px-2 py-1'
                onClick={() => setRunTutorial(true)}
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  zIndex: 1000,
                  padding: '10px 15px',
                  background: '#99cc33',
                  color: '#0a3d70',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
              Mostrar Tutorial
            </button>
			    </div>
			  </div>
		  </div>
		</div>
	)
  }

export default Creditos