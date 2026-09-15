import { useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import Select from 'react-select'
import NewTabelaGenerica from '../../components/NewTabelaGenerica'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'
import GerarRelatorio from "../../components/Componente_GerarRelatorio"
import Joyride from 'react-joyride'
import '../../index.scss'
import './displayData.scss'
import { AuthContext } from '../../contexts/auth'

const safeToFixed = (value, decimals = 2) => {
  if (value === undefined || value === null || value === '') {
    return (0).toFixed(decimals)
  }
  let numValue = typeof value === 'string' ? parseFloat(value) : Number(value)
  if (isNaN(numValue)) {
    return (0).toFixed(decimals)
  }
  return numValue.toFixed(decimals)
}

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
    if (isoDate instanceof Date && !isNaN(isoDate.getTime())) {
      const day = String(isoDate.getDate()).padStart(2, '0')
      const month = String(isoDate.getMonth() + 1).padStart(2, '0')
      const year = isoDate.getFullYear()
      return `${day}/${month}/${year}`
    }
    return isoDate || 'N/A'
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'N/A'
  }
}

const formatTimeOnly = (isoDateTime) => {
  if (!isoDateTime) return 'N/A'
  try {
    if (typeof isoDateTime === 'string' && isoDateTime.includes('T')) {
      const timePart = isoDateTime.split('T')[1]
      return timePart.split('.')[0]
    }
    if (typeof isoDateTime === 'string' && isoDateTime.match(/^\d{2}:\d{2}:\d{2}/)) {
      return isoDateTime.split('.')[0]
    }
    if (isoDateTime instanceof Date && !isNaN(isoDateTime.getTime())) {
      const hours = String(isoDateTime.getHours()).padStart(2, '0')
      const minutes = String(isoDateTime.getMinutes()).padStart(2, '0')
      const seconds = String(isoDateTime.getSeconds()).padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    }
    return 'N/A'
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'N/A'
  }
}

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

const formatDate = (date) => {
  return formatDateOnly(date)
}

const tipoRelatorioOptions = [
  { value: 'detalhado', label: 'Detalhado' },
  { value: 'resumido', label: 'Resumido' },
]

