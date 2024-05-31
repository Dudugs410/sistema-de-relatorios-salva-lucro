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

const DisplayData = ({ dataArray, adminDataArray, totals, tableData, onGoBack }) =>{
  const { gerarDados, gerarDadosServicos } = useContext(AuthContext)

  const [exportPage, setExportPage] = useState('')

  useEffect(()=>{
    switch (sessionStorage.getItem('currentPath')) {
      case '/vendas':
        setExportPage('/vendas')
        break;

      case '/creditos':
        setExportPage('/creditos')
        break;

      case '/servicos':
        setExportPage('/servicos')
        break;
    
      default:
        break;
    }
  },[])

  useEffect(() => {
    if(dataArray && dataArray.length > 0){
      if(sessionStorage.getItem('currentPath') === '/servicos'){
        gerarDadosServicos(dataArray)
      } else if ((sessionStorage.getItem('currentPath') === '/vendas') || (sessionStorage.getItem('currentPath') === '/creditos')){
        gerarDados(dataArray)
      }
    }
  },[])

  useEffect(()=>{

  },[exportPage])

  return(
      <>
        {totals ? <TotalModalidadesComp totals={totals}/> : null}
        {sessionStorage.getItem('currentPath') === '/servicos' ? <hr className='hr-global'/> : null}
        <GerarRelatorio className='export' tableData={tableData}/>
        <div className='component-container-vendas'>
          {exportPage === '/vendas' ? <TabelaVendas array={dataArray}/> : null}
          {exportPage === '/creditos' ? <TabelaCreditos array={dataArray}/> : null}
          {exportPage === '/servicos' ? <TabelaServicos array={dataArray}/> : null}      
          <TabelaGenericaAdm Array={adminDataArray}/>
          <hr className='hr-global'/>
        </div>
        <div className='search-bar'>
          <form className='date-container-vendas'>       
            <div className='submit-container select-align'>
              <button className='btn btn-secondary btn-global btn-pesquisar' onClick={ onGoBack }>Voltar</button>
            </div>
          </form>
			  </div>
      </>
  )
}

export default DisplayData