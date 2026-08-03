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
      { key: 'bandeira', label: 'Bandeira', path: 'BANDEIRA' },
      { key: 'adquirente', label: 'Adquirente', path: 'ADMINISTRADORA' }
    ],
    mobileCards: [
      { key: 'adquirente', label: 'Adquirente', path: 'ADMINISTRADORA' },
      { key: 'bandeira', label: 'Bandeira', path: 'BANDEIRA', badge: true },
      { key: 'cnpj', label: 'CNPJ', path: 'CNPJ' },
      { key: 'valorBruto', label: 'Valor Bruto', path: 'VALORBRUTO', format: 'currency', className: 'green-global' },
      { key: 'valorLiquido', label: 'Valor Líquido', path: 'VALORLIQUIDO', format: 'currency', className: 'green-global' },
      { key: 'cartao', label: 'Cartão', path: 'CARTAO'},
      { key: 'taxa', label: 'Taxa', path: 'TAXA', format: 'percent', className: 'red-global' },
      { key: 'dataVenda', label: 'Data Venda', path: 'DATAVENDA', format: 'date' },
      { key: 'parcela', label: 'Parcelas', path: 'PARCELA' },
      { key: 'nsu', label: 'NSU', path: 'NSU' },
      { key: 'status', label: 'Status', path: 'STATUS' }
    ]
  },
  creditos: {
    title: 'Créditos',
    filters: [
      { key: 'bandeira', label: 'Bandeira', path: 'BANDEIRA' },
      { key: 'adquirente', label: 'Adquirente', path: 'ADMINISTRADORA' }
    ],
    mobileCards: [
      { key: 'adquirente', label: 'Adquirente', path: 'ADMINISTRADORA' },
      { key: 'bandeira', label: 'Bandeira', path: 'BANDEIRA', badge: true },
      { key: 'cnpj', label: 'CNPJ', path: 'CNPJ' },
      { key: 'valorBruto', label: 'Valor Bruto', path: 'VALORBRUTO', format: 'currency', className: 'green-global' },
      { key: 'valorLiquido', label: 'Valor Líquido', path: 'VALORLIQUIDO', format: 'currency', className: 'green-global' },
      { key: 'cartao', label: 'Cartão', path: 'CARTAO'},
      { key: 'taxa', label: 'Taxa', path: 'TAXA', format: 'percent', className: 'red-global' },
      { key: 'dataVenda', label: 'Data Venda', path: 'DATAVENDA', format: 'date' },
      { key: 'parcela', label: 'Parcelas', path: 'PARCELA' },
      { key: 'nsu', label: 'NSU', path: 'NSU' },
      { key: 'status', label: 'Status', path: 'STATUS' }
    ]
  },
  servicos: {
    title: 'Serviços',
    filters: [
      { key: 'adquirente', label: 'Adquirente', path: 'ADMINISTRADORA' },
      { key: 'tipoAjuste', label: 'Tipo de Ajuste', path: 'TIPOAJUSTE' }
    ],
    mobileCards: [
      { key: 'adquirente', label: 'Adquirente', path: 'ADMINISTRADORA' },
      { key: 'tipoAjuste', label: 'Tipo', path: 'TIPOAJUSTE', badge: true },
      { key: 'cnpj', label: 'CNPJ', path: 'CNPJ' },
      { key: 'razaoSocial', label: 'Razão Social', path: 'RAZAOSOCIAL' },
      { key: 'valorBruto', label: 'Valor Bruto', path: 'VALORBRUTO', format: 'currency', className: 'red-global' },
      { key: 'valorLiquido', label: 'Valor Líquido', path: 'VALORLIQUIDO', format: 'currency', className: 'red-global' },
      { key: 'descricao', label: 'Descrição', path: 'DESCRICAOAJUSTE' },
      { key: 'dataVenda', label: 'Data Venda', path: 'DATAVENDA', format: 'date' },
      { key: 'dataCredito', label: 'Data Crédito', path: 'DATACREDITO', format: 'date' },
      { key: 'nsu', label: 'NSU', path: 'NSU' },
      { key: 'status', label: 'Status', path: 'STATUS' },
      { key: 'codigoAjuste', label: 'Código', path: 'CODIGOAJUSTE' }
    ]
  }
}

