import { useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import NewTabelaGenerica from '../../components/NewTabelaGenerica'
import TabelaGenericaAdm from '../../components/Componente_TabelaAdm'
import TotalModalidadesComp from '../../components/Componente_TotalModalidades'
import GerarRelatorio from "../../components/Componente_GerarRelatorio"
import '../../index.scss'
import './displayData.scss'
import { AuthContext } from '../../contexts/auth'

const DisplayData = ({ dataArray, adminDataArray, totals, onGoBack, setRunTutorial, location }) => {
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
  
  // Create ref to access NewTabelaGenerica methods
  const tabelaGenericaRef = useRef(null)

  const getTableColumns = useCallback((tableType) => {
    switch(tableType) {
      case 'vendas':
        return [
          { key: 'CNPJ', header: 'CNPJ' },
          { key: 'ADMINISTRADORA', header: 'Adquirente' },
          { key: 'BANDEIRA', header: 'Bandeira' },
          { key: 'PRODUTO', header: 'Produto' },
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
          { key: 'adquirente.nomeAdquirente', header: 'Adquirente' },
          { key: 'bandeira.descricaoBandeira', header: 'Bandeira' },
          { key: 'produto.descricaoProduto', header: 'Produto' },
          { key: 'modalidade.descricaoModalidade', header: 'Subproduto' },
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
          { key: 'nsu', header: 'NSU' },
          { key: 'codigoAutorizacao', header: 'Autorização' },
          { key: 'parcela', header: 'Parcela' },
          { key: 'totalParcelas', header: 'QTD Parcelas' },
          { key: 'banco', header: 'Banco' },
          { key: 'agencia', header: 'Agência' },
          { key: 'conta', header: 'Conta' },
        ]
      
      case 'servicos':
        return [
          { key: 'cnpj', header: 'cnpj' },
          { 
            key: 'data', 
            header: 'Data',
            accessor: (item) => dateConvert(item.data)
          },
          { key: 'nome_adquirente', header: 'Adquirente' },
          { key: 'descricao', header: 'Serviço' },
          { 
            key: 'valor', 
            header: 'Valor',
            render: (item) => <span className='red-global'>{Number(item.valor.toFixed(2)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
          },
          { key: 'razao_social', header: 'Razão Social' }
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

  // Enhanced export function to use filtered data
  const getExportFunction = useCallback(() => {
    const exportData = async () => {
      if (!tabelaGenericaRef.current) {
        console.warn('Table reference not available')
        return
      }

      try {
        // Get the currently filtered data from the table
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
    case '/servicos': return (total) => {
      console.log('Services total:', total)
      return null
    }
    default: return null
  }
}, [currentPath, setSalesTotal, setCreditsTotal])

  const loadTotals = useCallback((array, tableType) => {
    if(array && array.length > 0){
      let temp = []
      let totalCreditoTemp = 0
      let totalDebitoTemp = 0
      let totalVoucherTemp = 0
      let totalTemp = 0

      array.forEach((venda)=>{
        if(temp.length === 0){
          let newObj = {
            adminName: tableType === 'servicos' ? venda.nome_adquirente : venda.ADMINISTRADORA,
            total: tableType === 'servicos' ? Math.abs(venda.valor) : venda.VALORBRUTO,
            id: 0,
            sales: []
          }
          temp.push(newObj)
        }else{
          let newObj = {
            adminName: tableType === 'servicos' ? venda.nome_adquirente : venda.ADMINISTRADORA,
            total: tableType === 'servicos' ? Math.abs(venda.valor) : venda.VALORBRUTO,
            id: 0,
            sales: []
          }

          if(!(temp.find((objeto) => objeto.adminName === newObj.adminName && objeto !== ( undefined || [] )))){
            newObj.id = (temp.length)
            temp.push(newObj)
          } else {
            for(let i = 0; i < temp.length; i++){
              if(temp[i].adminName === newObj.adminName){
                temp[i].total += newObj.total
              }
            }
          }
        }

        if (tableType !== 'servicos') {
          const produto = (venda.PRODUTO || "").trim()
          switch(produto){
            case 'Crédito':
              totalCreditoTemp += venda.VALORBRUTO
              break
            case 'Débito':
              totalDebitoTemp += venda.VALORBRUTO
              break
            case 'Voucher':
              totalVoucherTemp += venda.VALORBRUTO
              break
            default:
              // If produto contains Voucher, add to voucher
              if (produto.includes('Voucher')) {
                totalVoucherTemp += venda.VALORBRUTO
              }
              break
          }
        }
        
        totalTemp += venda.VALORBRUTO
      })

      let totalResult = tableType === 'servicos' 
        ? { total: totalTemp }
        : { debit: totalDebitoTemp, credit: totalCreditoTemp, voucher: totalVoucherTemp, total: totalTemp }
      
      const updateFunction = getTotalUpdateFunction()
      if (updateFunction) {
        setTimeout(() => {
          updateFunction(totalResult)
        }, 0)
      }
    }
  }, [getTotalUpdateFunction])

  const handleTotalUpdate = useCallback((data) => {
    if (exportPage) {
      setCurrentFilteredData(data)
      loadTotals(data, exportPage)
    }
  }, [exportPage, loadTotals])

  // Custom filter configuration for dependent filtering
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

  useEffect(() => {
    const path = location.pathname
    setCurrentPath(path)
    localStorage.setItem('currentPath', path)

    switch (path) {
      case '/vendas':
        setExportPage('vendas')
        break
      case '/creditos':
        setExportPage('creditos')
        break
      case '/servicos':
        setExportPage('servicos')
        break
      default:
        setExportPage('')
        break
    }
  }, [location.pathname])

  // Initialize currentFilteredData when dataArray changes
  useEffect(() => {
    if (dataArray && dataArray.length > 0) {
      setCurrentFilteredData(dataArray)
    }
  }, [dataArray])

  // Enhanced table props with ref and proper data handling
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

  // Determine button text based on page type
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
      {currentPath === '/servicos' && <hr className='hr-global' />}
      
      {/* Pass the export function and filtered data to GerarRelatorio */}
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

export default DisplayData