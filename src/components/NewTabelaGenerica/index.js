/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState, useMemo, useCallback, forwardRef, useImperativeHandle, useRef } from 'react'
import { AuthContext } from '../../contexts/auth'
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiSkipBack, 
  FiSkipForward, 
  FiFilter, 
  FiChevronDown, 
  FiChevronUp 
} from 'react-icons/fi'
import Marquee from "react-fast-marquee";

import './NewTabelaGenerica.scss'

const tableConfig = {
  vendas: {
    title: 'Vendas',
    filters: [
      { key: 'bandeira', label: 'Bandeira', path: 'bandeira.descricaoBandeira' },
      { key: 'adquirente', label: 'Adquirente', path: 'adquirente.nomeAdquirente' }
    ],
    mobileCards: [
      { key: 'adquirente', label: 'Adquirente', path: 'adquirente.nomeAdquirente' },
      { key: 'bandeira', label: 'Bandeira', path: 'bandeira.descricaoBandeira', badge: true },
      { key: 'cnpj', label: 'CNPJ' },
      { key: 'valorBruto', label: 'Valor Bruto', format: 'currency', className: 'green-global' },
      { key: 'valorLiquido', label: 'Valor Líquido', format: 'currency', className: 'green-global' },
      { key: 'taxa', label: 'Taxa', format: 'percent', className: 'red-global' },
      { key: 'dataVenda', label: 'Data Venda', format: 'date' },
      { key: 'quantidadeParcelas', label: 'Parcelas' },
      { key: 'nsu', label: 'NSU' },
      { key: 'tid', label: 'TID' }
    ]
  },
  creditos: {
    title: 'Créditos',
    filters: [
      { key: 'bandeira', label: 'Bandeira', path: 'bandeira.descricaoBandeira' },
      { key: 'adquirente', label: 'Adquirente', path: 'adquirente.nomeAdquirente' }
    ],
    mobileCards: [
      { key: 'adquirente', label: 'Adquirente', path: 'adquirente.nomeAdquirente' },
      { key: 'bandeira', label: 'Bandeira', path: 'bandeira.descricaoBandeira', badge: true },
      { key: 'cnpj', label: 'CNPJ' },
      { key: 'valorBruto', label: 'Valor Bruto', format: 'currency', className: 'green-global' },
      { key: 'valorLiquido', label: 'Valor Líquido', format: 'currency', className: 'green-global' },
      { key: 'taxa', label: 'Taxa', format: 'percent', className: 'red-global' },
      { key: 'dataVenda', label: 'Data Venda', format: 'date' },
      { key: 'quantidadeParcelas', label: 'Parcelas' },
      { key: 'nsu', label: 'NSU' },
      { key: 'tid', label: 'TID' }
    ]
  },
  servicos: {
    title: 'Serviços',
    filters: [
      { key: 'servico', label: 'Serviço', path: 'descricao' },
      { key: 'adquirente', label: 'Adquirente', path: 'nome_adquirente' }
    ],
    mobileCards: [
      { key: 'nome_adquirente', label: 'Adquirente' },
      { key: 'descricao', label: 'Serviço', badge: true },
      { key: 'cnpj', label: 'CNPJ' },
      { key: 'data', label: 'Data', format: 'date' },
      { key: 'valor', label: 'Valor', format: 'currency', className: 'red-global' },
      { key: 'razao_social', label: 'Razão Social' }
    ]
  }
}

// Helper component for conditional marquee rendering
const ConditionalMarquee = ({ children, speed = 50, gradient = false, className = "" }) => {
  const text = typeof children === 'string' ? children : '';
  
  // Check if text is longer than 10 characters
  if (text.length > 10) {
    return (
      <div className="marquee-container">
        <Marquee speed={speed} gradient={gradient} className={className} delay={1}>
          {children}
        </Marquee>
      </div>
    );
  }
  
  // If 10 characters or less, render as a regular span
  return (
    <div className="marquee-container static-text">
      <span className={className}>
        {children}
      </span>
    </div>
  );
};

