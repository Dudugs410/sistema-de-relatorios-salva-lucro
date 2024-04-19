import { useEffect, useContext, createContext, useState } from 'react'
import Calendar from 'react-calendar'
import BuscarClienteVendas from '../../components/Componente_BuscarClienteVendas'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'
import GerarRelatorio from "../../components/Componente_GerarRelatorio"
import '../Vendas/Calendar.scss'
import './creditos.scss'
import { AuthContext } from '../../contexts/auth'
import Cookies from 'js-cookie'
import TabelaCreditos from '../../components/Componente_TabelaCreditos'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import DisplayData from '../../components/Componente_DisplayData'
import { toast } from 'react-toastify'

const Creditos = () =>{
	const location = useLocation();

	useEffect(() => {
		sessionStorage.setItem('currentPath', location.pathname);
	}, [location]);
  
	const {
	  isDarkTheme, setIsDarkTheme,
	  creditsPageArray, setCreditsPageArray,
	  creditsPageAdminArray, setCreditsPageAdminArray,
	  creditsDateRange, setCreditsDateRange,
	  loadCredits, loadTotalCredits, creditsTotal, setCreditsTotal, tableData,
	  groupByAdmin,

	  alerta,
	} = useContext(AuthContext)
  
	useEffect(()=>{
		setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
		Cookies.set('tipo', 'creditos')
	  },[])

	useEffect(()=>{
		if(creditsPageArray.length>0){
		  setCreditsPageAdminArray(groupByAdmin(creditsPageArray));
		  loadTotalCredits(creditsPageArray)
		}
	  },[creditsPageArray])
	  
  const resetValues = () => {
    setCreditsPageArray([])
    setCreditsPageAdminArray([])
    setCreditsTotal({
      debit: 0,
      credit: 0,
      voucher: 0,
      total: 0
    })
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
      setCreditsPageArray(await loadCredits(creditsDateRange[0].toLocaleDateString('pt-BR'), creditsDateRange[1].toLocaleDateString('pt-BR')));
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error(error)
      throw error;
    }
  }

  const handleDateRangeChange = (dateRange) => {
    setCreditsDateRange(dateRange)
  }

  const handleGoBack = () => {
	  resetValues()
  }

	return(
		<div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
		  <div className={`page-vendas-background ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
			<div className={`page-content-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
			  <div className={`vendas-title-container ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
				<h1 className={`vendas-title ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Calendário de Créditos</h1>
			  </div>
			  <div className='component-container-vendas'>
				{ creditsPageArray.length > 0 ? 
          <DisplayData dataArray={creditsPageArray} adminDataArray={creditsPageAdminArray} totals={creditsTotal} tableData={tableData} onGoBack={resetValues}/>
          : 
          <MyCalendar className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange}/> }
			  </div>
			</div>
		  </div>
		</div>
	)
  }

export default Creditos