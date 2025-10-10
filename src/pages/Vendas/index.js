import { useEffect, useContext, useState } from 'react'
import './vendas.scss'
import Joyride from 'react-joyride'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import DisplayData from '../../components/Componente_DisplayData'
import { toast } from 'react-toastify'
import { FiCalendar, FiHelpCircle } from 'react-icons/fi'

const Vendas = () =>{
  const location = useLocation()

  useEffect(() => {
      localStorage.setItem('currentPath', location.pathname)
  }, [location])

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
          <span className='checkbox-custom'></span>
          <span className='checkbox-icon'>
              <FiCalendar className={`calendar-icon ${isCheckedCalendar ? 'isCheckedCalendar' : ''}`} size={20} />
          </span>
        </label>
    )
}

const handleCheckboxChangeCalendar = () => {
  setIsCheckedCalendar(!isCheckedCalendar)
  }

  const [runTutorial, setRunTutorial] = useState(false)
  const [steps, setSteps] = useState([
    {
      target: '[data-tour="calendario-section"]',
      content: 'Clique em duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '[data-tour="pesquisar-section"]',
      content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta das vendas da data ou período selecionado.',
      placement: 'center',
    },
  ])

    useEffect(()=>{
      if(salesPageArray.length > 0){
        let stepsTemp = [
            {
              target: '[data-tour="modalidade-section"]',
              content: 'Valores totais das vendas exibidas, por modalidade.',
              disableBeacon: true,
              placement: 'bottom',
            },
            {
              target: '[data-tour="exportacao-section"]',
              content: 'Exporta as vendas sendo exibidas para os formatos Excel ou PDF.',
              placement: 'bottom',
            },
            {
              target: '[data-tour="bandeiraadquirente-section"]',
              content: 'Filtra as vendas de acordo com a combinação de bandeira/adquirente selecionada.',
              placement: 'bottom',
            },
            {
              target: '[data-tour="tabelavendas-section"]',
              content: 'Vendas do período selecionado. Podem ser filtradas por bandeira/adquirente.',
              placement: 'bottom',
            },
            {
              target: '[data-tour="totaladq-section"]',
              content: 'Valores totais das vendas sendo exibidas, separadas por adquirente.',
              placement: 'bottom',
            },
            {
              target: '[data-tour="botaovoltar-section"]',
              content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
              placement: 'bottom',
            },
        ]
        setSteps(stepsTemp)
      } else {
        setSteps([
          {
            target: '[data-tour="calendario-section"]',
            content: 'Clique em duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
            disableBeacon: true,
            placement: 'center',
          },
          {
            target: '[data-tour="pesquisar-section"]',
            content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta das vendas da data ou período selecionado.',
            placement: 'center',
          },
        ])
      }
    },[salesPageArray])

  const handleTutorialEnd = () => {
    setRunTutorial(false)
    if (salesPageArray.length > 0){

    } else{
    
    }
  }

  return(
    <div className='appPage'>
      <div className='page-vendas-background'>
        <div className='page-content-vendas'>
          <div className='vendas-title-container'>
            <h1 className='vendas-title'>Calendário de Vendas</h1>
          </div>
          <div data-tour="calendario-section" className='component-container-vendas'>
              { runTutorial &&
                <Joyride
                  steps={steps}
                  run={runTutorial}
                  continuous={true}
                  scrollToFirstStep={false}
                  scrollOffset={80}
                  showProgress={true}
                  showSkipButton={true}
                  styles={{
                    options: {
                      primaryColor: '#99cc33',
                      textColor: '#0a3d70',
                      zIndex: 10000,
                    },
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
            {salesPageArray !== null ? (
              salesPageArray.length > 0 ? (
                  <DisplayData
                    dataArray={salesPageArray}
                    adminDataArray={salesPageAdminArray}
                    totals={salesTotal}
                    onGoBack={resetValues}
                    setRunTutorial={setRunTutorial}
                    location={location}
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

export default Vendas