import { useEffect, useContext, useState, useRef, useCallback } from 'react'
import '../Vendas/vendas.scss'
import Joyride from 'react-joyride'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import NewDisplayData from '../../components/Component_NewDisplayData'
import { toast } from 'react-toastify'


import { getThemeColor } from '../../util/contextUtils'
import PageShell from '../../components/PageShell'
import TutorialButton from '../../components/TutorialButton'
const Creditos = () => {
  const location = useLocation()
  
  const initialLoadDoneRef = useRef(false)

  const resetValues = useCallback(() => {
    setCreditsPageArray([])
    setCreditsPageAdminArray([])
    setBtnDisabledCredits(false)
    setCreditsTotal({
      debit: 0,
      credit: 0,
      voucher: 0,
      total: 0
    })
    initialLoadDoneRef.current = false
    setRunTutorial(false)
    
    localStorage.removeItem('reportBandeira')
    localStorage.removeItem('reportAdquirente')
  }, [])

  useEffect(() => {
    return () => {
      localStorage.removeItem('reportBandeira')
      localStorage.removeItem('reportAdquirente')
    }
  }, [])

  useEffect(() => {
    localStorage.removeItem('reportBandeira')
    localStorage.removeItem('reportAdquirente')
    localStorage.setItem('currentPath', location.pathname)
  }, [location])

  useEffect(() => {
    resetValues()
  }, [resetValues])

  const [listaBandeiras, setListaBandeiras] = useState([])
  const [listaAdministradoras, setListaAdministradoras] = useState([])

  useEffect(() => {
    const inicializar = async () => {
      setListaBandeiras(await loadBanners())
      setListaAdministradoras(await loadAdmins())
    }
    inicializar()
  }, [])

  const {
    creditsPageArray, setCreditsPageArray,
    creditsPageAdminArray, setCreditsPageAdminArray,
    creditsDateRange, setCreditsDateRange,
    creditsTotal, setCreditsTotal,
    loadAdmins, loadBanners,
    btnDisabledCredits, setBtnDisabledCredits,
    newLoadCredits,
    newGroupByAdminCredits,
    newLoadTotalCredits
  } = useContext(AuthContext)

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return ''
    
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date
    }
    
    if (date instanceof Date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    if (typeof date === 'string' && date.includes('/')) {
      const [day, month, year] = date.split('/')
      return `${year}-${month}-${day}`
    }
    
    return ''
  }

  async function handleLoadData(e) {
    e.preventDefault()
    try {
      setBtnDisabledCredits(true)
      toast.dismiss()
      await toast.promise(loadData(), {
        pending: 'Carregando créditos...',
      })
      setBtnDisabledCredits(false)
    } catch (error) {
      console.error('Error handling busca:', error)
      toast.error('Erro ao carregar créditos')
      setBtnDisabledCredits(false)
    }
  }

  async function loadData() {
    try {
      const startDate = creditsDateRange[0]
      const endDate = creditsDateRange[1]
      
      const formattedStartDate = formatDateToYYYYMMDD(startDate)
      const formattedEndDate = formatDateToYYYYMMDD(endDate)
      
      localStorage.setItem('dataInicial', formattedStartDate)
      localStorage.setItem('dataFinal', formattedEndDate)
      
      const creditsData = await newLoadCredits(formattedStartDate, formattedEndDate)
      
      if (creditsData && creditsData.length > 0) {
        let totalCredito = 0
        let totalDebito = 0
        let totalVoucher = 0
        let totalGeral = 0
        
        creditsData.forEach(credit => {
          const valor = Number(credit.VALORLIQUIDO) || 0
          const produto = (credit.PRODUTO || "").trim()
          
          totalGeral += valor
          
          if (produto === 'Crédito') {
            totalCredito += valor
          } else if (produto === 'Débito') {
            totalDebito += valor
          } else if (produto === 'Voucher') {
            totalVoucher += valor
          }
        })
        
        const totals = {
          debit: totalDebito,
          credit: totalCredito,
          voucher: totalVoucher,
          total: totalGeral
        }
        
        setCreditsTotal(totals)
        
        const groupedData = newGroupByAdminCredits(creditsData)
        setCreditsPageAdminArray(groupedData)
        
        setCreditsPageArray(creditsData)
      } else {
        setCreditsPageArray([])
        setCreditsPageAdminArray([])
        setCreditsTotal({
          debit: 0,
          credit: 0,
          voucher: 0,
          total: 0
        })
      }
      
      initialLoadDoneRef.current = true
      return creditsData
    } catch (error) {
      console.error('Error fetching credits data:', error)
      toast.error(error.response?.data?.mensagem || error.message || 'Erro ao carregar créditos')
      throw error
    }
  }

  useEffect(() => {
    if (creditsPageArray && creditsPageArray.length > 0 && !initialLoadDoneRef.current) {
      const groupedData = newGroupByAdminCredits(creditsPageArray)
      setCreditsPageAdminArray(groupedData)
      initialLoadDoneRef.current = true
    }
  }, [creditsPageArray, newGroupByAdminCredits])

  const handleDateRangeChange = (dateRange) => {
    setCreditsDateRange(dateRange)
  }

  const [runTutorial, setRunTutorial] = useState(false)
  const [tutorialSteps, setTutorialSteps] = useState([
    {
      target: '[data-tour="bandeiraadquirente-section"]',
      content: 'Selecione os filtros desejados para o relatório.',
      disableBeacon: true,
      placement: 'bottom'
    },
    {
      target: '[data-tour="calendario-section"]',
      content: 'Clique duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
      disableBeacon: true,
      placement: 'bottom'
    },
    {
      target: '[data-tour="pesquisar-section"]',
      content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta dos créditos da data ou período selecionado.',
      placement: 'bottom'
    },
  ])

  useEffect(() => {
    if (creditsPageArray.length > 0) {
      let stepsTemp = [
        {
          target: '[data-tour="modalidade-section"]',
          content: 'Valores totais dos créditos exibidos.',
          disableBeacon: true,
          placement: 'bottom'
        },
        {
          target: '[data-tour="exportacao-section"]',
          content: 'Exporta os créditos sendo exibidos para os formatos Excel ou PDF.',
          placement: 'bottom'
        },
        {
          target: '[data-tour="tabelavendas-section"]',
          content: 'Créditos do período selecionado. Podem ser filtrados por bandeira/adquirente.',
          placement: 'bottom'
        },
        {
          target: '[data-tour="totaladq-section"]',
          content: 'Valores totais dos créditos sendo exibidos, separados por adquirente.',
          placement: 'bottom'
        },
        {
          target: '[data-tour="botaovoltar-section"]',
          content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
          placement: 'bottom'
        },
      ]
      setTutorialSteps(stepsTemp)
    } else {
      setTutorialSteps([
        {
          target: '[data-tour="bandeiraadquirente-section"]',
          content: 'Selecione os filtros desejados para o relatório.',
          disableBeacon: true,
          placement: 'bottom'
        },
        {
          target: '[data-tour="calendario-section"]',
          content: 'Clique duas vezes em uma data para selecioná-la, ou uma vez em uma data inicial e uma vez em uma data final para selecionar o período começando e terminando nas datas selecionadas.',
          disableBeacon: true,
          placement: 'bottom'
        },
        {
          target: '[data-tour="pesquisar-section"]',
          content: 'Tendo a data selecionada, clique em "Pesquisar" para realizar a consulta dos créditos da data ou período selecionado.',
          placement: 'bottom'
        },
      ])
    }
  }, [creditsPageArray])

  const handleTutorialEnd = () => {
    setRunTutorial(false)
  }

  return (
    <PageShell title='Calendário de Créditos' tour="calendario-section">
        {creditsPageArray !== null ?
          (creditsPageArray.length > 0 ? (
            <NewDisplayData
              dataArray={creditsPageArray}
              adminDataArray={creditsPageAdminArray}
              totals={creditsTotal}
              onGoBack={resetValues}
              setRunTutorial={setRunTutorial}
              location={location}
              runTutorial={runTutorial}
              tutorialSteps={tutorialSteps}
              listaBandeiras={listaBandeiras}
              listaAdministradoras={listaAdministradoras}
              showSelects={false}
            />
          ) : (
            <>
              {runTutorial && (
                <Joyride
                  steps={tutorialSteps}
                  run={runTutorial}
                  continuous={true}
                  scrollToFirstStep={false}
                  showProgress={true}
                  showSkipButton={true}
                  scrollOffset={80}
                  styles={{
                    options: {
                      primaryColor: getThemeColor('--highlight-color', '#99cc33'),
                      textColor: '#0a3d70',
                      zIndex: 10000,
                    }
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
                    skip: 'Pular',
                    nextLabelWithProgress: 'Próximo ({step} de {steps})',
                  }}
                />
              )}
              
              <NewDisplayData
                dataArray={[]}
                adminDataArray={[]}
                totals={null}
                onGoBack={resetValues}
                setRunTutorial={setRunTutorial}
                location={location}
                runTutorial={runTutorial}
                tutorialSteps={tutorialSteps}
                listaBandeiras={listaBandeiras}
                listaAdministradoras={listaAdministradoras}
                showSelects={true}
                onSearch={handleLoadData}
                isSearching={btnDisabledCredits}
              />
              <MyCalendar
                onLoadData={handleLoadData}
                getCalendarDate={handleDateRangeChange}
                btnDisabled={btnDisabledCredits}
              />
            </>
          )
        ) : null}
        <TutorialButton onStart={() => {
            setRunTutorial(false);
            setTimeout(() => {
              setRunTutorial(true);
            }, 50);
          }} />
    </PageShell>
  )
}

export default Creditos