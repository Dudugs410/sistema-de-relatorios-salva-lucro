import { useEffect, useContext, createContext, useState } from 'react'
import Calendar from 'react-calendar'
import BuscarClienteVendas from '../../components/Componente_BuscarClienteVendas'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'
import GerarRelatorio from "../../components/Componente_GerarRelatorio"
import './Calendar.scss'
import './vendas.scss'
import { AuthContext } from '../../contexts/auth'
import Cookies from 'js-cookie'
import TabelaVendas from '../../components/Componente_TabelaVendas'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import DisplayData from '../../components/Componente_DisplayData'
import { toast } from 'react-toastify'

export const VendasContext = createContext({})

const Vendas = () =>{
  const location = useLocation();

  useEffect(() => {
      sessionStorage.setItem('currentPath', location.pathname);
  }, [location]);

  const {
    isDarkTheme, setIsDarkTheme,
    salesPageArray, setSalesPageArray,
    salesPageAdminArray, setSalesPageAdminArray,
    salesDateRange, setSalesDateRange,
    loadSales, loadTotalSales, salesTotal, setSalesTotal, tableData,
    groupByAdmin,
    
    alerta, gerarDados,
  } = useContext(AuthContext)

  useEffect(()=>{
    setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
    Cookies.set('tipo', 'vendas')
  },[])

  useEffect(()=>{
    if(salesPageArray.length>0){
      setSalesPageAdminArray(groupByAdmin(salesPageArray));
      loadTotalSales(salesPageArray)
    }
  },[salesPageArray])

  const resetValues = () => {
    setSalesPageArray([])
    setSalesPageAdminArray([])
    setSalesTotal({
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
    console.log('função buscar');
    try {
      setSalesPageArray(await loadSales(salesDateRange[0].toLocaleDateString('pt-BR'), salesDateRange[1].toLocaleDateString('pt-BR')));
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw error;
    }
  }

  const handleDateRangeChange = (dateRange) => {
    setSalesDateRange(dateRange)
  }

  return(
      <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        <div className={`page-vendas-background ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
          <div className={`page-content-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <div className={`vendas-title-container ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
              <h1 className={`vendas-title ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Calendário de Vendas</h1>
            </div>
            <div className='component-container-vendas'>
              { salesPageArray.length > 0 ? 
                <DisplayData dataArray={salesPageArray} adminDataArray={salesPageAdminArray} totals={salesTotal} tableData={tableData} onGoBack={resetValues}/>
                :
                <MyCalendar className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onLoadData={handleLoadData} getCalendarDate={handleDateRangeChange}/> 
              }
            </div>
          </div>
        </div>
      </div>
  )
}

export default Vendas