const NewTabelaGenerica = forwardRef(({ 
  array, 
  tableType,
  columns,
  filters = {},
  dateRange,
  onTotalUpdate,
  textColor,
  showFilters = true,
  enableResponsive = true,
  expandable = false,
  onRowClick,
  onLoadTabData,
  tabs = [],
  renderTabContent,
  renderExpandableContent: customRenderExpandableContent,
  expandAll = false,
  filterConfig: customFilterConfig,
  enableDependentFilters = false,
}, ref) => {
  const { 
    isDarkTheme, 
    dateConvert
  } = useContext(AuthContext)

  // Use useMemo for derived data to prevent unnecessary re-renders
  const dataArray = useMemo(() => array || [], [array])

  const [dataExibicao, setDataExibicao] = useState([])
  const [allFilterOptions, setAllFilterOptions] = useState({})
  const [selectedFilters, setSelectedFilters] = useState({})
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [expandedRow, setExpandedRow] = useState(null)
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [loadingData, setLoadingData] = useState({})
  const [tabData, setTabData] = useState({})
  const [activeTab, setActiveTab] = useState({})
  const [loadedTabs, setLoadedTabs] = useState({})
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)

  // Add a ref to track last filtered data
  const lastFilteredDataRef = useRef(null)

  const config = useMemo(() => tableConfig[tableType] || {}, [tableType])

  // FIXED: Expose filtered data via ref
  useImperativeHandle(ref, () => ({
    getFilteredData: () => dataExibicao
  }), [dataExibicao])

  // Check for mobile view - fixed with proper cleanup
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Reset page when array changes
  useEffect(() => {
    setCurrentPage(1)
  }, [array])

  // Initialize expanded rows if expandAll is true
  useEffect(() => {
    if (expandAll && dataArray && dataArray.length > 0) {
      const allRowIds = dataArray.map((item, index) => 
        item.id || item.document || item.contractNumber || index
      )
      setExpandedRows(new Set(allRowIds))
    }
  }, [dataArray, expandAll])

  // Stable filter configuration
  const getFilterConfig = useCallback(() => {
    if (customFilterConfig) return customFilterConfig
    
    switch(tableType) {
      case 'vendas':
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
  }, [tableType, customFilterConfig])

  // Use either provided columns or generated columns
  const tableColumns = useMemo(() => columns || [], [columns])

  // Check if table should be expandable
  const isExpandable = expandable || config.expandable

  // FIXED: Simplified filter options calculation - no infinite loops
  useEffect(() => {
    if (!showFilters || dataArray.length === 0) {
      setDataExibicao(dataArray)
      setAllFilterOptions({})
      return
    }

    const filterConfig = getFilterConfig()
    
    // Calculate all possible values
    const allOptions = {}
    Object.keys(filterConfig).forEach(filterKey => {
      const uniqueValues = new Set()
      
      dataArray.forEach(item => {
        const value = filterConfig[filterKey].accessor(item)
        if (value) {
          uniqueValues.add(value)
        }
      })

      allOptions[filterKey] = [...uniqueValues].sort((a, b) => a.localeCompare(b))
    })

    setAllFilterOptions(allOptions)
  }, [dataArray, tableType, showFilters, getFilterConfig])

  // FIXED: Separate effect for filtering data with duplicate prevention
  useEffect(() => {
    if (dataArray.length === 0) {
      setDataExibicao([])
      lastFilteredDataRef.current = null
      return
    }

    const filterConfig = getFilterConfig()
    let filteredData = dataArray

    const hasActiveFilters = Object.keys(selectedFilters).some(key => selectedFilters[key])
    
    if (hasActiveFilters) {
      Object.keys(selectedFilters).forEach(filterKey => {
        if (selectedFilters[filterKey] && filterConfig[filterKey]) {
          filteredData = filteredData.filter(item => 
            filterConfig[filterKey].accessor(item) === selectedFilters[filterKey]
          )
        }
      })
    }
    
    // FIXED: Only update if data actually changed
    const filteredDataSignature = JSON.stringify(filteredData)
    if (filteredDataSignature !== lastFilteredDataRef.current) {
      lastFilteredDataRef.current = filteredDataSignature
      setDataExibicao(filteredData)
      setCurrentPage(1) // Reset to first page when filters change
      
      // Call onTotalUpdate only when data actually changes
      if (onTotalUpdate && filteredData.length !== dataExibicao.length) {
        console.log('Calling onTotalUpdate with filtered data:', filteredData.length)
        onTotalUpdate(filteredData)
      }
    }
  }, [dataArray, selectedFilters, getFilterConfig, onTotalUpdate, dataExibicao.length])

  // Enhanced expandable rows functions
  const toggleRow = useCallback(async (row) => {
    const rowId = row.id || row.document || row.contractNumber || Math.random()
    
    if (expandAll) {
      const newExpandedRows = new Set(expandedRows)
      if (newExpandedRows.has(rowId)) {
        newExpandedRows.delete(rowId)
      } else {
        newExpandedRows.add(rowId)
      }
      setExpandedRows(newExpandedRows)
    } else {
      const isExpanding = expandedRow !== rowId
      setExpandedRow(isExpanding ? rowId : null)
    }
    
    if (onRowClick) {
      onRowClick(row)
    }

    if ((expandAll ? !expandedRows.has(rowId) : expandedRow !== rowId) && isExpandable) {
      setActiveTab(prev => ({ ...prev, [rowId]: null }))
    }
  }, [expandAll, expandedRows, expandedRow, onRowClick, isExpandable])

  const isRowExpanded = useCallback((rowId) => {
    return expandAll ? expandedRows.has(rowId) : expandedRow === rowId
  }, [expandAll, expandedRows, expandedRow])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setLoadingData({})
      setTabData({})
      setLoadedTabs({})
    }
  }, [])

  // Pagination functions
  const goToPrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }, [])

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, Math.ceil(dataExibicao.length / itemsPerPage)))
  }, [dataExibicao.length, itemsPerPage])

  const goToFirstPage = useCallback(() => setCurrentPage(1), [])
  const goToLastPage = useCallback(() => setCurrentPage(Math.ceil(dataExibicao.length / itemsPerPage)), [dataExibicao.length, itemsPerPage])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = dataExibicao.slice(indexOfFirstItem, indexOfLastItem)

  // Get date range text as React elements
  const getDateRangeText = useCallback(() => {
    if (!dateRange || dateRange.length < 2) return ''
    
    const formatDate = (date) => {
      if (date instanceof Date) {
        return date.toLocaleDateString('pt-BR')
      }
      return date
    }

    const formattedStart = formatDate(dateRange[0])
    const formattedEnd = formatDate(dateRange[1])
    
    const tableLabels = {
      vendas: 'Vendas',
      creditos: 'Créditos', 
      servicos: 'Ajustes/Serviços'
    }

    const label = tableLabels[tableType] || 'Dados'

    if (formattedStart !== formattedEnd) {
      return (
        <span>
          Exibindo {label} do dia <strong>{formattedStart}</strong> ao dia <strong>{formattedEnd}</strong>
        </span>
      )
    } else {
      return (
        <span>
          Exibindo {label} do dia <strong>{formattedStart}</strong>
        </span>
      )
    }
  }, [dateRange, tableType])

  // FIXED: Simple filter change handler - no complex dependencies
  const handleFilterChange = useCallback((filterKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value || ''
    }))
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedFilters({})
  }, [])

  // FIXED: Get available options for dropdown based on current selections
  const getAvailableOptions = useCallback((filterKey) => {
    if (!enableDependentFilters) {
      return allFilterOptions[filterKey] || []
    }

    const filterConfig = getFilterConfig()
    const dependentKey = filterConfig[filterKey]?.dependentKey
    const currentDependentValue = selectedFilters[dependentKey]

    // If dependent filter is not selected or is "Todas", show all options
    if (!currentDependentValue) {
      return allFilterOptions[filterKey] || []
    }

    // Calculate available options based on the dependent filter
    const availableValues = new Set()
    const filteredData = dataArray.filter(item => {
      return filterConfig[dependentKey].accessor(item) === currentDependentValue
    })

    filteredData.forEach(item => {
      const value = filterConfig[filterKey].accessor(item)
      if (value) {
        availableValues.add(value)
      }
    })

    return [...availableValues].sort((a, b) => a.localeCompare(b))
  }, [enableDependentFilters, allFilterOptions, getFilterConfig, selectedFilters, dataArray])

  // Helper function to get nested object values
  const getNestedValue = useCallback((obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }, [])

  // Helper function to format values
  const formatValue = useCallback((value, format) => {
    if (value === null || value === undefined || value === '') return ''
    
    switch (format) {
      case 'currency':
        return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      case 'percent':
        return `${Number(value).toFixed(2)}%`
      case 'date':
        return dateConvert(value)
      case 'time':
        return value?.replaceAll?.('-', ':') || value
      default:
        return value || ''
    }
  }, [dateConvert])

  // Helper function to chunk array for mobile cards
  const chunkArray = useCallback((array, size) => {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }, [])

  if (tableType === 'admin') {
    return (
      <div data-tour="totaladq-section" className="tabela-generica-container">
        {dataExibicao && (
          <div className='content tabela-adm-content'>
            <div className='table-responsive-md'>
              <table className='table table-striped table-hover det-table-global elemento-table'>
                <thead className='thead-global'>
                  <tr className='det-tr-top-global'>
                    <th className='det-td-global' data-label='Adquirente'>Adquirente</th>
                    <th className='det-td-global' data-label='Total'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dataExibicao.map((elemento, index) => (
                    <tr key={elemento.id || index}>
                      <td className='det-td-global det-vendas-global' data-label="Adquirente">
                        {elemento.adminName}
                      </td>
                      <td className='det-td-global det-vendas-global' data-label="Total">
                        <span className={`${Number(elemento.total) >= 0 ? 'span-table-servicos-green' : 'span-table-servicos-red'} ${textColor || 'green-global'}`}>
                          {Number(elemento.total).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {showFilters && (
        <>
          <div className='date-container'>
            {/* Desktop Filters */}
            <div data-tour="bandeiraadquirente-section" className='container desktop-filters'>
              {Object.keys(getFilterConfig()).map(filterKey => (
                <div key={filterKey} className='export-column'>
                  <div className='filter-card'>
                    <label className='filter-label'>{getFilterConfig()[filterKey].label}</label>
                    <div className="custom-select-wrapper">
                      <select 
                        className='custom-select' 
                        value={selectedFilters[filterKey] || ''}
                        onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                      >
                        <option value=''>Todas</option>
                        {getAvailableOptions(filterKey)?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Clear filters button */}
              {Object.keys(selectedFilters).some(key => selectedFilters[key]) && (
                <div className="export-column">
                  <div className='filter-card'>
                    <label className='filter-label'>&nbsp;</label>
                    <button 
                      className="clear-filters-btn"
                      onClick={clearFilters}
                    >
                      <FiFilter />
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            <hr className='hr-global'/>
            <div className='container-busca'>
              <span className='span-busca'>
                {getDateRangeText()}
              </span>
            </div>
          </div>
          <hr className='hr-global'/>
        </>
      )}

      {error && (
        <div className="alert alert-danger mb-3 mobile-alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div data-tour="tabelavendas-section" className='dropShadow vendas-view'>
        <div className='table-wrapper'>
          {/* Desktop view */}
          {!isMobileView && (
            <table className='table table-striped table-hover det-table-global desktop-table'>
              <thead>
                <tr className='det-tr-top-global'>
                  {tableColumns.map(column => (
                    <th key={column.key} className='det-th-global' scope="col">
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index} className='det-tr-global'>
                    {tableColumns.map(column => (
                      <td key={column.key} className='det-td-vendas-global' data-label={column.header}>
                        {column.render ? column.render(item) : 
                         column.accessor ? column.accessor(item) : 
                         column.key.split('.').reduce((acc, part) => acc && acc[part], item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Mobile view with cards */}
          {isMobileView && config.mobileCards && (
            <div className="mobile-cards">
              {currentItems.map((item, index) => (
                <div key={index} className="sale-card">
                  <div className="card-header">
                    {config.mobileCards.slice(0, 2).map((field, idx) => {
                      const value = field.path ? getNestedValue(item, field.path) : item[field.key]
                      const formattedValue = formatValue(value, field.format)
                      
                      return field.badge ? (
                        <ConditionalMarquee key={field.key} className="badge">
                          {formattedValue}
                        </ConditionalMarquee>
                      ) : (
                        <strong key={field.key}>{formattedValue}</strong>
                      )
                    })}
                  </div>
                  <div className="card-body">
                    {chunkArray(config.mobileCards.slice(2), 2).map((row, rowIndex) => (
                      <div key={rowIndex} className="card-row">
                        {row.map(field => {
                          const value = field.path ? getNestedValue(item, field.path) : item[field.key]
                          const formattedValue = formatValue(value, field.format)
                          
                          return (
                            <div key={field.key} className="card-col">
                              <small>{field.label}</small>
                              {field.className ? (
                                <span className={field.className}>{formattedValue}</span>
                              ) : (
                                <span>{formattedValue}</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile view fallback to table if no mobile cards config */}
          {isMobileView && !config.mobileCards && (
            <table className='table table-striped table-hover det-table-global desktop-table'>
              <thead>
                <tr className='det-tr-top-global'>
                  {tableColumns.map(column => (
                    <th key={column.key} className='det-th-global' scope="col">
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index} className='det-tr-global'>
                    {tableColumns.map(column => (
                      <td key={column.key} className='det-td-vendas-global' data-label={column.header}>
                        {column.render ? column.render(item) : 
                         column.accessor ? column.accessor(item) : 
                         column.key.split('.').reduce((acc, part) => acc && acc[part], item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {dataExibicao.length > itemsPerPage && (
        <>
          <hr className='hr-global'/>
          <div className="container-btn-pagina">
            <button
              className='btn btn-primary btn-global btn-skip'
              onClick={goToFirstPage}
              disabled={currentPage === 1}
            >
              <FiSkipBack />
            </button>
            <button
              className='btn btn-primary btn-global btn-navigate'
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              <FiChevronLeft/>
            </button>
            <div className='pagina-atual'>
              <span className='texto-paginacao'>Página </span>
              <span className='texto-paginacao'>{currentPage}</span>
            </div>
            <button
              className='btn btn-primary btn-global btn-navigate'
              onClick={goToNextPage}
              disabled={currentPage === Math.ceil(dataExibicao.length / itemsPerPage)}
            >
              <FiChevronRight/>
            </button>
            <button
              className='btn btn-primary btn-global btn-skip'
              onClick={goToLastPage}
              disabled={currentPage === Math.ceil(dataExibicao.length / itemsPerPage)}
            >
              <FiSkipForward />
            </button>
          </div>
          <hr className='hr-global'/>
        </>
      )}
    </>
  )
})

export default NewTabelaGenerica