// OpenFinance.jsx
import { useEffect, useContext, useState, useCallback } from 'react'
import Select from 'react-select'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import Joyride from 'react-joyride'
import MyCalendar from '../../components/Componente_Calendario'
import NewDisplayData from '../../components/Component_NewDisplayData'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiHelpCircle } from 'react-icons/fi'
import '../../styles/global.scss'
import './OpenFinance.scss'

// Format currency helper
const formatCurrency = (value) => {
  if (value === undefined || value === null || value === '') {
    return 'R$ 0,00'
  }
  let numValue = typeof value === 'string' ? parseFloat(value) : Number(value)
  if (isNaN(numValue)) {
    return 'R$ 0,00'
  }
  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Format date from ISO to Brazilian format
const formatDateOnly = (isoDate) => {
  if (!isoDate) return 'N/A'
  try {
    if (typeof isoDate === 'string' && isoDate.includes('T')) {
      const datePart = isoDate.split('T')[0]
      const [year, month, day] = datePart.split('-')
      if (year && month && day) {
        return `${day}/${month}/${year}`
      }
    }
    if (typeof isoDate === 'string' && isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = isoDate.split('-')
      return `${day}/${month}/${year}`
    }
    return isoDate || 'N/A'
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'N/A'
  }
}

// Format CNPJ
const formatCNPJ = (cnpj) => {
  if (!cnpj) return 'N/A'
  const cleaned = cnpj.replace(/\D/g, '')
  if (cleaned.length === 14) {
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    )
  }
  return cnpj
}

// Custom Select styles with theme support
const customSelectStyles = {
  control: (base, { isFocused }) => ({
    ...base,
    minWidth: 300,
    width: '100%',
    backgroundColor: 'var(--background-color)',
    borderColor: isFocused ? 'var(--secondary-color)' : 'var(--bs-border-color)',
    color: 'var(--font-color)',
    '&:hover': {
      borderColor: 'var(--secondary-color)',
    },
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
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
    '::-webkit-scrollbar-thumb': {
      background: 'var(--secondary-color)',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: 'var(--primary-color)',
    },
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
    '&:active': {
      backgroundColor: 'var(--secondary-color)',
      color: 'var(--primary-color)',
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--font-color)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '90%',
  }),
  input: (base) => ({
    ...base,
    color: 'var(--font-color)',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--font-color)',
    opacity: 0.6,
  }),
  valueContainer: (base) => ({
    ...base,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: 'var(--font-color)',
    '&:hover': {
      color: 'var(--secondary-color)',
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: 'var(--font-color)',
    '&:hover': {
      color: 'var(--secondary-color)',
    },
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: 'var(--bs-border-color)',
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: 'var(--font-color)',
  }),
  loadingMessage: (base) => ({
    ...base,
    color: 'var(--font-color)',
  }),
}

