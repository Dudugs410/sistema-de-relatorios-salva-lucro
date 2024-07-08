import Calendar from 'react-calendar'
import './servicos.scss'
import { useContext, useEffect, useState, createContext } from 'react' 
import { AuthContext } from '../../contexts/auth'
// import DateRangePicker from '../../components/Componente_TabelaServicos'
import GerarRelatorio from '../../components/Componente_GerarRelatorio'
import Cookies from 'js-cookie'
import { useLocation } from 'react-router-dom'
import BuscarClienteServicos from '../../components/Componente_BuscarClienteServicos'
import TabelaServicos from '../../components/Componente_TabelaServicos'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'

import MyCalendar from '../../components/Componente_Calendario'
import { toast } from 'react-toastify'
import DisplayData from '../../components/Componente_DisplayData'


const Servicos = () =>{
  const location = useLocation()

  useEffect(() => {
      sessionStorage.setItem('currentPath', location.pathname)
  }, [location])

	const {
	  servicesPageArray, setServicesPageArray,
	  servicesPageAdminArray, setServicesPageAdminArray,
	  servicesDateRange, setServicesDateRange,
	  loadServices, servicesTableData,
    btnDisabledServices, setBtnDisabledServices,
    groupServicesByAdmin,
    exportServices,

	  alerta,
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
        success: 'Carregado com Sucesso',
        error: 'Ocorreu um Erro',
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
  },[servicesPageArray, sessionStorage.getItem('currentPath')])

  const handleDateRangeChange = (dateRange) => {
    setServicesDateRange(dateRange)
  }

	return(
		<div className='appPage'>
		  <div className='page-vendas-background'>
			<div className='page-content-vendas'>
			  <div className='vendas-title-container'>
				<h1 className='vendas-title'>Serviços</h1>
			  </div>
			  <div className='component-container-vendas'>
				{ servicesPageArray.length > 0 ? 
          <DisplayData dataArray={servicesPageArray} adminDataArray={servicesPageAdminArray} totals={null} onGoBack={resetValues}/>
          : 
          <MyCalendar onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange} btnDisabled={btnDisabledServices}/> }
			  </div>
			</div>
		  </div>
		</div>
	)
}

export default Servicos

