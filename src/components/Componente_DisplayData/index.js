import { useContext, useEffect, useState } from 'react'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'
import GerarRelatorio from "../../components/Componente_GerarRelatorio"
import TabelaVendas from '../../components/Componente_TabelaVendas'
import TabelaCreditos from '../Componente_TabelaCreditos'
import '../../index.scss'
import './displayData.scss'
import TabelaServicos from '../Componente_TabelaServicos'
import { AuthContext } from '../../contexts/auth'

const DisplayData = ({ dataArray, adminDataArray, totals, onGoBack, setRunTutorial, location }) => {
  const { getUserData, updateUserById, clientUserId } = useContext(AuthContext)
  
  // State initialization
  const [exportPage, setExportPage] = useState('')
  const [currentPath, setCurrentPath] = useState(location.pathname)

  // Helper function to get path key
  const getPathKey = (path) => {
    switch(path) {
      case '/vendas': return 'vendasTable'
      case '/creditos': return 'creditosTable'
      case '/servicos': return 'servicosTable'
      default: return null
    }
  }

  // Main effect to handle path changes
  useEffect(() => {
    const path = location.pathname
    setCurrentPath(path)
    localStorage.setItem('currentPath', path)

    // Update export page
    switch (path) {
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

    // Handle tutorial logic
    const pathKey = getPathKey(path)
    if (pathKey) {
      const userTemp = getUserData()
      if (!userTemp?.joyrideComplete?.[pathKey]) {
        const timer = setTimeout(() => setRunTutorial(true), 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [location.pathname, getUserData, setRunTutorial])

  // Component mapping
  const componentMap = {
    0: TabelaVendas,
    1: TabelaCreditos,
    2: TabelaServicos,
  }

  const SelectedTableComponent = componentMap[exportPage]

  const handleDataTutorialEnd = () => {
    setRunTutorial(false)
    const pathKey = getPathKey(currentPath)
    if (pathKey && clientUserId) {
      updateUserById(clientUserId, {
        joyrideComplete: { [pathKey]: true }
      })
    }
  }

  return (
    <>
      {totals && <TotalModalidadesComp totals={totals} />}
      {currentPath === '/servicos' && <hr className='hr-global' />}
      <GerarRelatorio className='export' />
      <div className='component-container-vendas'>
        {SelectedTableComponent && <SelectedTableComponent array={dataArray} />}
        <TabelaGenericaAdm Array={adminDataArray} />
        <hr className='hr-global' />
      </div>
      <div className='search-bar'>
        <form className='date-container-vendas'>
          <div className='submit-container select-align voltar-align'>
            <button 
              data-tour="botaovoltar-section" 
              className='btn btn-secondary btn-global btn-pesquisar' 
              onClick={onGoBack}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default DisplayData