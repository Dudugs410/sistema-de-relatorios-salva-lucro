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

import '../Vendas/Calendar.scss'
import MyCalendar from '../../components/Componente_Calendario'
import { toast } from 'react-toastify'
import DisplayData from '../../components/Componente_DisplayData'


export const ServicosContext = createContext({})

const Servicos = () =>{
	const location = useLocation();

	useEffect(() => {
		sessionStorage.setItem('currentPath', location.pathname);
	}, [location]);
  
	const {
	  isDarkTheme, setIsDarkTheme,
	  servicesPageArray, setServicesPageArray,
	  servicesPageAdminArray, setServicesPageAdminArray,
	  servicesDateRange, setServicesDateRange,
	  loadServices, tableData,
	  groupServicesByAdmin,

	  alerta,
	} = useContext(AuthContext)
  
	useEffect(()=>{
		setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
		Cookies.set('tipo', 'servicos')
	  },[])

	useEffect(()=>{
		if(servicesPageArray.length>0){
		  setServicesPageAdminArray(groupServicesByAdmin(servicesPageArray));
		}
	  },[servicesPageArray])
	  
  const resetValues = () => {
    setServicesPageArray([])
    setServicesPageAdminArray([])
    tableData.length = 0
  }

  async function handleLoadData(e) {
    e.preventDefault();
    try {
      await toast.promise(loadData(), {
        pending: 'Carregando...',
        success: 'Carregado com Sucesso',
        error: 'Ocorreu um Erro',
      });
    } catch (error) {
      console.error('Error handling busca:', error);
    }
  }
  
  async function loadData() {
    try {
      setServicesPageArray(await loadServices(servicesDateRange[0].toLocaleDateString('pt-BR'), servicesDateRange[1].toLocaleDateString('pt-BR')));
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error(error)
      throw error;
    }
  }

  const handleDateRangeChange = (dateRange) => {
    setServicesDateRange(dateRange)
  }

	return(
		<div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
		  <div className={`page-vendas-background ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
			<div className={`page-content-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
			  <div className={`vendas-title-container ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
				<h1 className={`vendas-title ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Serviços</h1>
			  </div>
			  <div className='component-container-vendas'>
				{ servicesPageArray.length > 0 ? 
          <DisplayData dataArray={servicesPageArray} adminDataArray={servicesPageAdminArray} totals={null} tableData={tableData} onGoBack={resetValues}/>
          : 
          <MyCalendar className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange}/> }
			  </div>
			</div>
		  </div>
		</div>
	)
}

export default Servicos