const OpenFinance = () => {
  const location = useLocation()
  const { dateConvert } = useContext(AuthContext)

  // State for bank selection
  const [bankCode, setBankCode] = useState(null)
  const [bankOptions, setBankOptions] = useState([])
  const [loadingBanks, setLoadingBanks] = useState(false)

  // State for data
  const [bankData, setBankData] = useState([])
  const [bankDataAdmin, setBankDataAdmin] = useState([])
  const [bankTotal, setBankTotal] = useState({
    total: 0,
    income: 0,
    expense: 0,
    count: 0
  })
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [dateRange, setDateRange] = useState([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [runTutorial, setRunTutorial] = useState(false)

  // Load bank options from API
  const loadBankOptions = useCallback(async () => {
    try {
      setLoadingBanks(true)
      const response = await api.get('/banco')
      
      // Filter banks with NOME and CODIGOBANCO, then deduplicate by CODIGOBANCO
      const banksMap = new Map()
      
      response.data
        .filter(bank => bank.NOME && bank.CODIGOBANCO)
        .forEach(bank => {
          // Use CODIGOBANCO as key to deduplicate
          const key = bank.CODIGOBANCO
          if (!banksMap.has(key)) {
            banksMap.set(key, {
              codigoBanco: bank.CODIGOBANCO,
              nomeBanco: bank.NOME
            })
          }
        })
      
      // Convert Map to array and sort by name
      const banks = Array.from(banksMap.values())
        .sort((a, b) => a.nomeBanco.localeCompare(b.nomeBanco))
      
      setBankOptions(banks)
      
      // Restore previously selected bank from localStorage
      const savedBank = localStorage.getItem('selectedBank')
      if (savedBank) {
        try {
          const parsedBank = JSON.parse(savedBank)
          const foundBank = banks.find(b => b.codigoBanco === parsedBank.codigoBanco)
          if (foundBank) {
            setBankCode(foundBank.codigoBanco)
          }
        } catch (e) {
          console.error('Error parsing saved bank:', e)
        }
      }
    } catch (error) {
      console.error('Error loading bank options:', error)
      toast.error('Erro ao carregar lista de bancos')
    } finally {
      setLoadingBanks(false)
    }
  }, [])

  // Load bank options on component mount
  useEffect(() => {
    loadBankOptions()
  }, [loadBankOptions])

  // Reset values
  const resetValues = useCallback(() => {
    setBankCode(null)
    setBankData([])
    setBankDataAdmin([])
    setBtnDisabled(false)
    setBankTotal({
      total: 0,
      income: 0,
      expense: 0,
      count: 0
    })
    setIsDataLoaded(false)
    setRunTutorial(false)
  }, [])

  // Handle bank selection
  const handleBankChange = (option) => {
    setBankCode(option?.codigoBanco || null)
    if (option) {
      localStorage.setItem('selectedBank', JSON.stringify(option))
    } else {
      localStorage.removeItem('selectedBank')
    }
  }

  // Handle date range change from calendar
  const handleDateRangeChange = (dateRange) => {
    setDateRange(dateRange)
  }

  // Load bank statement data
  const loadBankData = useCallback(async (e) => {
    if (e) e.preventDefault()
    
    if (!bankCode) {
      toast.warning('Por favor, selecione um banco')
      return
    }

    if (!dateRange || dateRange.length < 2) {
      toast.warning('Por favor, selecione um período')
      return
    }

    try {
      setBtnDisabled(true)
      toast.dismiss()

      const startDate = dateRange[0]
      const endDate = dateRange[1]
      
      // Format dates for API
      const formatDateForAPI = (date) => {
        if (date instanceof Date) {
          return date.toISOString().split('T')[0]
        }
        return date
      }

      const dataInicial = formatDateForAPI(startDate)
      const dataFinal = formatDateForAPI(endDate)

      // Get bank name for display
      const selectedBank = bankOptions.find(b => b.codigoBanco === bankCode)
      const bankName = selectedBank?.nomeBanco || 'Banco não informado'

      await toast.promise(
        async () => {
          const response = await api.get('/ExtratoBancario', {
            params: {
              codigoBanco: bankCode,
              DataInicial: dataInicial,
              DataFinal: dataFinal
            }
          })

          const data = response.data || []
          
          // Process data
          const processedData = data.map(item => ({
            ...item,
            DataFormatada: item.Data ? formatDateOnly(item.Data) : '',
            ValorFormatado: item.Valor ? formatCurrency(item.Valor) : 'R$ 0,00',
            TipoTransacao: item.Categoria === 'Income' ? 'Receita' : 'Despesa',
            CnpjFormatado: formatCNPJ(item.CnpjPagador || item.CnpjRecebedor),
            NOMEBANCO: bankName,
            CODIGOBANCO: bankCode
          }))

          setBankData(processedData)

          // Calculate totals
          let totalIncome = 0
          let totalExpense = 0
          let totalGeneral = 0

          processedData.forEach(item => {
            const valor = item.Valor || 0
            totalGeneral += valor
            if (item.Categoria === 'Income') {
              totalIncome += valor
            } else {
              totalExpense += valor
            }
          })

          setBankTotal({
            total: totalGeneral,
            income: totalIncome,
            expense: Math.abs(totalExpense),
            count: processedData.length
          })

          // Group by bank for admin view
          const adminMap = new Map()
          processedData.forEach(item => {
            const bankNameItem = item.NOMEBANCO || 'Banco não informado'
            if (!adminMap.has(bankNameItem)) {
              adminMap.set(bankNameItem, {
                adminName: bankNameItem,
                total: 0
              })
            }
            adminMap.get(bankNameItem).total += item.Valor || 0
          })

          setBankDataAdmin(Array.from(adminMap.values()))

          setIsDataLoaded(true)
        },
        {
          pending: 'Carregando dados bancários...',
          success: 'Dados carregados com sucesso!',
          error: 'Erro ao carregar dados'
        }
      )

      setBtnDisabled(false)
    } catch (error) {
      setBtnDisabled(false)
      console.error('Error loading bank data:', error)
      toast.error(error.response?.data?.message || 'Erro ao carregar dados bancários')
      resetValues()
    }
  }, [bankCode, dateRange, bankOptions, resetValues])

  // Get selected bank option
  const getSelectedBankOption = useCallback(() => {
    if (!bankCode || bankOptions.length === 0) return null
    return bankOptions.find(option => option.codigoBanco === bankCode)
  }, [bankCode, bankOptions])

  // Get table columns for bank data
  const getTableColumns = useCallback(() => {
    return [
      { 
        key: 'Data', 
        header: 'Data',
        accessor: (item) => {
          if (!item?.Data) return 'N/A'
          try {
            const date = new Date(item.Data)
            return date.toLocaleDateString('pt-BR')
          } catch {
            return 'N/A'
          }
        }
      },
      { 
        key: 'Descrição', 
        header: 'Descrição'
      },
      { 
        key: 'Valor', 
        header: 'Valor',
        render: (item) => {
          const valor = Number(item?.Valor) || 0
          return (
            <span className={valor >= 0 ? 'green-global' : 'red-global'}>
              {valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </span>
          )
        }
      },
      { 
        key: 'Categoria', 
        header: 'Categoria',
        render: (item) => {
          const isIncome = item?.Categoria === 'Income'
          return (
            <span className={isIncome ? 'badge-success' : 'badge-danger'}>
              {isIncome ? 'Receita' : 'Despesa'}
            </span>
          )
        }
      },
      { 
        key: 'Operação', 
        header: 'Operação',
        render: (item) => {
          const opMap = {
            1: 'Crédito',
            2: 'Débito',
            3: 'Estorno'
          }
          return opMap[item?.Operação] || 'Outros'
        }
      },
      { 
        key: 'CnpjPagador', 
        header: 'CNPJ Pagador',
        render: (item) => {
          const cnpj = item?.CnpjPagador || ''
          if (!cnpj) return 'N/A'
          const cleaned = cnpj.replace(/\D/g, '')
          if (cleaned.length === 14) {
            return cleaned.replace(
              /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
              '$1.$2.$3/$4-$5'
            )
          }
          return cnpj
        }
      },
      { 
        key: 'NomePagador', 
        header: 'Pagador'
      },
      { 
        key: 'CnpjRecebedor', 
        header: 'CNPJ Recebedor',
        render: (item) => {
          const cnpj = item?.CnpjRecebedor || ''
          if (!cnpj) return 'N/A'
          const cleaned = cnpj.replace(/\D/g, '')
          if (cleaned.length === 14) {
            return cleaned.replace(
              /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
              '$1.$2.$3/$4-$5'
            )
          }
          return cnpj
        }
      },
      { 
        key: 'NomeRecebedor', 
        header: 'Recebedor'
      },
      { 
        key: 'Complemento', 
        header: 'Complemento'
      }
    ]
  }, [])

  // Get filter config
  const getFilterConfig = useCallback(() => {
    return {
      categoria: {
        label: 'Categoria',
        accessor: (item) => {
          if (item?.Categoria === 'Income') return 'Receita'
          return 'Despesa'
        }
      },
      operacao: {
        label: 'Operação',
        accessor: (item) => {
          const opMap = {
            1: 'Crédito',
            2: 'Débito',
            3: 'Estorno'
          }
          return opMap[item?.Operação] || 'Outros'
        }
      }
    }
  }, [])

  // Handle go back
  const handleGoBack = () => {
    resetValues()
  }

  // Tutorial steps
  const [tutorialSteps, setTutorialSteps] = useState([
    {
      target: '[data-tour="banco-section"]',
      content: 'Selecione o banco desejado para consultar o extrato.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '[data-tour="calendario-section"]',
      content: 'Selecione o período desejado para consulta.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '[data-tour="pesquisar-section"]',
      content: 'Clique em "Pesquisar" para realizar a consulta do extrato bancário.',
      placement: 'bottom',
    },
  ])

  useEffect(() => {
    if (bankData && bankData.length > 0) {
      const newSteps = [
        {
          target: '[data-tour="banco-section"]',
          content: 'Selecione o banco desejado para consultar o extrato.',
          disableBeacon: true,
          placement: 'bottom',
        },
        {
          target: '[data-tour="calendario-section"]',
          content: 'Selecione o período desejado para consulta.',
          disableBeacon: true,
          placement: 'bottom',
        },
        {
          target: '[data-tour="pesquisar-section"]',
          content: 'Clique em "Pesquisar" para realizar a consulta do extrato bancário.',
          placement: 'bottom',
        },
        {
          target: '[data-tour="totals-section"]',
          content: 'Resumo dos valores totais do extrato.',
          placement: 'bottom',
        },
        {
          target: '[data-tour="tabela-section"]',
          content: 'Extrato bancário com todas as transações do período selecionado.',
          placement: 'bottom',
        },
        {
          target: '[data-tour="botaovoltar-section"]',
          content: 'Retorna ao calendário, possibilitando realizar uma nova consulta.',
          placement: 'bottom',
        },
      ]
      setTutorialSteps(newSteps)
    } else {
      setTutorialSteps([
        {
          target: '[data-tour="banco-section"]',
          content: 'Selecione o banco desejado para consultar o extrato.',
          disableBeacon: true,
          placement: 'bottom',
        },
        {
          target: '[data-tour="calendario-section"]',
          content: 'Selecione o período desejado para consulta.',
          disableBeacon: true,
          placement: 'bottom',
        },
        {
          target: '[data-tour="pesquisar-section"]',
          content: 'Clique em "Pesquisar" para realizar a consulta do extrato bancário.',
          placement: 'bottom',
        },
      ])
    }
  }, [bankData])

  return (
    <div className='page-content-global'>
      <div className='title-container-global'>
        <h1 className='title-global'>Extrato Bancário</h1>
      </div>
      <hr className='hr-global'/>

      <div className='component-container-vendas'>
        {!isDataLoaded ? (
          <>
            {/* Joyride for initial view */}
            {runTutorial && (
              <Joyride
                steps={tutorialSteps}
                run={runTutorial}
                continuous={true}
                scrollToFirstStep={true}
                showProgress={true}
                showSkipButton={true}
                scrollOffset={80}
                disableOverlayClose={true}
                styles={{
                  options: {
                    primaryColor: '#99cc33',
                    textColor: '#0a3d70',
                    zIndex: 10000,
                  },
                }}
                callback={(data) => {
                  if (data.status === 'finished' || data.status === 'skipped') {
                    setRunTutorial(false)
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

            <div className='select-container-open-finance' data-tour="banco-section">
              <div className='select-wrapper'>
                <h5>Banco</h5>
                <Select
                  className='seletor-banco-select fixed-width-select'
                  id='banco'
                  options={bankOptions}
                  getOptionLabel={(option) => `${option.nomeBanco} (${option.codigoBanco})`}
                  getOptionValue={(option) => option.codigoBanco}
                  onChange={handleBankChange}
                  value={getSelectedBankOption()}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  placeholder={loadingBanks ? "Carregando bancos..." : "Selecione um banco..."}
                  isClearable={true}
                  isLoading={loadingBanks}
                  isDisabled={loadingBanks}
                  styles={customSelectStyles}
                  theme={(theme) => ({
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
                  })}
                />
              </div>
            </div>

            <div data-tour="calendario-section">
              <MyCalendar
                onLoadData={loadBankData}
                getCalendarDate={handleDateRangeChange}
                btnDisabled={btnDisabled || loadingBanks}
                customButtonText="Pesquisar"
              />
            </div>

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
          </>
        ) : (
          <>
            <NewDisplayData
              dataArray={bankData}
              adminDataArray={bankDataAdmin}
              totals={bankTotal}
              onGoBack={handleGoBack}
              setRunTutorial={setRunTutorial}
              location={location}
              runTutorial={runTutorial}
              tutorialSteps={tutorialSteps}
              hideTotals={false}
              hideTables={false}
              customTableColumns={getTableColumns()}
              customFilterConfig={getFilterConfig()}
              customExportPage="openfinance"
            />
          </>
        )}
      </div>
    </div>
  )
}

export default OpenFinance