import { useEffect, useState } from 'react'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'
import GerarRelatorio from "../../components/Componente_GerarRelatorio"
import TabelaVendas from '../../components/Componente_TabelaVendas'
import TabelaCreditos from '../Componente_TabelaCreditos'
import '../../index.scss'
import './displayData.scss'
import TabelaServicos from '../Componente_TabelaServicos'

const DisplayData = ({ dataArray, adminDataArray, totals, onGoBack }) => {
  const [exportPage, setExportPage] = useState('')

  useEffect(() => {
    const currentPath = sessionStorage.getItem('currentPath')
    switch (currentPath) {
      case '/vendas':
        setExportPage(0)
        break
      case '/creditos':
        setExportPage(1)
        break
      case '/servicos':
        setExportPage(2)
        break
      default:
        setExportPage('')
        break
    }
  }, [sessionStorage.getItem('currentPath')])

  const componentMap = {
    0: TabelaVendas,
    1: TabelaCreditos,
    2: TabelaServicos,
  }

  const SelectedTableComponent = componentMap[exportPage]

  return (
    <>
      {totals && <TotalModalidadesComp totals={totals} />}
      {sessionStorage.getItem('currentPath') === '/servicos' && <hr className='hr-global' />}
      <GerarRelatorio className='export' />
      <div className='component-container-vendas'>
        {SelectedTableComponent && <SelectedTableComponent array={dataArray} />}
        <TabelaGenericaAdm Array={adminDataArray} />
        <hr className='hr-global' />
      </div>
      <div className='search-bar'>
        <form className='date-container-vendas'>
          <div className='submit-container select-align'>
            <button className='btn btn-secondary btn-global btn-pesquisar' onClick={onGoBack}>Voltar</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default DisplayData