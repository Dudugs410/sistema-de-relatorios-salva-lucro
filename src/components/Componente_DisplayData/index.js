import { useEffect, useContext, createContext, useState } from 'react'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'
import GerarRelatorio from "../../components/Componente_GerarRelatorio"
import Cookies from 'js-cookie'

import { AuthContext } from '../../contexts/auth'
import TabelaVendas from '../../components/Componente_TabelaVendas'
import TabelaCreditos from '../Componente_TabelaCreditos'
import '../../index.scss'
import './displayData.scss'
import TabelaServicos from '../Componente_TabelaServicos'


export const VendasContext = createContext({})

const DisplayData = ({ dataArray, adminDataArray, totals, tableData, onGoBack }) =>{

  const { isDarkTheme, setIsDarkTheme } = useContext(AuthContext)

  useEffect(()=>{
    setIsDarkTheme(JSON.parse(localStorage.getItem('isDark')))
  },[])

  return(
      <>
        {totals ? <TotalModalidadesComp totals={totals}/> : null}
        {sessionStorage.getItem('currentPath') === '/servicos' ? <hr className={`hr-global ${ isDarkTheme ? 'dark-theme' : 'light-theme' }`}/> : null}
        <GerarRelatorio className='export' tableData={tableData}/>
        <div className='component-container-vendas'>
          {sessionStorage.getItem('currentPath') === '/vendas' ? <TabelaVendas array={dataArray}/> : null}
          {sessionStorage.getItem('currentPath') === '/creditos' ? <TabelaCreditos array={dataArray}/> : null}
          {sessionStorage.getItem('currentPath') === '/servicos' ? <TabelaServicos array={dataArray}/> : null}      
          <TabelaGenericaAdm Array={adminDataArray}/>
          <hr className={`hr-global ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}/>
        </div>
        <div className='search-bar'>
          <form className={`date-container-vendas ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`}>       
            <div className='submit-container select-align'>
              <button className={`btn btn-secondary btn-global btn-pesquisar ${isDarkTheme === true ? 'dark-theme' : 'light-theme'}`} onClick={ onGoBack }>Voltar</button>
            </div>
          </form>
			  </div>
      </>
  )
}

export default DisplayData