// NewDisplayData.jsx - Fixed with correct imports
import { useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import NewTabelaGenerica from '../../components/NewTabelaGenerica'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'
import GerarRelatorio from "../../components/Componente_GerarRelatorio" // Add this import back
import '../../index.scss'
import './displayData.scss'
import { AuthContext } from '../../contexts/auth'
import { FiFilePlus } from 'react-icons/fi'

const NewDisplayData = ({ 
  dataArray, 
  adminDataArray, 
  totals, 
  onGoBack, 
  setRunTutorial, 
  location,
  onExcelDownload,  // New prop for custom Excel download
  onPDFDownload,    // New prop for custom PDF download
  downloading       // New prop to show loading state
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
      
      case 'creditos':
        return [
          { key: 'cnpj', header: 'CNPJ' },
          { key: 'adquirente', header: 'Adquirente', accessor: (item) => item.adquirente?.nomeAdquirente },
          { key: 'bandeira', header: 'Bandeira', accessor: (item) => item.bandeira?.descricaoBandeira },
          { key: 'produto', header: 'Produto', accessor: (item) => item.produto?.descricaoProduto },
          { key: 'modalidade', header: 'Subproduto', accessor: (item) => item.modalidade?.descricaoModalidade },
          { 
            key: 'dataCredito', 
            header: 'Data do Crédito',
            accessor: (item) => dateConvert(item.dataCredito)
          },
          { 
            key: 'dataVenda', 
            header: 'Data da Venda',
            accessor: (item) => dateConvert(item.dataVenda)
          },
          { 
            key: 'valorBruto', 
            header: 'Valor Bruto',
            render: (item) => <span className='green-global'>{Number(item.valorBruto).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
          },
          { 
            key: 'valorLiquido', 
            header: 'Valor Líquido',
            render: (item) => <span className='green-global'>{Number(item.valorLiquido).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
          },
          { 
            key: 'taxa', 
            header: 'Taxa',
            render: (item) => <span className='red-global'>{Number(item.taxa).toFixed(2)}%</span>
          },
          { 
            key: 'valorDesconto', 
            header: 'Valor Desconto',
            render: (item) => <span className='red-global'>{Number(item.valorDesconto).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
          },
          { key: 'banco', header: 'Banco' },
          { key: 'agencia', header: 'Agência' },
          { key: 'conta', header: 'Conta' },
          { key: 'nsu', header: 'NSU' },
          { key: 'codigoAutorizacao', header: 'Autorização' },
          { key: 'parcela', header: 'Parcela' },
          { key: 'quantidadeParcelas', header: 'QTD Parcelas' }
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
      // For credits, we might have different total calculation
      let totalBruto = 0
      let totalLiquido = 0
      
      array.forEach((credito) => {
        totalBruto += Number(credito.valorBruto) || 0
        totalLiquido += Number(credito.valorLiquido) || 0
      })
      
      const totalResult = {
        totalBruto: totalBruto,
        totalLiquido: totalLiquido,
        total: totalLiquido
      }
      
      const updateFunction = getTotalUpdateFunction()
      if (updateFunction) {
        updateFunction(totalResult)
      }
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
            accessor: (item) => item.adquirente?.nomeAdquirente || '',
            dependentKey: 'bandeira'
          },
          bandeira: {
            label: 'Bandeira', 
            accessor: (item) => item.bandeira?.descricaoBandeira || '',
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
      default:
        return 'Nova Pesquisa'
    }
  }

  // Determine if we should use custom download handlers or the old GerarRelatorio
  const useCustomDownloads = onExcelDownload && onPDFDownload

  return (
    <>
      {totals && <TotalModalidadesComp totals={totals} type={exportPage} />}
      
      {useCustomDownloads ? (
        // Use custom download buttons for Credits/Services
        <div className="export-buttons-container" style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'flex-end' }}>
          <button 
            className="btn btn-exportar btn-exportar-excel" 
            onClick={onExcelDownload}
            disabled={downloading}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              cursor: downloading ? 'not-allowed' : 'pointer',
              opacity: downloading ? 0.6 : 1
            }}
          >
            {downloading ? 'Gerando...' : 'Download Excel'} <FiFilePlus />
          </button>
          <button 
            className="btn btn-exportar btn-exportar-pdf" 
            onClick={onPDFDownload}
            disabled={downloading}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              cursor: downloading ? 'not-allowed' : 'pointer',
              opacity: downloading ? 0.6 : 1
            }}
          >
            {downloading ? 'Gerando...' : 'Download PDF'} <FiFilePlus />
          </button>
        </div>
      ) : (
        // Use old GerarRelatorio component for Vendas
        <GerarRelatorio 
          className='export' 
          onExport={getExportFunction()}
          filteredData={currentFilteredData}
        />
      )}
      
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