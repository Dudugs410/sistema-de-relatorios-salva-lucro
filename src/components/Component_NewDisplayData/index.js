// NewDisplayData.jsx - Fixed infinite loop
import { useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import NewTabelaGenerica from '../../components/NewTabelaGenerica'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'
import GerarRelatorio from "../../components/Componente_GerarRelatorio"
import '../../index.scss'
import './displayData.scss'
import { AuthContext } from '../../contexts/auth'

const NewDisplayData = ({ dataArray, adminDataArray, totals, onGoBack, setRunTutorial, location }) => {
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

  // Memoize this to prevent recreation
  const getTableColumns = useCallback((tableType) => {
    switch(tableType) {
      case 'vendas':
        return [
          { key: 'CNPJ', header: 'CNPJ' },
          { key: 'ADMINISTRADORA', header: 'Adquirente' },
          { key: 'BANDEIRA', header: 'Bandeira' },
          { key: 'PRODUTO', header: 'Produto', render: (item) => (item.PRODUTO || "").trim() },
          { key: 'MODALIDADE', header: 'Subproduto' },
          { 
            key: 'VALORBRUTO', 
            header: 'Valor Bruto',
            render: (item) => <span className='green-global'>{Number(item.VALORBRUTO).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
          },
          { 
            key: 'VALORLIQUIDO', 
            header: 'Valor Líquido',
            render: (item) => <span className='green-global'>{Number(item.VALORLIQUIDO).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
          },
          { 
            key: 'TAXA', 
            header: 'Taxa',
            render: (item) => <span className='red-global'>{Number(item.TAXA).toFixed(2)}%</span>
          },
          { 
            key: 'DESCONTO', 
            header: 'Desconto (%)',
            render: (item) => <span className='red-global'>{Number(item.DESCONTO).toFixed(2)}%</span>
          },
          { key: 'NSU', header: 'NSU' },
          { key: 'CARTAO', header: 'Cartão'},
          { 
            key: 'DATAVENDA', 
            header: 'Data da Venda',
            accessor: (item) => dateConvert(item.DATAVENDA)
          },
          { 
            key: 'HORAVENDA', 
            header: 'Hora da Venda',
            accessor: (item) => item.HORAVENDA || 'N/A'
          },
          { 
            key: 'DATACREDITO', 
            header: 'Data do Crédito',
            accessor: (item) => dateConvert(item.DATACREDITO)
          },
          { key: 'AUTORIZACAO', header: 'Autorização' },
          { key: 'PARCELA', header: 'QTD Parcelas' },
          { key: 'STATUS', header: 'Status' },
          { key: 'NUMEROPV', header: 'Número PV' },
          { key: 'RO', header: 'RO' }
        ]
      
      // In NewDisplayData.jsx - Update the creditos case in getTableColumns
      case 'creditos':
        return [
          { key: 'CNPJ', header: 'CNPJ' },
          { key: 'ADMINISTRADORA', header: 'Adquirente' },
          { key: 'BANDEIRA', header: 'Bandeira' },
          { key: 'PRODUTO', header: 'Produto', render: (item) => (item.PRODUTO || "").trim() },
          { key: 'MODALIDADE', header: 'Subproduto' },
          { 
            key: 'VALORBRUTO', 
            header: 'Valor Bruto',
            render: (item) => <span className='green-global'>{Number(item.VALORBRUTO).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
          },
          { 
            key: 'VALORLIQUIDO', 
            header: 'Valor Líquido',
            render: (item) => <span className='green-global'>{Number(item.VALORLIQUIDO).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
          },
          { 
            key: 'TAXA', 
            header: 'Taxa',
            render: (item) => <span className='red-global'>{Number(item.TAXA).toFixed(2)}%</span>
          },
          { 
            key: 'DESCONTO', 
            header: 'Desconto (%)',
            render: (item) => <span className='red-global'>{Number(item.DESCONTO).toFixed(2)}%</span>
          },
          { key: 'CARTAO', header: 'Cartão'},
          { key: 'NSU', header: 'NSU' },
          { 
            key: 'DATAVENDA', 
            header: 'Data da Venda',
            accessor: (item) => dateConvert(item.DATAVENDA)
          },
          { 
            key: 'HORAVENDA', 
            header: 'Hora da Venda',
            accessor: (item) => item.HORAVENDA || 'N/A'
          },
          { 
            key: 'DATACREDITO', 
            header: 'Data do Crédito',
            accessor: (item) => dateConvert(item.DATACREDITO)
          },
          { key: 'AUTORIZACAO', header: 'Autorização' },
          { key: 'PARCELA', header: 'Parcela' },
          { key: 'TOTALPARCELA', header: 'QTD Parcelas' },
          { key: 'STATUS', header: 'Status' },
          { key: 'NUMEROPV', header: 'Número PV' },
          { key: 'RO', header: 'RO' },
          { key: 'BANCO', header: 'Banco' },
          { key: 'AGENCIA', header: 'Agência' },
          { key: 'CONTA', header: 'Conta' },
          { key: 'RAZAOSOCIAL', header: 'Razão Social' }
        ]
      
      case 'servicos':
        return [
          { key: 'cnpj', header: 'CNPJ' },
          { key: 'razao_social', header: 'Razão Social' },
          { key: 'codigo_estabelecimento', header: 'Código Estabelecimento' },
          { key: 'nome_adquirente', header: 'Adquirente' },
          { 
            key: 'valor', 
            header: 'Valor',
            render: (item) => <span className='red-global'>{Math.abs(Number(item.valor)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
          },
          { 
            key: 'data', 
            header: 'Data',
            accessor: (item) => dateConvert(item.data)
          },
          { key: 'descricao', header: 'Descrição' }
        ]
      
      default:
        return []
    }
  }, [dateConvert])

  const getDateRange = useCallback(() => {
    switch(currentPath) {
      case '/vendas': return salesDateRange
      case '/creditos': return creditsDateRange
      case '/servicos': return servicesDateRange
      default: return []
    }
  }, [currentPath, salesDateRange, creditsDateRange, servicesDateRange])

  const getExportFunction = useCallback(() => {
    const exportData = async () => {
      if (!tabelaGenericaRef.current) {
        console.warn('Table reference not available')
        return
      }

      try {
        const currentFilteredData = tabelaGenericaRef.current.getFilteredData()
        const dataToExport = currentFilteredData && currentFilteredData.length > 0 ? currentFilteredData : dataArray
        
        console.log(`Exporting ${dataToExport.length} records for ${currentPath}`)
        
        switch(currentPath) {
          case '/vendas': 
            await exportSales(dataToExport)
            break
          case '/creditos':
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
  }, [currentPath, exportSales, exportCredits, exportServices, dataArray])

  const getTotalUpdateFunction = useCallback(() => {
    switch(currentPath) {
      case '/vendas': return setSalesTotal
      case '/creditos': return setCreditsTotal
      default: return null
    }
  }, [currentPath, setSalesTotal, setCreditsTotal])

  // Memoize loadTotals to prevent recreation
  const loadTotals = useCallback((array, tableType) => {
    if(!array || array.length === 0) return
    
    if (tableType === 'vendas') {
      let totalCreditoTemp = 0
      let totalDebitoTemp = 0
      let totalVoucherTemp = 0
      let totalTemp = 0

      array.forEach((venda) => {
        const produto = (venda.PRODUTO || "").trim()
        const valor = venda.VALORBRUTO || 0
        
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
      let totalBruto = 0
      let totalLiquido = 0
      let totalDesconto = 0
      
      array.forEach((credito) => {
        totalBruto += Number(credito.VALORBRUTO) || 0
        totalLiquido += Number(credito.VALORLIQUIDO) || 0
        totalDesconto += Number(credito.DESCONTO) || 0
      })
      
      const totalResult = {
        totalBruto: totalBruto,
        totalLiquido: totalLiquido,
        totalDesconto: totalDesconto,
        total: totalLiquido
      }
      
      const updateFunction = getTotalUpdateFunction()
      if (updateFunction) {
        updateFunction(totalResult)
      }
    } else if (tableType === 'servicos') {
      let total = 0
      
      array.forEach((servico) => {
        total += Math.abs(Number(servico.valor)) || 0
      })
      
      const totalResult = {
        total: total
      }
      
      // For services, we might not have a setter, just use it for display
      console.log('Services total:', totalResult)
    }
  }, [getTotalUpdateFunction])

  const handleTotalUpdate = useCallback((data) => {
    if (exportPage && data) {
      setCurrentFilteredData(data)
      loadTotals(data, exportPage)
    }
  }, [exportPage, loadTotals])

  const getFilterConfig = useCallback(() => {
    if (!exportPage) return {}
    
    switch(exportPage) {
      case 'vendas':
        return {
          adquirente: {
            label: 'Adquirente',
            accessor: (item) => item.ADMINISTRADORA || '',
            dependentKey: 'bandeira'
          },
          bandeira: {
            label: 'Bandeira', 
            accessor: (item) => item.BANDEIRA || '',
            dependentKey: 'adquirente'
          }
        }
      case 'creditos':
        return {
          adquirente: {
            label: 'Adquirente',
            accessor: (item) => item.ADMINISTRADORA || '',
            dependentKey: 'bandeira'
          },
          bandeira: {
            label: 'Bandeira', 
            accessor: (item) => item.BANDEIRA || '',
            dependentKey: 'adquirente'
          }
        }
      case 'servicos':
        return {
          adquirente: {
            label: 'Adquirente',
            accessor: (item) => item.nome_adquirente || '',
            dependentKey: 'servico'
          },
          servico: {
            label: 'Serviço',
            accessor: (item) => item.descricao || '',
            dependentKey: 'adquirente'
          }
        }
      default:
        return {}
    }
  }, [exportPage])

  // Set export page based on path - runs only once
  useEffect(() => {
    const path = location.pathname
    setCurrentPath(path)
    localStorage.setItem('currentPath', path)

    if (path === '/vendas') {
      setExportPage('vendas')
    } else if (path === '/creditos') {
      setExportPage('creditos')
    } else if (path === '/servicos') {
      setExportPage('servicos')
    } else {
      setExportPage('')
    }
  }, [location.pathname])

  // Handle dataArray changes
  useEffect(() => {
    if (dataArray && dataArray.length > 0 && !hasLoadedTotals) {
      console.log('NewDisplayData received dataArray:', dataArray.length, 'records')
      setCurrentFilteredData(dataArray)
      loadTotals(dataArray, exportPage)
      setHasLoadedTotals(true)
    } else if (dataArray && dataArray.length === 0) {
      setHasLoadedTotals(false)
    }
  }, [dataArray, loadTotals, hasLoadedTotals, exportPage])

  // Reset hasLoadedTotals when dataArray becomes empty
  useEffect(() => {
    if (!dataArray || dataArray.length === 0) {
      setHasLoadedTotals(false)
    }
  }, [dataArray])

  // Memoize table props
  const tableProps = useMemo(() => {
    if (!exportPage || !dataArray || dataArray.length === 0) return null
    
    return {
      ref: tabelaGenericaRef,
      array: dataArray,
      tableType: exportPage,
      columns: getTableColumns(exportPage),
      dateRange: getDateRange(),
      onExport: getExportFunction(),
      onTotalUpdate: handleTotalUpdate,
      enableResponsive: true,
      showFilters: true,
      textColor: "green-global",
      filterConfig: getFilterConfig(),
      enableDependentFilters: true
    }
  }, [exportPage, dataArray, getTableColumns, getDateRange, getExportFunction, handleTotalUpdate, getFilterConfig])

  const getButtonText = () => {
    switch(currentPath) {
      case '/vendas':
        return 'Nova Consulta de Vendas'
      case '/creditos':
        return 'Nova Consulta de Créditos'
      case '/servicos':
        return 'Nova Consulta de Serviços'
      default:
        return 'Nova Pesquisa'
    }
  }

  return (
    <>
      {totals && <TotalModalidadesComp totals={totals} type={exportPage} />}
      
      <GerarRelatorio 
        className='export' 
        onExport={getExportFunction()}
        filteredData={currentFilteredData}
      />
      
      <div className='component-container-vendas'>
        {tableProps && (
          <NewTabelaGenerica {...tableProps} />
        )}
        <hr className='hr-global' />
        {adminDataArray && adminDataArray.length > 0 && (
          <TabelaGenericaAdm Array={adminDataArray} />
        )}
        <hr className='hr-global' />
      </div>
      <div data-tour="botaovoltar-section" className='floating-button-container'>
        <button 
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