import { useEffect, useContext, createContext, useState } from 'react'
import Calendar from 'react-calendar'

import BuscarClienteVendas from '../../components/Componente_BuscarClienteVendas'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'

import GerarRelatorio from "../../components/Componente_GerarRelatorio"
import './relatorios.scss'
import { AuthContext } from '../../contexts/auth'
import Cookies from 'js-cookie'
import TabelaVendasCreditos from '../../components/Componente_TabelaVendasCreditos'
import { useLocation } from 'react-router-dom'
import '../../index.scss'

export const VendasContext = createContext({})

const Relatorios = () =>{
  const location = useLocation();

  useEffect(() => {
      sessionStorage.setItem('currentPath', location.pathname);
  }, [location]);

  const {
    cnpj,
    setCnpj,
    vendas,
    gerarDados,
    tableData,
    isDarkTheme,
    setIsDarkTheme,
    bandeiras,
    grupos,
    adquirentes,
    loadBandeiras,
    setGrupos,
    loadAdquirentes,
  } = useContext(AuthContext)

  const [tipo, setTipo] = useState('')
  const [cnpjBusca, setCnpjBusca] = useState(Cookies.get('cnpj'))
  const [dataBusca, setDataBusca] = useState({inicial: new Date, final: new Date})

  useEffect(()=>{
    setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
},[])

  useEffect(()=>{
    async function inicializar(){
      if(bandeiras.length === 0){
        await loadBandeiras()
      }
      
      if(grupos.length === 0){
        setGrupos(JSON.parse(sessionStorage.getItem('grupos')))     
      }
      
      if(adquirentes.length === 0){
        await loadAdquirentes()
      }
    }
    inicializar()
  },[])

  useEffect(()=>{
    vendas.length = 0
  },[])

  useEffect(()=>{
    setCnpjBusca(Cookies.get('cnpj'))
  },[])

  function handleDateChange(){
    setDataBusca(dataBusca)
  }

  let data = new Date

  function MyCalendar() {
    return (
      <div>
        <Calendar
          selectRange={true}
          style={{ color:'white' }}
          className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
          onChange={ handleDateChange }
          value={ data }
          tileClassName={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}
        />
      </div>
    )
  }

  return(
    <div className={`appPage ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
      <div className={`page-vendas-background ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
        <div className={`page-content-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
          <div className={`vendas-title-container ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>
            <h1 className={`vendas-title ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>Calendário de Vendas</h1>
          </div>
          <hr className="hr-recebimentos"/>
          <TotalModalidadesComp tipo = 'vendas'/>
          <hr className="hr-recebimentos"/>
            <MyCalendar className={`${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
          </div>
        </div>
      </div>
  )
}

export default Relatorios