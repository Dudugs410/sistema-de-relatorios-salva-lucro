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

const DisplayData = ({ dataArray, adminDataArray, totals, onGoBack }) => {
  const {
    getUserData, 
    updateUserById, 
    clientUserId
  } = useContext(AuthContext)

  const [exportPage, setExportPage] = useState('')

  useEffect(() => {
    const currentPath = localStorage.getItem('currentPath')
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
  }, [localStorage.getItem('currentPath')])

  const componentMap = {
    0: TabelaVendas,
    1: TabelaCreditos,
    2: TabelaServicos,
  }

  const SelectedTableComponent = componentMap[exportPage]
  
    useEffect(() => {
      const currentPath = localStorage.getItem('currentPath')
      
      if(currentPath === '/vendas'){
        let userTemp = getUserData()
        const tutorialCompleted = userTemp.joyrideComplete.vendasTable
        if (!tutorialCompleted) {
          // Wait a moment for the DOM to fully render
          const timer = setTimeout(() => {
            setRunTutorial(true)
          }, 1000)
          return () => clearTimeout(timer)
        }
      } 
      
      else if(currentPath === '/creditos'){
        let userTemp = getUserData()
        const tutorialCompleted = userTemp.joyrideComplete.creditosTable
        if (!tutorialCompleted) {
          // Wait a moment for the DOM to fully render
          const timer = setTimeout(() => {
            setRunTutorial(true)
          }, 1000)
          return () => clearTimeout(timer)
        }
      } 
      
      else if(currentPath === '/servicos'){
        let userTemp = getUserData()
        const tutorialCompleted = userTemp.joyrideComplete.servicosTable
        if (!tutorialCompleted) {
          // Wait a moment for the DOM to fully render
          const timer = setTimeout(() => {
            setRunTutorial(true)
          }, 1000)
          return () => clearTimeout(timer)
        }
      }
    }, [location])
  
    const handleTutorialEnd = () => {
      setRunTutorial(false)
      const currentPath = localStorage.getItem('currentPath')
      if(currentPath === '/vendas'){
        updateUserById(clientUserId, {
            joyrideComplete: {
            vendasTable: true,
          },
        })
      } else if(currentPath === '/creditos'){
          updateUserById(clientUserId, {
            joyrideComplete: {
              creditosTable: true,
            },
          })
      } else if(currentPath === '/servicos'){
          updateUserById(clientUserId, {
            joyrideComplete: {
              servicosTable: true,
            },
          })
      }
    }

  return (
    <>
      {totals && <TotalModalidadesComp totals={totals} />}
      {localStorage.getItem('currentPath') === '/servicos' && <hr className='hr-global' />}
      <GerarRelatorio className='export' />
      <div className='component-container-vendas'>
        {SelectedTableComponent && <SelectedTableComponent array={dataArray} />}
        <TabelaGenericaAdm Array={adminDataArray} />
        <hr className='hr-global' />
      </div>
      <div className='search-bar'>
        <form className='date-container-vendas'>
          <div className='submit-container select-align voltar-align'>
            <button data-tour="botaovoltar-section" className='btn btn-secondary btn-global btn-pesquisar' onClick={onGoBack}>Voltar</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default DisplayData