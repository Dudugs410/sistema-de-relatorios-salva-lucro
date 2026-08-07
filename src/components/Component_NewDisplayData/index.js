// NewDisplayData.jsx - Complete fixed version with centralized Joyride and Selects
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

// Safe number formatting utilities
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

// Format date from ISO format (YYYY-MM-DDTHH:MM:SS) to Brazilian format (DD/MM/YYYY)
const formatDateOnly = (isoDate) => {
  if (!isoDate) return 'N/A'
  
  try {
    // Handle ISO format: "2026-05-01T00:00:00"
    if (typeof isoDate === 'string' && isoDate.includes('T')) {
      const datePart = isoDate.split('T')[0] // Gets "2026-05-01"
      const [year, month, day] = datePart.split('-')
      if (year && month && day) {
        return `${day}/${month}/${year}`
      }
    }
    
    // Handle if it's already in YYYY-MM-DD format
    if (typeof isoDate === 'string' && isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = isoDate.split('-')
      return `${day}/${month}/${year}`
    }
    
    // Handle Date object
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

// Format time from ISO format (1900-01-01THH:MM:SS) to just HH:MM:SS
const formatTimeOnly = (isoDateTime) => {
  if (!isoDateTime) return 'N/A'
  
  try {
    // Handle ISO format with T separator: "1900-01-01T09:37:03"
    if (typeof isoDateTime === 'string' && isoDateTime.includes('T')) {
      const timePart = isoDateTime.split('T')[1] // Gets "09:37:03"
      // Remove any milliseconds if present
      return timePart.split('.')[0]
    }
    
    // Handle if it's already just a time string
    if (typeof isoDateTime === 'string' && isoDateTime.match(/^\d{2}:\d{2}:\d{2}/)) {
      return isoDateTime.split('.')[0]
    }
    
    // Handle Date object
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

// Safe date conversion wrapper for backward compatibility
const formatDate = (date) => {
  return formatDateOnly(date)
}

// Custom Select styles to match the existing design
const customSelectStyles = {
  control: (base) => ({
    ...base,
    minWidth: 250,
    width: '100%',
    cursor: 'pointer',
  }),
  menu: (base) => ({
    ...base,
    minWidth: 250,
    width: '100%',
  }),
  valueContainer: (base) => ({
    ...base,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  singleValue: (base) => ({
    ...base,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '90%',
  }),
}

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
  // New props for selects
  listaBandeiras = [],
  listaAdministradoras = [],
  selectedBandeira = null,
  selectedAdquirente = null,
  onBandeiraChange = null,
  onAdquirenteChange = null,
  showSelects = true,
  onSearch = null,
  isSearching = false
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
    exportServices,
    loadBanners,
    loadAdmins
  } = useContext(AuthContext)
  
  const [exportPage, setExportPage] = useState('')
  const [currentPath, setCurrentPath] = useState(location.pathname)
  const [currentFilteredData, setCurrentFilteredData] = useState(dataArray)
  const [hasLoadedTotals, setHasLoadedTotals] = useState(false)
  
  // Local state for selects if not provided as props
  const [localBandeira, setLocalBandeira] = useState(null)
  const [localAdquirente, setLocalAdquirente] = useState(null)
  const [localBandeiras, setLocalBandeiras] = useState(listaBandeiras)
  const [localAdministradoras, setLocalAdministradoras] = useState(listaAdministradoras)
  
  const tabelaGenericaRef = useRef(null)
  
  // Refs to prevent infinite loop
  const isProcessingRef = useRef(false)
  const lastDataArrayRef = useRef(null)
  const lastTotalsCallRef = useRef(null)

  // Load bandeiras and administradoras if not provided
  useEffect(() => {
    const loadSelectData = async () => {
      if (listaBandeiras.length === 0 && loadBanners) {
        const banners = await loadBanners()
        setLocalBandeiras(banners)
      }
      if (listaAdministradoras.length === 0 && loadAdmins) {
        const admins = await loadAdmins()
        setLocalAdministradoras(admins)
      }
    }
    loadSelectData()
  }, [listaBandeiras, listaAdministradoras, loadBanners, loadAdmins])

  // Restore saved values from localStorage
  useEffect(() => {
    if (showSelects && !selectedBandeira && !selectedAdquirente) {
      const savedBan = localStorage.getItem('reportBandeira')
      const savedAdm = localStorage.getItem('reportAdquirente')
      
      if (savedBan && localBandeiras.length > 0) {
        try {
          const parsed = JSON.parse(savedBan)
          const found = localBandeiras.find(b => b.codigoBandeira === parsed.codigoBandeira)
          if (found) setLocalBandeira(found)
        } catch (e) {}
      }
      
      if (savedAdm && localAdministradoras.length > 0) {
        try {
          const parsed = JSON.parse(savedAdm)
          const found = localAdministradoras.find(a => a.codigoAdquirente === parsed.codigoAdquirente)
          if (found) setLocalAdquirente(found)
        } catch (e) {}
      }
    }
  }, [showSelects, localBandeiras, localAdministradoras, selectedBandeira, selectedAdquirente])

  const handleLocalBandeiraChange = (option) => {
    setLocalBandeira(option)
    if (onBandeiraChange) {
      onBandeiraChange(option)
    }
    // Store for report generation
    if (option) {
      localStorage.setItem('reportBandeira', JSON.stringify(option))
    } else {
      localStorage.removeItem('reportBandeira')
    }
  }

  const handleLocalAdquirenteChange = (option) => {
    setLocalAdquirente(option)
    if (onAdquirenteChange) {
      onAdquirenteChange(option)
    }
    // Store for report generation
    if (option) {
      localStorage.setItem('reportAdquirente', JSON.stringify(option))
    } else {
      localStorage.removeItem('reportAdquirente')
    }
  }

  // Determine which values to use (props or local state)
  const currentBandeira = selectedBandeira !== null ? selectedBandeira : localBandeira
  const currentAdquirente = selectedAdquirente !== null ? selectedAdquirente : localAdquirente
  const currentBandeiras = listaBandeiras.length > 0 ? listaBandeiras : localBandeiras
  const currentAdministradoras = listaAdministradoras.length > 0 ? listaAdministradoras : localAdministradoras

  // Safe date conversion wrapper
  const safeDateConvert = useCallback((date) => {
    if (!date) return 'N/A'
    try {
      return formatDateOnly(date)
    } catch (error) {
      console.error('Error converting date:', error)
      return 'N/A'
    }
  }, [])

  // Memoize this to prevent recreation
  const getTableColumns = useCallback((tableType) => {
    // If custom columns provided, use them
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
              // Use VALORLIQUIDO if available, fallback to VALORBRUTO
              const valor = item?.VALORLIQUIDO !== undefined && item?.VALORLIQUIDO !== null 
                ? item.VALORLIQUIDO 
                : item?.VALORBRUTO
              return <span className={Number(valor) >= 0 ? 'green-global' : 'red-global'}>{formatCurrency(valor)}</span>
            }
          },
          { key: 'ADMINISTRADORA', header: 'Adquirente' },
          { key: 'DESCRICAOAJUSTE', header: 'Descrição' }
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
        
        // Use custom export page if provided
        const exportPageType = customExportPage || currentPath
        
        switch(exportPageType) {
          case '/vendas': 
            await exportSales(dataToExport)
            break
          case 'openfinance':
            // Handle openfinance export
            if (exportSales) {
              await exportSales(dataToExport)
            } else {
              // Create a simple CSV download
              const csvContent = "data:text/csv;charset=utf-8," 
                + Object.keys(dataToExport[0] || {}).join(",") + "\n"
                + dataToExport.map(row => Object.values(row).join(",")).join("\n")
              const encodedUri = encodeURI(csvContent)
              const link = document.createElement("a")
              link.setAttribute("href", encodedUri)
              link.setAttribute("download", `extrato_bancario_${new Date().toISOString().split('T')[0]}.csv`)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }
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
  }, [currentPath, exportSales, exportCredits, exportServices, dataArray, hideTables, customExportPage])

  const getTotalUpdateFunction = useCallback(() => {
    // If custom export page, don't update totals through context
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

  // Memoize loadTotals to prevent recreation
  const loadTotals = useCallback((array, tableType) => {
    if(!array || array.length === 0) return
    
    // For openfinance, use custom totals
    if (customExportPage === 'openfinance') {
      // Totals are already calculated in the parent component
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

  // FIXED: handleTotalUpdate - NO STATE UPDATES to prevent loop
  const handleTotalUpdate = useCallback((data) => {
    // Prevent processing if already processing or no data
    if (isProcessingRef.current || !exportPage || !data) return
    
    // Check if this exact data was already processed
    const dataSignature = JSON.stringify(data)
    if (dataSignature === lastTotalsCallRef.current) return
    
    isProcessingRef.current = true
    lastTotalsCallRef.current = dataSignature
    
    // Only call loadTotals, don't update currentFilteredData
    // This prevents the loop because currentFilteredData doesn't change
    loadTotals(data, exportPage)
    
    // Reset processing flag after a short delay
    setTimeout(() => {
      isProcessingRef.current = false
    }, 100)
  }, [exportPage, loadTotals])

  const getFilterConfig = useCallback(() => {
    // If custom filter config provided, use it
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
      default:
        return {}
    }
  }, [exportPage, customFilterConfig])

  // Set export page based on path or custom
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

  // Handle dataArray changes - only update when actually changed
  useEffect(() => {
    if (dataArray && dataArray.length > 0 && !hasLoadedTotals && !hideTotals) {
      const dataSignature = JSON.stringify(dataArray)
      if (dataSignature !== lastDataArrayRef.current) {
        setCurrentFilteredData(dataArray)
        lastDataArrayRef.current = dataSignature
      }
    }
  }, [dataArray, hasLoadedTotals, hideTotals])

  // Separate effect for loading totals - only runs when dataArray changes
  useEffect(() => {
    if (dataArray && dataArray.length > 0 && !hasLoadedTotals && !hideTotals) {
      loadTotals(dataArray, exportPage)
      setHasLoadedTotals(true)
    } else if (dataArray && dataArray.length === 0) {
      setHasLoadedTotals(false)
      lastDataArrayRef.current = null
    }
  }, [dataArray, exportPage, hideTotals, hasLoadedTotals, loadTotals])

  // Memoize table props - stable reference
  const tableProps = useMemo(() => {
    if (hideTables) return null
    if (!exportPage || !dataArray || dataArray.length === 0) return null
    
    // Determine table type for columns
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

  // Handle tutorial end
  const handleTutorialEnd = () => {
    if (setRunTutorial) {
      setRunTutorial(false)
    }
  }

  // Helper function to get selected option value
  const getSelectedAdminOption = () => {
    if (!currentAdquirente || currentAdministradoras.length === 0) return null
    return currentAdministradoras.find(option => option.codigoAdquirente === currentAdquirente)
  }

  const getSelectedBanOption = () => {
    if (!currentBandeira || currentBandeiras.length === 0) return null
    return currentBandeiras.find(option => option.codigoBandeira === currentBandeira)
  }

  return (
    <>
      {/* Centralized Joyride - only render if there are steps */}
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

      {/* Selects section - only show if showSelects is true and no data is loaded yet */}
      {showSelects && (!dataArray || dataArray.length === 0) && (
        <div className='select-container-calendario' data-tour="bandeiraadquirente-section">
          <div className='select-wrapper'>
            <h5>Adquirente</h5>
            <Select 
              className='seletor-adq-select fixed-width-select' 
              id='adquirente'
              options={currentAdministradoras}
              getOptionLabel={(option) => option.nomeAdquirente}
              getOptionValue={(option) => option.codigoAdquirente}
              onChange={(option) => handleLocalAdquirenteChange(option)}
              value={getSelectedAdminOption()}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              placeholder="Selecione uma adquirente..."
              isClearable={true}
              styles={customSelectStyles}
              isDisabled={isSearching || (dataArray && dataArray.length > 0)}
            />
          </div>
          <div className='select-wrapper'>
            <h5>Bandeira</h5>
            <Select 
              className='seletor-adq-select fixed-width-select' 
              id='bandeira'
              options={currentBandeiras}
              getOptionLabel={(option) => option.descricaoBandeira}
              getOptionValue={(option) => option.codigoBandeira}
              onChange={(option) => handleLocalBandeiraChange(option)}
              value={getSelectedBanOption()}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              placeholder="Selecione uma bandeira..."
              isClearable={true}
              styles={customSelectStyles}
              isDisabled={isSearching || (dataArray && dataArray.length > 0)}
            />
          </div>
        </div>
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

      {/* Show custom totals for openfinance */}
      {!hideTotals && totals && customExportPage === 'openfinance' && (
        <div data-tour="totals-section" className="summary-cards">
          <div className="summary-card">
            <span className="summary-label">Total de Transações</span>
            <span className="summary-value">{totals?.count || 0}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Total Receitas</span>
            <span className="summary-value text-success">
              {(totals?.income || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Total Despesas</span>
            <span className="summary-value text-danger">
              {(totals?.expense || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Saldo</span>
            <span className={`summary-value ${(totals?.total || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
              {(totals?.total || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </span>
          </div>
        </div>
      )}
      
      {/* Only show GerarRelatorio if there is data */}
      {dataArray && dataArray.length > 0 && (
        <div data-tour="exportacao-section">
          <GerarRelatorio 
            className='export' 
            onExport={getExportFunction()}
            filteredData={currentFilteredData}
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
          <div data-tour={customExportPage === 'openfinance' ? "tabela-section" : "tabelavendas-section"}>
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