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

export const VendasContext = createContext({})

const Vendas = () =>{
  const location = useLocation();

  useEffect(() => {
      sessionStorage.setItem('currentPath', location.pathname);
  }, [location]);

  const {
    cnpj,
    vendas,
    tableData,
    isDarkTheme,
    setIsDarkTheme,
    detalhes,
    dataBuscaVendas,
    dataInicialExibicaoVendas,
    dataFinalExibicaoVendas,
    handleDateChangeVendas,
    setTotalDebitoVendas,
    setTotalCreditoVendas,
    setTotalVoucherVendas,
    setTotalLiquidoVendas,
    setCnpjBuscaVendas,
    arrayAdmVendas,
    setArrayAdmVendas,
    setArrayRelatorioVendas,
    separaAdmArray,
    gerarDados,
    setTipo,
    setTotaisGlobal,
    pagina, setPagina,
  } = useContext(AuthContext)

  useEffect(()=>{
    setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
  },[])

  useEffect(()=>{
	  setTipo('vendas')
	  Cookies.set('tipo', 'vendas')
	},[])

  useEffect(()=>{
    try {
      console.log('teste')
      if(vendas.length === 0){
        setTotalCreditoVendas(0.00)
        setTotalDebitoVendas(0.00)
        setTotalVoucherVendas(0.00)
        setTotalLiquidoVendas(0.00)
      } else if (vendas.length > 0){
        console.log('entrou aqui')
        setArrayRelatorioVendas(gerarDados(vendas))
        setArrayAdmVendas(separaAdmArray(vendas))
      }
    } catch (error) {
      console.log(error)
    }
  },[vendas])

  useEffect(()=>{
    setCnpjBuscaVendas(cnpj)
  },[cnpj])

  useEffect(()=>{
    setTotaisGlobal({ debito: 0, credito: 0, voucher: 0, liquido: 0 })
  },[])

  useEffect(()=>{
    console.log('arrayAdmVendas: ', arrayAdmVendas)
  },[arrayAdmVendas])

  useEffect(()=>{
    setPagina(sessionStorage.getItem('currentPath'))
  },[])

  return(
      <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        <div className={`page-vendas-background ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
          <div className={`page-content-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <div className={`vendas-title-container ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
              <h1 className={`vendas-title ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Calendário de Vendas</h1>
            </div>
            <TotalModalidadesComp tipo = 'vendas'/>
            { vendas.length > 0 ? <GerarRelatorio className='export' tableData={tableData} detalhes={detalhes} tipo='vendas' /> : <></> }
            <div className='component-container-vendas'>
              { vendas.length > 0 ? <TabelaVendas array={vendas}/> : <MyCalendar dataInicialExibicao={dataInicialExibicaoVendas} dataFinalExibicao={dataFinalExibicaoVendas} dataBusca={dataBuscaVendas} handleDateChange={handleDateChangeVendas} className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/> }
              { vendas.length > 0 ? <TabelaGenericaAdm Array={arrayAdmVendas}/> : <></> }
              { vendas.length > 0 ? <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/> : <></> }
            </div>
            <BuscarClienteVendas />
          </div>
        </div>
      </div>
  )
}

export default Vendas