const tipoRelatorioSelectStyles = {
  control: (base, { isFocused }) => ({
    ...base,
    minWidth: 200,
    width: '100%',
    backgroundColor: 'var(--background-color)',
    borderColor: isFocused ? 'var(--secondary-color)' : 'var(--bs-border-color)',
    color: 'var(--font-color)',
    '&:hover': { borderColor: 'var(--secondary-color)' },
    boxShadow: isFocused ? '0 0 0 1px var(--secondary-color)' : 'none',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--background-color)',
    borderColor: 'var(--bs-border-color)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 99999,
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: 'var(--background-color)',
    padding: '4px 0',
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

const tipoRelatorioTheme = (theme) => ({
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

const NewDisplayData = ({ 
  dataArray, 
  adminDataArray, 
  totals, 
  onGoBack, 
  setRunTutorial,
  location,
  hideTables = false,
  hideTotals = false,
  runTutorial = false,
  tutorialSteps = [],
  customTableColumns = null,
  customFilterConfig = null,
  customExportPage = null,
  tipoRelatorio = null,
  onTipoRelatorioChange = null,
}) => {
  const { 
    clientUserId, 
    dateConvert,
    salesDateRange,
    creditsDateRange, 
    servicesDateRange,
    setSalesTotal,
    setCreditsTotal,
    exportSales,
    exportCredits,
    exportServices
  } = useContext(AuthContext)

  const [exportPage, setExportPage] = useState('')
  const [currentPath, setCurrentPath] = useState(location.pathname)
  const [currentFilteredData, setCurrentFilteredData] = useState(dataArray)
  const [hasLoadedTotals, setHasLoadedTotals] = useState(false)

  const tabelaGenericaRef = useRef(null)

  const isProcessingRef = useRef(false)
  const lastDataArrayRef = useRef(null)
  const lastTotalsCallRef = useRef(null)

  const isOpenFinance = customExportPage === 'openfinance'

  const safeDateConvert = useCallback((date) => {
    if (!date) return 'N/A'
    try {
      return formatDateOnly(date)
    } catch (error) {
      console.error('Error converting date:', error)
      return 'N/A'
    }
  }, [])

  const getTableColumns = useCallback((tableType) => {
    if (customTableColumns) {
      return customTableColumns
    }

    switch(tableType) {
      case 'vendas':
        return [
          { key: 'CNPJ', header: 'CNPJ' },
          { key: 'RAZAOSOCIAL', header: 'Razão Social' },
          { key: 'ADMINISTRADORA', header: 'Adquirente' },
          { key: 'BANDEIRA', header: 'Bandeira' },
          { key: 'PRODUTO', header: 'Produto', render: (item) => (item?.PRODUTO || "").trim() },
          { key: 'MODALIDADE', header: 'Subproduto' },
          { 
            key: 'VALORBRUTO', 
            header: 'Valor Bruto',
            render: (item) => <span className={Number(item?.VALORBRUTO) >= 0 ? 'green-global' : 'red-global'}>{formatCurrency(item?.VALORBRUTO)}</span>
          },
          { 
            key: 'VALORLIQUIDO', 
            header: 'Valor Líquido',
            render: (item) => <span className={Number(item?.VALORLIQUIDO) >= 0 ? 'green-global' : 'red-global'}>{formatCurrency(item?.VALORLIQUIDO)}</span>
          },
          { 
            key: 'TAXA', 
            header: 'Taxa',
            render: (item) => <span className='red-global'>{safeToFixed(item?.TAXA, 2)}%</span>
          },
          { 
            key: 'DESCONTO', 
            header: 'Desconto',
            render: (item) => <span className='red-global'>{formatCurrency(Math.abs(Number(item?.DESCONTO) || 0))}</span>
          },
          { key: 'NSU', header: 'NSU' },
          { key: 'CARTAO', header: 'Cartão'},
          { 
            key: 'DATAVENDA', 
            header: 'Data da Venda',
            accessor: (item) => formatDateOnly(item?.DATAVENDA)
          },
          { 
            key: 'HORAVENDA', 
            header: 'Hora da Venda',
            accessor: (item) => formatTimeOnly(item?.HORAVENDA)
          },
          { 
            key: 'DATACREDITO', 
            header: 'Data do Crédito',
            accessor: (item) => formatDateOnly(item?.DATACREDITO)
          },
          { key: 'AUTORIZACAO', header: 'Autorização' },
          { key: 'PARCELA', header: 'QTD Parcelas' },
          { key: 'NUMEROPV', header: 'Número PV' },
          { key: 'RO', header: 'RO' }
        ]

      case 'creditos':
        return [
          { key: 'CNPJ', header: 'CNPJ' },
          { key: 'RAZAOSOCIAL', header: 'Razão Social' },
          { key: 'ADMINISTRADORA', header: 'Adquirente' },
          { key: 'BANDEIRA', header: 'Bandeira' },
          { key: 'PRODUTO', header: 'Produto', render: (item) => (item?.PRODUTO || "").trim() },
          { key: 'MODALIDADE', header: 'Subproduto' },
          { 
            key: 'VALORBRUTO', 
            header: 'Valor Bruto',
            render: (item) => <span className={Number(item?.VALORBRUTO) >= 0 ? 'green-global' : 'red-global'}>{formatCurrency(item?.VALORBRUTO)}</span>
          },
          { 
            key: 'VALORLIQUIDO', 
            header: 'Valor Líquido',
            render: (item) => <span className={Number(item?.VALORLIQUIDO) >= 0 ? 'green-global' : 'red-global'}>{formatCurrency(item?.VALORLIQUIDO)}</span>
          },
          { 
            key: 'TAXA', 
            header: 'Taxa',
            render: (item) => <span className='red-global'>{safeToFixed(item?.TAXA, 2)}%</span>
          },
          { 
            key: 'DESCONTO', 
            header: 'Desconto',
            render: (item) => <span className='red-global'>{formatCurrency(Math.abs(Number(item?.DESCONTO) || 0))}</span>
          },
          { key: 'CARTAO', header: 'Cartão'},
          { key: 'NSU', header: 'NSU' },
          { 
            key: 'DATAVENDA', 
            header: 'Data da Venda',
            accessor: (item) => formatDateOnly(item?.DATAVENDA)
          },
          { 
            key: 'DATACREDITO', 
            header: 'Data do Crédito',
            accessor: (item) => formatDateOnly(item?.DATACREDITO)
          },
          { key: 'AUTORIZACAO', header: 'Autorização' },
          { key: 'PARCELA', header: 'Parcela' },
          { key: 'TOTALPARCELA', header: 'QTD Parcelas' },
          { key: 'NUMEROPV', header: 'Número PV' },
          { key: 'RO', header: 'RO' },
          { key: 'BANCO', header: 'Banco' },
          { key: 'AGENCIA', header: 'Agência' },
          { key: 'CONTA', header: 'Conta' }
        ]

      case 'servicos':
      case 'ajustes':
        return [
          { key: 'CNPJ', header: 'CNPJ' },
          { key: 'RAZAOSOCIAL', header: 'Razão Social' },
          { 
            key: 'VALOR', 
            header: 'Valor',
            render: (item) => {
              const valor = item?.VALORLIQUIDO !== undefined && item?.VALORLIQUIDO !== null 
                ? item.VALORLIQUIDO 
                : item?.VALORBRUTO
              return <span className={Number(valor) >= 0 ? 'green-global' : 'red-global'}>{formatCurrency(valor)}</span>
            }
          },
          { key: 'ADMINISTRADORA', header: 'Adquirente' },
          { key: 'DESCRICAOAJUSTE', header: 'Descrição' }
        ]

      case 'openfinance':
        return [
          { 
            key: 'Data', 
            header: 'Data',
            accessor: (item) => {
              if (!item?.Data) return 'N/A'
              try {
                return formatDateOnly(item.Data)
              } catch {
                return 'N/A'
              }
            }
          },
          { 
            key: 'Descrição', 
            header: 'Descrição',
            accessor: (item) => item?.Descrição || 'N/A'
          },
          { 
            key: 'Valor', 
            header: 'Valor',
            render: (item) => {
              const valor = Number(item?.Valor) || 0
              return (
                <span className={valor >= 0 ? 'green-global' : 'red-global'}>
                  {formatCurrency(valor)}
                </span>
              )
            }
          },
          { 
            key: 'Categoria', 
            header: 'Categoria',
            accessor: (item) => item?.Categoria || 'N/A'
          },
          { 
            key: 'Operação', 
            header: 'Operação',
            render: (item) => {
              if (item?.Operação === 1) return 'Crédito'
              if (item?.Operação === -1) return 'Débito'
              return 'Outros'
            }
          },
          { 
            key: 'CnpjPagador', 
            header: 'CNPJ Pagador',
            render: (item) => {
              const cnpj = item?.CnpjPagador || ''
              if (!cnpj) return 'N/A'
              return formatCNPJ(cnpj)
            }
          },
          { 
            key: 'NomePagador', 
            header: 'Pagador',
            accessor: (item) => item?.NomePagador || 'N/A'
          },
          { 
            key: 'CnpjRecebedor', 
            header: 'CNPJ Recebedor',
            render: (item) => {
              const cnpj = item?.CnpjRecebedor || ''
              if (!cnpj) return 'N/A'
              return formatCNPJ(cnpj)
            }
          },
          { 
            key: 'NomeRecebedor', 
            header: 'Recebedor',
            accessor: (item) => item?.NomeRecebedor || 'N/A'
          },
          { 
            key: 'Complemento', 
            header: 'Complemento',
            accessor: (item) => item?.Complemento || 'N/A'
          }
        ]

      default:
        return []
    }
  }, [safeDateConvert, customTableColumns])

  const getDateRange = useCallback(() => {
    switch(currentPath) {
      case '/vendas': return salesDateRange
      case '/creditos': return creditsDateRange
      case '/creditos-data-banco': return creditsDateRange
      case '/servicos': return servicesDateRange
      default: return []
    }
  }, [currentPath, salesDateRange, creditsDateRange, servicesDateRange])

  const getExportFunction = useCallback(() => {
    const exportData = async () => {
      if (isOpenFinance) {
        console.log('Export not available for OpenFinance')
        return
      }

      if (!tabelaGenericaRef.current && !hideTables) {
        console.warn('Table reference not available')
        return
      }

      try {
        let dataToExport = dataArray

        if (!hideTables && tabelaGenericaRef.current) {
          const currentFilteredDataFromTable = tabelaGenericaRef.current.getFilteredData()
          dataToExport = currentFilteredDataFromTable && currentFilteredDataFromTable.length > 0 ? currentFilteredDataFromTable : dataArray
        }

        const exportPageType = customExportPage || currentPath

        switch(exportPageType) {
          case '/vendas':
            await exportSales(
              dataToExport,
              tipoRelatorio?.value === 'resumido' ? 'RESUMO' : 'VENDA'
            )
            break
          case 'openfinance':
            console.log('OpenFinance export not implemented')
            break
          case '/creditos':
            await exportCredits(dataToExport)
            break
          case '/creditos-data-banco':
            await exportCredits(dataToExport)
            break
          case '/servicos':
            await exportServices(dataToExport)
            break
          default:
            console.warn('No export function for current path:', currentPath)
        }
      } catch (error) {
        console.error('Error during export:', error)
      }
    }

    return exportData
  }, [
    currentPath,
    exportSales,
    exportCredits,
    exportServices,
    dataArray,
    hideTables,
    customExportPage,
    isOpenFinance,
    tipoRelatorio
  ])

  const getTotalUpdateFunction = useCallback(() => {
    if (customExportPage) {
      return null
    }

    switch(currentPath) {
      case '/vendas': return setSalesTotal
      case '/creditos': return setCreditsTotal
      case '/creditos-data-banco': return setCreditsTotal
      default: return null
    }
  }, [currentPath, setSalesTotal, setCreditsTotal, customExportPage])

  const loadTotals = useCallback((array, tableType) => {
    if(!array || array.length === 0) return

    if (customExportPage === 'openfinance') {
      return
    }

    if (tableType === 'vendas') {
      let totalCreditoTemp = 0
      let totalDebitoTemp = 0
      let totalVoucherTemp = 0
      let totalTemp = 0

      array.forEach((venda) => {
        if (!venda) return
        const produto = (venda.PRODUTO || "").trim()
        const valor = Number(venda.VALORBRUTO) || 0

        totalTemp += valor

        if (produto === 'Crédito') {
          totalCreditoTemp += valor
        } else if (produto === 'Débito') {
          totalDebitoTemp += valor
        } else {
          totalVoucherTemp += valor
        }
      })

      const totalResult = { 
        debit: totalDebitoTemp, 
        credit: totalCreditoTemp, 
        voucher: totalVoucherTemp, 
        total: totalTemp 
      }

      const updateFunction = getTotalUpdateFunction()
      if (updateFunction) {
        updateFunction(totalResult)
      }
    } else if (tableType === 'creditos') {
      let totalCredito = 0
      let totalDebito = 0
      let totalVoucher = 0
      let totalGeral = 0

      array.forEach((credito) => {
        if (!credito) return
        const valor = Number(credito.VALORLIQUIDO) || 0
        const produto = (credito.PRODUTO || "").trim()

        totalGeral += valor

        if (produto === 'Crédito') {
          totalCredito += valor
        } else if (produto === 'Débito') {
          totalDebito += valor
        } else if (produto === 'Voucher') {
          totalVoucher += valor
        }
      })

      const totalResult = {
        debit: totalDebito,
        credit: totalCredito,
        voucher: totalVoucher,
        total: totalGeral
      }

      const updateFunction = getTotalUpdateFunction()
      if (updateFunction) {
        updateFunction(totalResult)
      }
    } else if (tableType === 'servicos' || tableType === 'ajustes') {
      let totalBruto = 0
      let totalLiquido = 0

      array.forEach((item) => {
        if (!item) return
        const valorBruto = Number(item.VALORBRUTO) || 0
        const valorLiquido = Number(item.VALORLIQUIDO) || 0
        totalBruto += Math.abs(valorBruto)
        totalLiquido += Math.abs(valorLiquido)
      })

      const totalResult = {
        totalBruto: totalBruto,
        totalLiquido: totalLiquido,
        total: totalLiquido
      }

    }
  }, [getTotalUpdateFunction, customExportPage])

  const handleTotalUpdate = useCallback((data) => {
    if (isProcessingRef.current || !exportPage || !data) return

    const dataSignature = JSON.stringify(data)
    if (dataSignature === lastTotalsCallRef.current) return

    isProcessingRef.current = true
    lastTotalsCallRef.current = dataSignature

    loadTotals(data, exportPage)

    setTimeout(() => {
      isProcessingRef.current = false
    }, 100)
  }, [exportPage, loadTotals])

  const getFilterConfig = useCallback(() => {
    if (customFilterConfig) {
      return customFilterConfig
    }

    if (!exportPage) return {}

    switch(exportPage) {
      case 'vendas':
        return {
          adquirente: {
            label: 'Adquirente',
            accessor: (item) => item?.ADMINISTRADORA || '',
            dependentKey: 'bandeira'
          },
          bandeira: {
            label: 'Bandeira', 
            accessor: (item) => item?.BANDEIRA || '',
            dependentKey: 'adquirente'
          }
        }
      case 'creditos':
        return {
          adquirente: {
            label: 'Adquirente',
            accessor: (item) => item?.ADMINISTRADORA || '',
            dependentKey: 'bandeira'
          },
          bandeira: {
            label: 'Bandeira', 
            accessor: (item) => item?.BANDEIRA || '',
            dependentKey: 'adquirente'
          }
        }
      case 'servicos':
      case 'ajustes':
        return {
          adquirente: {
            label: 'Adquirente',
            accessor: (item) => item?.ADMINISTRADORA || '',
            dependentKey: 'descricao'
          },
          descricao: {
            label: 'Descrição',
            accessor: (item) => item?.DESCRICAOAJUSTE || '',
            dependentKey: 'adquirente'
          }
        }
      case 'openfinance':
        return {
          categoria: {
            label: 'Categoria',
            accessor: (item) => item?.Categoria || 'N/A'
          },
          operacao: {
            label: 'Operação',
            accessor: (item) => {
              if (item?.Operação === 1) return 'Crédito'
              if (item?.Operação === -1) return 'Débito'
              return 'Outros'
            }
          }
        }
      default:
        return {}
    }
  }, [exportPage, customFilterConfig])

  useEffect(() => {
    if (customExportPage) {
      setExportPage(customExportPage)
      return
    }

    const path = location.pathname
    setCurrentPath(path)
    localStorage.setItem('currentPath', path)

    if (path === '/vendas') {
      setExportPage('vendas')
    } else if (path === '/creditos') {
      setExportPage('creditos')
    } else if (path === '/creditos-data-banco') {
      setExportPage('creditos')
    } else if (path === '/servicos') {
      setExportPage('ajustes')
    } else {
      setExportPage('')
    }
  }, [location.pathname, customExportPage])

  useEffect(() => {
    if (dataArray && dataArray.length > 0 && !hasLoadedTotals && !hideTotals) {
      const dataSignature = JSON.stringify(dataArray)
      if (dataSignature !== lastDataArrayRef.current) {
        setCurrentFilteredData(dataArray)
        lastDataArrayRef.current = dataSignature
      }
    }
  }, [dataArray, hasLoadedTotals, hideTotals])

  useEffect(() => {
    if (dataArray && dataArray.length > 0 && !hasLoadedTotals && !hideTotals) {
      loadTotals(dataArray, exportPage)
      setHasLoadedTotals(true)
    } else if (dataArray && dataArray.length === 0) {
      setHasLoadedTotals(false)
      lastDataArrayRef.current = null
    }
  }, [dataArray, exportPage, hideTotals, hasLoadedTotals, loadTotals])

  const tableProps = useMemo(() => {
    if (hideTables) return null
    if (!exportPage || !dataArray || dataArray.length === 0) return null

    let tableType = exportPage
    if (exportPage === 'ajustes') {
      tableType = 'servicos'
    } else if (exportPage === 'openfinance') {
      tableType = 'openfinance'
    }

    return {
      ref: tabelaGenericaRef,
      array: dataArray,
      tableType: tableType,
      columns: getTableColumns(tableType),
      dateRange: getDateRange(),
      onExport: getExportFunction(),
      onTotalUpdate: handleTotalUpdate,
      enableResponsive: true,
      showFilters: true,
      textColor: "green-global",
      filterConfig: getFilterConfig(),
      enableDependentFilters: true
    }
  }, [exportPage, dataArray, getTableColumns, getDateRange, getExportFunction, handleTotalUpdate, getFilterConfig, hideTables])

  const getButtonText = () => {
    if (customExportPage === 'openfinance') {
      return 'Nova Consulta de Extrato'
    }

    switch(currentPath) {
      case '/vendas':
        return 'Nova Consulta de Vendas'
      case '/creditos':
        return 'Nova Consulta de Créditos'
      case '/creditos-data-banco':
        return 'Nova Consulta de Créditos por Data e Banco'
      case '/servicos':
        return 'Nova Consulta de Serviços/Ajustes'
      default:
        return 'Nova Pesquisa'
    }
  }

  const handleTutorialEnd = () => {
    if (setRunTutorial) {
      setRunTutorial(false)
    }
  }

  return (
    <>
      {runTutorial && tutorialSteps && tutorialSteps.length > 0 && (
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

      {!hideTotals && totals && (exportPage === 'vendas' || exportPage === 'creditos') && (
        <div data-tour="modalidade-section">
          <TotalModalidadesComp 
            totals={{
              debit: totals?.debit ?? 0,
              credit: totals?.credit ?? 0,
              voucher: totals?.voucher ?? 0,
              total: totals?.total ?? totals?.totalLiquido ?? 0
            }} 
            type={exportPage} 
          />
        </div>
      )}

      {!hideTotals && totals && isOpenFinance && (
        <div data-tour="totals-section" className="content-container-modalidade">
          <div className="total-container-modalidade">
            <div className='text-container-modalidade'>
              <span className="summary-label">Total de Transações</span>
              <span className="summary-value">{totals?.count || 0}</span>              
            </div>
          </div>
          <div className="total-container-modalidade">
            <div className='text-container-modalidade'>
              <span className="summary-label">Total Receitas</span>
              <span className="summary-value text-success">
                {formatCurrency(totals?.income || 0)}
              </span>
            </div>
          </div>
          <div className="total-container-modalidade">
            <div className='text-container-modalidade'>
              <span className="summary-label">Total Despesas</span>
            <span className="summary-value text-danger">
              {formatCurrency(totals?.expense || 0)}
            </span>
            </div>
          </div>
          <div className="total-container-modalidade">
            <div className='text-container-modalidade'>
              <span className="summary-label">Saldo</span>
              <span className={`summary-value ${(totals?.total || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(totals?.total || 0)}
            </span>
            </div>
          </div>
        </div>
      )}

      <hr className='hr-global' />

      {!isOpenFinance && (
        <div data-tour="exportacao-section" className="export-area">
          {exportPage === 'vendas' && tipoRelatorio && onTipoRelatorioChange && (
            <div className="tipo-relatorio-wrapper" data-tour="tipo-relatorio-section">
              <label className="tipo-relatorio-label">Tipo de Relatório</label>
              <Select
                className="tipo-relatorio-select"
                options={tipoRelatorioOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onChange={(option) => onTipoRelatorioChange(option)}
                value={tipoRelatorio}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                isClearable={false}
                isSearchable={false}
                styles={tipoRelatorioSelectStyles}
                theme={tipoRelatorioTheme}
              />
            </div>
          )}

          <GerarRelatorio 
            className='export' 
            onExport={getExportFunction()}
            filteredData={currentFilteredData}
            tipoRelatorio={tipoRelatorio}
          />
          <hr className='hr-global'/>
        </div>
      )}

      {!hideTables && (
        <div className='component-container-vendas'>
          {adminDataArray && adminDataArray.length > 0 && (exportPage === 'vendas' || exportPage === 'creditos') && (
            <div data-tour="totaladq-section">
              <TabelaGenericaAdm Array={adminDataArray} />
            </div>
          )}
          <div data-tour={isOpenFinance ? "tabela-section" : "tabelavendas-section"}>
            {tableProps && (
              <NewTabelaGenerica {...tableProps} />
            )}
          </div>
          <hr className='hr-global' />
        </div>
      )}

      <div className='floating-button-container'>
        <button 
          data-tour="botaovoltar-section"
          className='btn-floating-new-search' 
          onClick={onGoBack}
        >
          <span className='floating-button-icon'>🔍</span>
          <span className='floating-button-text'>{getButtonText()}</span>
        </button>
      </div>
    </>
  )
}

export default NewDisplayData