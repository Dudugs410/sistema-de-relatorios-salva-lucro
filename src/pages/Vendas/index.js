import { useEffect, useContext, useState } from 'react'
import './vendas.scss'
import Joyride from 'react-joyride'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import DisplayData from '../../components/Componente_DisplayData'
import { toast } from 'react-toastify'
import { FiCalendar } from 'react-icons/fi'

const Vendas = () =>{
  const location = useLocation()

  useEffect(() => {
      localStorage.setItem('currentPath', location.pathname)
  }, [location])

    // Joyride state
    const [runTutorial, setRunTutorial] = useState(false)
    const [steps] = useState([
    {
        target: '[data-tour="calendario-section"]',
        content: 'Clique em duas vezes em uma data, ou uma vez na data inicial e uma vez em uma data final para exibir as vendas referentes à essas datas.',
        disableBeacon: true,
        placement: 'bottom'
      },
      {
        target: '[data-tour="pesquisar-section"]',
        content: 'Tendo a data selecionada, clique aqui para realizar a pesquisa da data/período selecionado.',
        placement: 'bottom'
      },
    ])

      // Check if it's the user's first visit
      useEffect(() => {
        localStorage.setItem('currentPath', location.pathname)
        
        const tutorialCompleted = localStorage.getItem('dashboardTutorialCompleted')
        if (!tutorialCompleted) {
          // Wait a moment for the DOM to fully render
          const timer = setTimeout(() => {
            setRunTutorial(true)
          }, 1000)
          return () => clearTimeout(timer)
        }
      }, [location, ])
    
      const handleTutorialEnd = () => {
        setRunTutorial(false)
        localStorage.setItem('dashboardTutorialCompleted', 'true')
      }

  const {
    salesPageArray, setSalesPageArray,
    salesPageAdminArray, setSalesPageAdminArray,
    salesDateRange, setSalesDateRange,
    loadSales, loadTotalSales, salesTotal, setSalesTotal, salesTableData,
    btnDisabledSales, setBtnDisabledSales,
    groupByAdmin,
    exportSales, 
    isCheckedCalendar, setIsCheckedCalendar,
    
  } = useContext(AuthContext)

  useEffect(()=>{
    if (localStorage.getItem('localUsers') !== null) {
        let localUsersTemp = JSON.parse(localStorage.getItem('localUsers'))
        localUsersTemp.map(user => {
            if (user.id === localStorage.getItem('userID')) {
                user.calendar = isCheckedCalendar
            }
        })
        localStorage.setItem('localUsers', JSON.stringify(localUsersTemp))
    } else {
        let localUsersTemp = []
        let userTemp = { id: localStorage.getItem('userID'), calendar: isCheckedCalendar }
        localUsersTemp.push(userTemp)
        localStorage.setItem('localUsers', JSON.stringify(localUsersTemp))
    }
},[isCheckedCalendar])

  useEffect(()=>{
    if(salesPageArray && salesPageArray.length > 0){
      setSalesPageAdminArray(groupByAdmin(salesPageArray))
      loadTotalSales(salesPageArray)
    } else if (salesPageArray === null) {
      handleResetOnError()
    }
  },[salesPageArray])

  const resetValues = () => {
    setSalesPageArray([])
    setSalesPageAdminArray([])
    setBtnDisabledSales(false)
    setSalesTotal({
      debit: 0,
      credit: 0,
      voucher: 0,
      total: 0
    })
    salesTableData.length = 0
  }

  const handleResetOnError = () => {
    resetValues()
    toast.error('Ocorreu um erro ao carregar os dados de vendas. A página foi redefinida.')
  }

  async function handleLoadData(e) {
    e.preventDefault()
    try {
      setBtnDisabledSales(true)
      toast.dismiss()
      await toast.promise(loadData(), {
        pending: 'Carregando...',
      })
      setBtnDisabledSales(false)
    } catch (error) {
      setBtnDisabledSales(false)
      console.error('Error handling busca:', error)
      handleResetOnError()
    }
  }

  async function loadData() {
    try {
      const data = await loadSales(salesDateRange[0].toLocaleDateString('pt-BR'), salesDateRange[1].toLocaleDateString('pt-BR'))
      setSalesPageArray(data)
    } catch (error) {
      console.error('Error fetching sales data:', error)
      throw error
    }
  }

  useEffect(()=>{
    if(salesPageArray && salesPageArray.length > 0){
      exportSales(salesPageArray)
    }
  },[salesPageArray, localStorage.getItem('currentPath')])

  const handleDateRangeChange = (dateRange) => {
    setSalesDateRange(dateRange)
  }

  const CustomCheckbox = ({ isChecked, handleCheckboxChange }) => {
    return (
        <label className="checkbox-label">
          <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className='checkbox-input'
          />
          <span className='checkbox-custom'></span> {/* aparencia da checkbox-custom */}
          <span className='checkbox-icon'>
              <FiCalendar className={`calendar-icon ${isCheckedCalendar ? 'isCheckedCalendar' : ''}`} size={20} />
          </span>
        </label>
    )
}

const handleCheckboxChangeCalendar = () => {
  setIsCheckedCalendar(!isCheckedCalendar) // Toggle the state
  }

  return(
    <div className='appPage'>
      <div className='page-vendas-background'>
        <div className='page-content-vendas'>
          <div className='vendas-title-container'>
            <h1 className='vendas-title'>Calendário de Vendas</h1>
          </div>
          {/*<CustomCheckbox isChecked={isCheckedCalendar} handleCheckboxChange={handleCheckboxChangeCalendar}/>*/}
          <div data-tour="calendario-section"className='component-container-vendas'>
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
            {salesPageArray !== null ? (
              salesPageArray.length > 0 ? (
                  <DisplayData
                    dataArray={salesPageArray}
                    adminDataArray={salesPageAdminArray}
                    totals={salesTotal}
                    onGoBack={resetValues}
                  />
                ) : (
                  <MyCalendar
                    onLoadData={handleLoadData}
                    getCalendarDate={handleDateRangeChange}
                    btnDisabled={btnDisabledSales}
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

export default Vendas
