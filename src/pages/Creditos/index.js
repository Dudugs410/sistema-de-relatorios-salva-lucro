import { useEffect, useContext, useState, useRef, useCallback } from 'react'
import Select from 'react-select'
import '../Vendas/vendas.scss'
import Joyride from 'react-joyride'
import { AuthContext } from '../../contexts/auth'
import { useLocation } from 'react-router-dom'
import '../../index.scss'
import MyCalendar from '../../components/Componente_Calendario'
import NewDisplayData from '../../components/Component_NewDisplayData'
import { toast } from 'react-toastify'
import { FiHelpCircle } from 'react-icons/fi'

// Custom Select styles — same as Bancos/Vendas
const customSelectStyles = {
  control: (base, { isFocused }) => ({
    ...base,
    minWidth: 250,
    width: '100%',
    backgroundColor: 'var(--background-color)',
    borderColor: isFocused ? 'var(--secondary-color)' : 'var(--bs-border-color)',
    color: 'var(--font-color)',
    '&:hover': { borderColor: 'var(--secondary-color)' },
    boxShadow: isFocused ? '0 0 0 1px var(--secondary-color)' : 'none',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--background-color)',
    borderColor: 'var(--bs-border-color)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: 'var(--background-color)',
    padding: '4px 0',
    '::-webkit-scrollbar': { width: '8px', height: '8px' },
    '::-webkit-scrollbar-track': { background: 'rgba(255, 255, 255, 0.1)' },
    '::-webkit-scrollbar-thumb': { background: 'var(--secondary-color)', borderRadius: '4px' },
    '::-webkit-scrollbar-thumb:hover': { background: 'var(--primary-color)' },
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? 'var(--secondary-color)'
      : isFocused
        ? 'rgba(var(--secondary-color-rgb), 0.2)'
        : 'transparent',
    color: isSelected ? 'var(--primary-color)' : 'var(--font-color)',
    cursor: 'pointer',
    padding: '8px 12px',
    '&:active': { backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)' },
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--font-color)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '90%',
  }),
  input: (base) => ({ ...base, color: 'var(--font-color)' }),
  placeholder: (base) => ({ ...base, color: 'var(--font-color)', opacity: 0.6 }),
  valueContainer: (base) => ({
    ...base,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: 'var(--font-color)',
    '&:hover': { color: 'var(--secondary-color)' },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: 'var(--font-color)',
    '&:hover': { color: 'var(--secondary-color)' },
  }),
  indicatorSeparator: (base) => ({ ...base, backgroundColor: 'var(--bs-border-color)' }),
  noOptionsMessage: (base) => ({ ...base, color: 'var(--font-color)' }),
  loadingMessage: (base) => ({ ...base, color: 'var(--font-color)' }),
}

const themeConfig = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: 'var(--secondary-color)',
    primary75: 'var(--secondary-color)',
    primary50: 'rgba(var(--secondary-color-rgb), 0.5)',
    primary25: 'rgba(var(--secondary-color-rgb), 0.25)',
    neutral0: 'var(--background-color)',
    neutral5: 'var(--background-color)',
    neutral10: 'var(--background-color)',
    neutral20: 'var(--bs-border-color)',
    neutral30: 'var(--bs-border-color)',
    neutral40: 'var(--font-color)',
    neutral50: 'var(--font-color)',
    neutral60: 'var(--font-color)',
    neutral70: 'var(--font-color)',
    neutral80: 'var(--font-color)',
    neutral90: 'var(--font-color)',
  },
})

