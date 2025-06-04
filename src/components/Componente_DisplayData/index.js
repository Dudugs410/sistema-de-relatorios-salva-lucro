import { useContext, useEffect, useState } from 'react'
import Joyride from 'react-joyride'
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
  const [userData, setUserData] = useState(getUserData())

  useEffect(()=>{
    setUserData(getUserData())
  },[updateUserById])

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

    // Joyride state
  
    const [runTutorial, setRunTutorial] = useState(false)
    const [steps, setSteps] = useState([
          {
            target: '[data-tour="modalidade-section"]',
            content: 'Valores totais das vendas exibidas, por modalidade.',
            disableBeacon: true,
            placement: 'bottom'
          },
          {
            target: '[data-tour="exportacao-section"]',
            content: 'Exporta as vendas sendo exibidas para os formatos Excel ou PDF.',
            placement: 'bottom'
          },
          {
            target: '[data-tour="bandeiraadquirente-section"]',
            content: 'Filtra as vendas de acordo com a combinação de bandeira/adquirente selecionada.',
            placement: 'bottom'
          },
          {
            target: '[data-tour="tabelavendas-section"]',
            content: 'Vendas do período selecionado. Podem ser filtradas por bandeira/adquirente.',
            placement: 'bottom'
          },
          {
            target: '[data-tour="totaladq-section"]',
            content: 'Valores totais das vendas sendo exibidas, separadas por adquirente.',
            placement: 'bottom'
          },
          {
            target: '[data-tour="botaovoltar-section"]',
            content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
            placement: 'bottom'
          },
        ])
  
    useEffect(() => {
      //********setar steps de acordo com currentPath
      const currentPath = localStorage.getItem('currentPath')
      if(currentPath === '/vendas'){
        let stepsTemp = [
            {
              target: '[data-tour="modalidade-section"]',
              content: 'Valores totais das vendas exibidas, por modalidade.',
              disableBeacon: true,
              placement: 'bottom'
            },
            {
              target: '[data-tour="exportacao-section"]',
              content: 'Exporta as vendas sendo exibidas para os formatos Excel ou PDF.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="bandeiraadquirente-section"]',
              content: 'Filtra as vendas de acordo com a combinação de bandeira/adquirente selecionada.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="tabelavendas-section"]',
              content: 'Vendas do período selecionado. Podem ser filtradas por bandeira/adquirente.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="totaladq-section"]',
              content: 'Valores totais das vendas sendo exibidas, separadas por adquirente.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="botaovoltar-section"]',
              content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
              placement: 'bottom'
            },
        ]
        setSteps(stepsTemp)
      } else if(currentPath === '/creditos'){
          let stepsTemp = [
            {
              target: '[data-tour="modalidade-section"]',
              content: 'Valores totais das vendas exibidas, por modalidade.',
              disableBeacon: true,
              placement: 'bottom'
            },
            {
              target: '[data-tour="exportacao-section"]',
              content: 'Exporta as vendas sendo exibidas para os formatos Excel ou PDF.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="bandeiraadquirente-section"]',
              content: 'Filtra as vendas de acordo com a combinação de bandeira/adquirente selecionada.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="tabelavendas-section"]',
              content: 'Vendas do período selecionado. Podem ser filtradas por bandeira/adquirente.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="totaladq-section"]',
              content: 'Valores totais das vendas sendo exibidas, separadas por adquirente.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="botaovoltar-section"]',
              content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
              placement: 'bottom'
            },
        ]
        setSteps(stepsTemp)
      } else if(currentPath === '/servicos'){
          let stepsTemp = [
            {
              target: '[data-tour="exportacao-section"]',
              content: 'Exporta as informações de serviços/ajustes sendo exibidas, para os formatos Excel ou PDF.',
              disableBeacon: true,
              placement: 'bottom'
            },
            {
              target: '[data-tour="bandeiraadquirente-section"]',
              content: 'Filtra os ajustes/serviços de acordo com a combinação de bandeira/adquirente selecionada.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="tabelavendas-section"]',
              content: 'Serviços/Ajustes do período selecionado. Podem ser filtrados por bandeira/adquirente.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="totaladq-section"]',
              content: 'Valores totais dos serviços/ajustes sendo exibidas, separados por adquirente.',
              placement: 'bottom'
            },
            {
              target: '[data-tour="botaovoltar-section"]',
              content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
              placement: 'bottom'
            },
        ]
        setSteps(stepsTemp)
      }
      
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
      
      if(currentPath === '/creditos'){
        let userTemp = getUserData()
        const tutorialCompleted = userTemp.joyrideComplete.creditsTable
        if (!tutorialCompleted) {
          // Wait a moment for the DOM to fully render
          const timer = setTimeout(() => {
            setRunTutorial(true)
          }, 1000)
          return () => clearTimeout(timer)
        }
      } 
      
      if(currentPath === '/servicos'){
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
      { runTutorial &&
        <Joyride
          steps={steps}
          run={runTutorial}
          continuous={true}
          scrollToFirstStep={true}
          showProgress={true}
          showSkipButton={true}
          styles={{
            options: {
              primaryColor: '#99cc33',
              textColor: '#0a3d70',
              zIndex: 10000,
            },
          }}
          callback={(data) => {
            if (data.status === 'finished' || data.status === 'skipped') {
              handleTutorialEnd()
            }
          }}
          locale={{
            back: 'Voltar',
            close: 'Fechar',
            last: 'Finalizar',
            next: 'Próximo',
            skip: 'Pular'
          }}
        />	
      }
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