// Helper function to find the full bandeira/adquirente/servico object from the data array
const findFilterObject = (value, filterKey, dataArray, tableType) => {
  if (!value || !dataArray || dataArray.length === 0) return null
  
  const uniqueMap = new Map()
  
  dataArray.forEach(item => {
    let displayName = null
    let code = null
    
    if (tableType === 'vendas') {
      if (filterKey === 'bandeira') {
        displayName = item.BANDEIRA
        code = item.CODIGOBANDEIRA
        if (displayName === value && code && !uniqueMap.has(code)) {
          uniqueMap.set(code, {
            codigoBandeira: code,
            descricaoBandeira: displayName
          })
        }
      } else if (filterKey === 'adquirente') {
        displayName = item.ADMINISTRADORA
        code = item.CODIGOADMINISTRADORA
        if (displayName === value && code && !uniqueMap.has(code)) {
          uniqueMap.set(code, {
            codigoAdquirente: code,
            nomeAdquirente: displayName
          })
        }
      }
    } else if (tableType === 'creditos') {
      if (filterKey === 'bandeira') {
        displayName = item.BANDEIRA
        code = item.CODIGOBANDEIRA
        if (displayName === value && code && !uniqueMap.has(code)) {
          uniqueMap.set(code, {
            codigoBandeira: code,
            descricaoBandeira: displayName
          })
        }
      } else if (filterKey === 'adquirente') {
        displayName = item.ADMINISTRADORA
        code = item.CODIGOADMINISTRADORA
        if (displayName === value && code && !uniqueMap.has(code)) {
          uniqueMap.set(code, {
            codigoAdquirente: code,
            nomeAdquirente: displayName
          })
        }
      }
    } else if (tableType === 'servicos') {
      if (filterKey === 'tipoAjuste') {
        displayName = item.TIPOAJUSTE
        code = item.CODIGOAJUSTE || Math.abs(displayName?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0)
        if (displayName === value && !uniqueMap.has(code)) {
          uniqueMap.set(code, {
            codigoAjuste: code,
            descricaoAjuste: displayName
          })
        }
      } else if (filterKey === 'adquirente') {
        displayName = item.ADMINISTRADORA
        code = item.CODIGOADMINISTRADORA
        if (displayName === value && code && !uniqueMap.has(code)) {
          uniqueMap.set(code, {
            codigoAdquirente: code,
            nomeAdquirente: displayName
          })
        }
      }
    }
  })
  
  const result = uniqueMap.size > 0 ? Array.from(uniqueMap.values())[0] : null
  
  return result
}

