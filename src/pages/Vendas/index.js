import { useEffect, useContext } from 'react'
import './vendas.scss'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import DisplayData from '../../components/Componente_DisplayData'
import { toast } from 'react-toastify'

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

  return(
    <div className='appPage'>
      <div className='page-vendas-background'>
        <div className='page-content-vendas'>
          <div className='vendas-title-container'>
            <h1 className='vendas-title'>Calendário de Vendas</h1>
          </div>
          <div className='component-container-vendas'>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Vendas