const Creditos = () => {
  const location = useLocation()

  // Add a ref to track if initial load has happened
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
    setAdministradora(null)
    setBandeira(null)
    localStorage.removeItem('selectedAdmCredits')
    localStorage.removeItem('selectedBanCredits')
    initialLoadDoneRef.current = false
    setRunTutorial(false)
  }, [])

  useEffect(() => {
    resetValues()
  }, [resetValues])

  useEffect(() => {
    localStorage.setItem('currentPath', location.pathname)
  }, [location])

  const [bandeira, setBandeira] = useState(null)
  const [administradora, setAdministradora] = useState(null)

  const [listaBandeiras, setListaBandeiras] = useState([])
  const [listaAdministradoras, setListaAdministradoras] = useState([])

  useEffect(() => {
    const inicializar = async () => {
      setListaBandeiras(await loadBanners())
      setListaAdministradoras(await loadAdmins())
    }
    inicializar()
  }, [])

  const handleAdmin = (option) => {
    setAdministradora(option?.codigoAdquirente || null)
    localStorage.setItem('selectedAdmCredits', JSON.stringify(option))
  }

  const handleBan = (option) => {
    setBandeira(option?.codigoBandeira || null)
    localStorage.setItem('selectedBanCredits', JSON.stringify(option))
  }

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

  // Format date to YYYY-MM-DD for API
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

  // Load data using the new API
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

  // Update admin array when creditsPageArray changes - ONLY ONCE
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

  const getSelectedAdminOption = () => {
    if (!administradora || listaAdministradoras.length === 0) return null
    return listaAdministradoras.find(option => option.codigoAdquirente === administradora)
  }

  const getSelectedBanOption = () => {
    if (!bandeira || listaBandeiras.length === 0) return null
    return listaBandeiras.find(option => option.codigoBandeira === bandeira)
  }

  // Joyride state
  const [runTutorial, setRunTutorial] = useState(false)
  const [tutorialSteps, setTutorialSteps] = useState([
    {
      target: '[data-tour="select-container-calendario"]',
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
          target: '[data-tour="select-container-calendario"]',
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
    <div className='page-content-vendas'>
      <div className='component-container-vendas' data-tour="calendario-section">
        <div className='vendas-title-container'>
          <h1 className='vendas-title'>Calendário de Créditos</h1>
        </div>
        <hr className='hr-global' />
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
                      primaryColor: '#99cc33',
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

              <div className='select-container-calendario' data-tour="select-container-calendario">
                <div className='select-wrapper'>
                  <h5>Adquirente</h5>
                  <Select
                    className='seletor-adq-select fixed-width-select'
                    id='adquirente'
                    options={listaAdministradoras}
                    getOptionLabel={(option) => option.nomeAdquirente}
                    getOptionValue={(option) => option.codigoAdquirente}
                    onChange={(option) => handleAdmin(option)}
                    value={getSelectedAdminOption()}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    placeholder="Selecione uma adquirente..."
                    isClearable={true}
                    styles={customSelectStyles}
                    theme={themeConfig}
                  />
                </div>
                <div className='select-wrapper'>
                  <h5>Bandeira</h5>
                  <Select
                    className='seletor-adq-select fixed-width-select'
                    id='bandeira'
                    options={listaBandeiras}
                    getOptionLabel={(option) => option.descricaoBandeira}
                    getOptionValue={(option) => option.codigoBandeira}
                    onChange={(option) => handleBan(option)}
                    value={getSelectedBanOption()}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    placeholder="Selecione uma bandeira..."
                    isClearable={true}
                    styles={customSelectStyles}
                    theme={themeConfig}
                  />
                </div>
              </div>
              <MyCalendar
                onLoadData={handleLoadData}
                getCalendarDate={handleDateRangeChange}
                btnDisabled={btnDisabledCredits}
              />
            </>
          )
        ) : null}
        <button
          className='btn btn-success-dados btn-tutorial px-2 py-1'
          onClick={() => {
            setRunTutorial(false);
            setTimeout(() => {
              setRunTutorial(true);
            }, 50);
          }}
          style={{
            position: 'relative',
            bottom: '0px',
            right: '-10px',
            zIndex: 10,
            padding: '10px 15px',
            background: 'none',
            color: '#99cc33',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          <FiHelpCircle />
        </button>
      </div>
    </div>
  )
}

export default Creditos