const ConditionalMarquee = ({ children, speed = 50, gradient = false, className = "" }) => {
  const text = typeof children === 'string' ? children : '';
  
  if (text.length > 10) {
    return (
      <div className="marquee-container">
        <Marquee speed={speed} gradient={gradient} className={className} delay={1}>
          {children}
        </Marquee>
      </div>
    );
  }
  
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
  const [isDataProcessed, setIsDataProcessed] = useState(false)

  const lastFilteredDataRef = useRef(null)
  const isUpdatingRef = useRef(false)
  const onTotalUpdateRef = useRef(onTotalUpdate)
  const lastNotifiedDataRef = useRef(null)

  useEffect(() => {
    onTotalUpdateRef.current = onTotalUpdate
  }, [onTotalUpdate])

  const config = useMemo(() => tableConfig[tableType] || {}, [tableType])

  useImperativeHandle(ref, () => ({
    getFilteredData: () => dataExibicao
  }), [dataExibicao])

  const getStorageKeys = useCallback(() => {
    switch(tableType) {
      case 'vendas':
        return { filter1: 'selectedBan', filter2: 'selectedAdm' }
      case 'creditos':
        return { filter1: 'selectedBanCredits', filter2: 'selectedAdmCredits' }
      case 'servicos':
        return { filter1: 'selectedBanServices', filter2: 'selectedAdmServices' }
      default:
        return { filter1: 'selectedBan', filter2: 'selectedAdm' }
    }
  }, [tableType])

  const getFilterKeys = useCallback(() => {
    switch(tableType) {
      case 'vendas':
        return { first: 'bandeira', second: 'adquirente' }
      case 'creditos':
        return { first: 'bandeira', second: 'adquirente' }
      case 'servicos':
        return { first: 'tipoAjuste', second: 'adquirente' }
      default:
        return { first: 'bandeira', second: 'adquirente' }
    }
  }, [tableType])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [array])

  useEffect(() => {
    if (expandAll && dataArray && dataArray.length > 0) {
      const allRowIds = dataArray.map((item, index) => 
        item.id || item.document || item.contractNumber || index
      )
      setExpandedRows(new Set(allRowIds))
    }
  }, [dataArray, expandAll])

  // Load saved filters from localStorage on component mount
  useEffect(() => {
    const storageKeys = getStorageKeys()
    const filterKeys = getFilterKeys()
    const savedFirstFilter = localStorage.getItem(storageKeys.filter1)
    const savedSecondFilter = localStorage.getItem(storageKeys.filter2)
    
    const initialFilters = {}
    
    if (savedFirstFilter && savedFirstFilter !== 'null' && savedFirstFilter !== 'undefined') {
      try {
        const parsedFilter = JSON.parse(savedFirstFilter)
        let filterValue = null
        
        if (tableType === 'servicos') {
          filterValue = parsedFilter.descricaoAjuste
        } else {
          filterValue = parsedFilter.descricaoBandeira
        }
        
        if (filterValue) {
          initialFilters[filterKeys.first] = filterValue
        }
      } catch (e) {
        console.error('Error parsing saved filter:', e)
      }
    }
    
    if (savedSecondFilter && savedSecondFilter !== 'null' && savedSecondFilter !== 'undefined') {
      try {
        const parsedFilter = JSON.parse(savedSecondFilter)
        if (parsedFilter && parsedFilter.nomeAdquirente) {
          initialFilters[filterKeys.second] = parsedFilter.nomeAdquirente
        }
      } catch (e) {
        console.error('Error parsing saved filter:', e)
      }
    }
    
    if (Object.keys(initialFilters).length > 0) {
      setSelectedFilters(prev => ({ ...prev, ...initialFilters }))
    }
  }, [getStorageKeys, getFilterKeys, tableType])

  // Update localStorage when first filter changes
  useEffect(() => {
    const storageKeys = getStorageKeys()
    const filterKeys = getFilterKeys()
    const filterValue = selectedFilters[filterKeys.first]
    
    
    if (filterValue && dataArray && dataArray.length > 0) {
      const filterObject = findFilterObject(filterValue, filterKeys.first, dataArray, tableType)
      if (filterObject) {
        localStorage.setItem(storageKeys.filter1, JSON.stringify(filterObject))
      } else {
        localStorage.removeItem(storageKeys.filter1)
      }
    } else if (!filterValue) {
      localStorage.removeItem(storageKeys.filter1)
    }
  }, [selectedFilters, dataArray, tableType, getStorageKeys, getFilterKeys])

  // Update localStorage when second filter changes
  useEffect(() => {
    const storageKeys = getStorageKeys()
    const filterKeys = getFilterKeys()
    const filterValue = selectedFilters[filterKeys.second]
      
    if (filterValue && dataArray && dataArray.length > 0) {
      const filterObject = findFilterObject(filterValue, filterKeys.second, dataArray, tableType)
      if (filterObject) {
        localStorage.setItem(storageKeys.filter2, JSON.stringify(filterObject))
      } else {
        localStorage.removeItem(storageKeys.filter2)
      }
    } else if (!filterValue) {
      localStorage.removeItem(storageKeys.filter2)
    }
  }, [selectedFilters, dataArray, tableType, getStorageKeys, getFilterKeys])

  const getFilterConfig = useCallback(() => {
    if (customFilterConfig) return customFilterConfig
    
    switch(tableType) {
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
            accessor: (item) => item.ADMINISTRADORA || '',
            dependentKey: 'tipoAjuste'
          },
          tipoAjuste: {
            label: 'Tipo de Ajuste',
            accessor: (item) => item.TIPOAJUSTE || '',
            dependentKey: 'adquirente'
          }
        }
      default:
        return {}
    }
  }, [tableType, customFilterConfig])

  const tableColumns = useMemo(() => columns || [], [columns])

  const isExpandable = expandable || config.expandable

  // Initialize filter options
  useEffect(() => {
    if (!showFilters || dataArray.length === 0) {
      if (Object.keys(allFilterOptions).length > 0) {
        setAllFilterOptions({})
      }
      return
    }

    const filterConfig = getFilterConfig()
    
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
  }, [dataArray, showFilters, getFilterConfig])

  // Main filtering logic
  useEffect(() => {
    if (isUpdatingRef.current) return
    
    if (dataArray.length === 0) {
      if (dataExibicao.length !== 0) {
        setDataExibicao([])
        lastFilteredDataRef.current = null
        setIsDataProcessed(false)
      }
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
    
    const filteredDataSignature = JSON.stringify(filteredData)
    
    if (filteredDataSignature !== lastFilteredDataRef.current) {
      isUpdatingRef.current = true
      lastFilteredDataRef.current = filteredDataSignature
      setDataExibicao(filteredData)
      setCurrentPage(1)
      
      if (onTotalUpdateRef.current && isDataProcessed && filteredData.length !== dataExibicao.length) {
        onTotalUpdateRef.current(filteredData)
      }
      
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 100)
    }
    
    if (!isDataProcessed && dataArray.length > 0) {
      setIsDataProcessed(true)
    }
  }, [dataArray, selectedFilters, getFilterConfig, dataExibicao.length, isDataProcessed])

  // Update parent component when dataExibicao changes
  useEffect(() => {
    if (onTotalUpdateRef.current && dataExibicao && dataExibicao.length > 0) {
      const dataSignature = JSON.stringify(dataExibicao)
      if (dataSignature !== lastNotifiedDataRef.current) {
        lastNotifiedDataRef.current = dataSignature
        onTotalUpdateRef.current(dataExibicao)
      }
    }
  }, [dataExibicao])

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

  useEffect(() => {
    return () => {
      setLoadingData({})
      setTabData({})
      setLoadedTabs({})
    }
  }, [])

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

  const handleFilterChange = useCallback((filterKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value || ''
    }))
  }, [])

  const clearFilters = useCallback(() => {
    const storageKeys = getStorageKeys()
    setSelectedFilters({})
    localStorage.removeItem(storageKeys.filter1)
    localStorage.removeItem(storageKeys.filter2)
  }, [getStorageKeys])

  const getAvailableOptions = useCallback((filterKey) => {
    if (!enableDependentFilters) {
      return allFilterOptions[filterKey] || []
    }

    const filterConfig = getFilterConfig()
    const dependentKey = filterConfig[filterKey]?.dependentKey
    const currentDependentValue = selectedFilters[dependentKey]

    if (!currentDependentValue) {
      return allFilterOptions[filterKey] || []
    }

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

  const getNestedValue = useCallback((obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }, [])

  const formatValue = useCallback((value, formatType) => {
    if (value === null || value === undefined || value === '') return ''
    
    switch (formatType) {
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

  const chunkArray = useCallback((arrayToChunk, size) => {
    const chunks = []
    for (let i = 0; i < arrayToChunk.length; i += size) {
      chunks.push(arrayToChunk.slice(i, i + size))
    }
    return chunks
  }, [])

  if (tableType === 'admin') {
    return (
      <div data-tour="totaladq-section" className="tabela-generica-container">
        {dataExibicao && dataExibicao.length > 0 && (
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


            <hr className='hr-global'/>
            <div className='container-busca'>
              <span className='span-busca'>
                {getDateRangeText()}
              </span>
            </div>
          </div>
          <hr className='hr-global'/>
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
          >
            ×
          </button>
        </div>
      )}

      <div data-tour="tabelavendas-section" className='dropShadow vendas-view'>
        <div className='table-wrapper'>
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

          {/* Mobile Cards - Fixed for services */}
          {isMobileView && config.mobileCards && config.mobileCards.length > 0 ? (
            <div className="mobile-cards">
              {currentItems.map((item, index) => (
                <div key={index} className="sale-card">
                  <div className="card-header">
                    {config.mobileCards.slice(0, 2).map((field, idx) => {
                      let value
                      if (field.path) {
                        if (field.path.includes('.')) {
                          value = getNestedValue(item, field.path)
                        } else {
                          value = item[field.path]
                        }
                      } else {
                        value = item[field.key]
                      }
                      const formattedValue = formatValue(value, field.format)
                      
                      return field.badge ? (
                        <ConditionalMarquee key={field.key} className="badge">
                          {formattedValue || field.label}
                        </ConditionalMarquee>
                      ) : (
                        <strong key={field.key}>{formattedValue || 'N/A'}</strong>
                      )
                    })}
                  </div>
                  <div className="card-body">
                    {chunkArray(config.mobileCards.slice(2), 2).map((row, rowIndex) => (
                      <div key={rowIndex} className="card-row">
                        {row.map(field => {
                          let value
                          if (field.path) {
                            if (field.path.includes('.')) {
                              value = getNestedValue(item, field.path)
                            } else {
                              value = item[field.path]
                            }
                          } else {
                            value = item[field.key]
                          }
                          const formattedValue = formatValue(value, field.format)
                          
                          return (
                            <div key={field.key} className="card-col">
                              <small>{field.label}</small>
                              {field.className ? (
                                <span className={field.className}>{formattedValue || 'N/A'}</span>
                              ) : (
                                <span>{formattedValue || 'N/A'}</span>
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
          ) : isMobileView && (
            // Fallback mobile view when no mobileCards config exists
            <div className="mobile-cards-fallback">
              {currentItems.map((item, index) => (
                <div key={index} className="sale-card-fallback">
                  <div className="card-header-fallback">
                    <strong>{item.ADMINISTRADORA || item.nome_adquirente || 'Unknown'}</strong>
                    {item.TIPOAJUSTE && <span className="badge-fallback">{item.TIPOAJUSTE}</span>}
                  </div>
                  <div className="card-body-fallback">
                    <div className="card-row-fallback">
                      <span className="label">Valor:</span>
                      <span className={`value ${(item.VALORLIQUIDO || 0) < 0 ? 'red-global' : 'green-global'}`}>
                        {formatValue(Math.abs(item.VALORLIQUIDO || item.VALORBRUTO || 0), 'currency')}
                      </span>
                    </div>
                    <div className="card-row-fallback">
                      <span className="label">Data:</span>
                      <span className="value">{formatValue(item.DATAVENDA || item.data, 'date')}</span>
                    </div>
                    {item.DESCRICAOAJUSTE && (
                      <div className="card-row-fallback">
                        <span className="label">Descrição:</span>
                        <span className="value description">{item.DESCRICAOAJUSTE}</span>
                      </div>
                    )}
                    {item.CNPJ && (
                      <div className="card-row-fallback">
                        <span className="label">CNPJ:</span>
                        <span className="value">{item.CNPJ}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

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

NewTabelaGenerica.displayName = 'NewTabelaGenerica'

export default NewTabelaGenerica