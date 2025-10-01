/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import './TabelaResponsiva.scss'
import './ModalGenerico.scss'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward, FiFilter } from 'react-icons/fi'

const TabelaResponsiva = ({ array, dataType = 'sales' }) => {

  const { dateConvert } = useContext(AuthContext)

  const [dataArray, setDataArray] = useState([])
  const [dataToDisplay, setDataToDisplay] = useState([])
  const [filteredData, setFilteredData] = useState([])

  // Filter states
  const [filters, setFilters] = useState({})
  const [availableFilters, setAvailableFilters] = useState({})
  const [allFilters, setAllFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)

  // Configuration for different data types
  const tableConfig = {
    sales: {
      dataKey: 'sales',
      title: 'Vendas',
      filters: [
        { key: 'bandeira', label: 'Bandeira', path: 'bandeira.descricaoBandeira' },
        { key: 'adquirente', label: 'Adquirente', path: 'adquirente.nomeAdquirente' }
      ],
      columns: [
        { key: 'cnpj', label: 'CNPJ' },
        { key: 'adquirente', label: 'Adquirente', path: 'adquirente.nomeAdquirente' },
        { key: 'bandeira', label: 'Bandeira', path: 'bandeira.descricaoBandeira' },
        { key: 'produto', label: 'Produto', path: 'produto.descricaoProduto' },
        { key: 'modalidade', label: 'Subproduto', path: 'modalidade.descricaoModalidade' },
        { key: 'valorBruto', label: 'Valor Bruto', format: 'currency', className: 'green-global' },
        { key: 'valorLiquido', label: 'Valor Líquido', format: 'currency', className: 'green-global' },
        { key: 'taxa', label: 'Taxa', format: 'percent', className: 'red-global' },
        { key: 'valorDesconto', label: 'Valor Desconto', format: 'currency', className: 'red-global' },
        { key: 'nsu', label: 'NSU' },
        { key: 'dataVenda', label: 'Data Venda', format: 'date' },
        { key: 'horaVenda', label: 'Hora Venda', format: 'time' },
        { key: 'dataCredito', label: 'Data Crédito', format: 'date' },
        { key: 'codigoAutorizacao', label: 'Autorização' },
        { key: 'quantidadeParcelas', label: 'Parcelas' },
        { key: 'tid', label: 'TID' }
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
    credits: {
      dataKey: 'sales',
      title: 'Créditos',
      filters: [
        { key: 'bandeira', label: 'Bandeira', path: 'bandeira.descricaoBandeira' },
        { key: 'adquirente', label: 'Adquirente', path: 'adquirente.nomeAdquirente' }
      ],
      columns: [
        { key: 'cnpj', label: 'CNPJ' },
        { key: 'adquirente', label: 'Adquirente', path: 'adquirente.nomeAdquirente' },
        { key: 'bandeira', label: 'Bandeira', path: 'bandeira.descricaoBandeira' },
        { key: 'produto', label: 'Produto', path: 'produto.descricaoProduto' },
        { key: 'modalidade', label: 'Subproduto', path: 'modalidade.descricaoModalidade' },
        { key: 'valorBruto', label: 'Valor Bruto', format: 'currency', className: 'green-global' },
        { key: 'valorLiquido', label: 'Valor Líquido', format: 'currency', className: 'green-global' },
        { key: 'taxa', label: 'Taxa', format: 'percent', className: 'red-global' },
        { key: 'valorDesconto', label: 'Valor Desconto', format: 'currency', className: 'red-global' },
        { key: 'nsu', label: 'NSU' },
        { key: 'dataVenda', label: 'Data Venda', format: 'date' },
        { key: 'horaVenda', label: 'Hora Venda', format: 'time' },
        { key: 'dataCredito', label: 'Data Crédito', format: 'date' },
        { key: 'codigoAutorizacao', label: 'Autorização' },
        { key: 'quantidadeParcelas', label: 'Parcelas' },
        { key: 'tid', label: 'TID' }
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
    services: {
      dataKey: 'sales',
      title: 'Serviços',
      filters: [
        { key: 'servico', label: 'Serviço', path: 'descricao' },
        { key: 'adquirente', label: 'Adquirente', path: 'nome_adquirente' }
      ],
      columns: [
        { key: 'cnpj', label: 'CNPJ' },
        { key: 'data', label: 'Data', format: 'date' },
        { key: 'nome_adquirente', label: 'Adquirente' },
        { key: 'descricao', label: 'Serviço' },
        { key: 'valor', label: 'Valor', format: 'currency', className: 'red-global' },
        { key: 'razao_social', label: 'Razão Social' }
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

  const config = tableConfig[dataType]

  // Initialize data
  useEffect(() => {
    if (array && array[config.dataKey]) {
      setDataArray(array[config.dataKey])
      setDataToDisplay(array[config.dataKey])
      setFilteredData(array[config.dataKey])
    }
  }, [array, config.dataKey])

  // Extract available filter values
  useEffect(() => {
    if (dataArray.length > 0) {
      const newAvailableFilters = {}
      const newAllFilters = {}

      config.filters.forEach(filter => {
        const values = [...new Set(dataArray.map(item => {
          return filter.path ? getNestedValue(item, filter.path) : item[filter.key]
        }))].filter(Boolean).sort()

        newAvailableFilters[filter.key] = values
        newAllFilters[filter.key] = values
      })

      setAvailableFilters(newAvailableFilters)
      setAllFilters(newAllFilters)
      setFilters({})
    }
  }, [dataArray, config.filters])

  // Apply filters
  useEffect(() => {
    let filtered = dataArray

    // Apply each filter
    Object.keys(filters).forEach(filterKey => {
      if (filters[filterKey]) {
        const filterConfig = config.filters.find(f => f.key === filterKey)
        filtered = filtered.filter(item => {
          const value = filterConfig.path ? getNestedValue(item, filterConfig.path) : item[filterKey]
          return value === filters[filterKey]
        })
      }
    })

    setFilteredData(filtered)
    setCurrentPage(1)
  }, [filters, dataArray, config.filters])

  // Update available filters based on selections
  useEffect(() => {
    const newAvailableFilters = { ...allFilters }

    config.filters.forEach(filter => {
      if (Object.keys(filters).some(key => key !== filter.key && filters[key])) {
        let filteredData = dataArray

        // Apply other filters
        Object.keys(filters).forEach(otherFilterKey => {
          if (otherFilterKey !== filter.key && filters[otherFilterKey]) {
            const otherFilterConfig = config.filters.find(f => f.key === otherFilterKey)
            filteredData = filteredData.filter(item => {
              const value = otherFilterConfig.path ? getNestedValue(item, otherFilterConfig.path) : item[otherFilterKey]
              return value === filters[otherFilterKey]
            })
          }
        })

        const values = [...new Set(filteredData.map(item => {
          return filter.path ? getNestedValue(item, filter.path) : item[filter.key]
        }))].filter(Boolean).sort()

        newAvailableFilters[filter.key] = values
      } else {
        newAvailableFilters[filter.key] = allFilters[filter.key]
      }
    })

    setAvailableFilters(newAvailableFilters)
  }, [filters, dataArray, allFilters, config.filters])

  // Helper function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  // Helper function to format values
  const formatValue = (value, format) => {
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
  }

  // Pagination functions
  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredData.length / itemsPerPage)))
  }

  const goToFirstPage = () => {
    setCurrentPage(1)
  }

  const goToLastPage = () => {
    setCurrentPage(Math.ceil(filteredData.length / itemsPerPage))
  }

  const clearFilters = () => {
    setFilters({})
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <>
      <div className='dropShadow vendas-view'>
        <div className="table-header-responsive">
          <h3>{array.adminName} - {config.title}</h3>
          {config.filters.length > 0 && (
            <button 
              className="btn btn-sm btn-outline-primary filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filtros
            </button>
          )}
        </div>
        
        {/* Filters */}
        {config.filters.length > 0 && (
          <div className={`mobile-filters ${showFilters ? 'show' : ''}`}>
            {config.filters.map(filter => (
              <div key={filter.key} className="filter-group">
                <label>{filter.label}:</label>
                <select 
                  value={filters[filter.key] || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    [filter.key]: e.target.value || null
                  }))}
                  className="form-select form-select-sm"
                >
                  <option value="">Todos</option>
                  {availableFilters[filter.key]?.map((value, index) => (
                    <option key={index} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            ))}
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={clearFilters}
            >
              Limpar Filtros
            </button>
          </div>
        )}

        <hr className='hr-global'/>
        
        {/* Desktop Table */}
        <div className='table-wrapper desktop-table'>
          <table className='table table-striped table-hover det-table-global'>
            <thead>
              <tr className='det-tr-top-global'>
                {config.columns.map(column => (
                  <th key={column.key} className='det-th-global' scope="col">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index} className='det-tr-global'>
                  {config.columns.map(column => {
                    const value = column.path ? getNestedValue(item, column.path) : item[column.key]
                    const formattedValue = formatValue(value, column.format)
                    
                    return (
                      <td 
                        key={column.key} 
                        className='det-td-vendas-global'
                        data-label={column.label}
                      >
                        {column.className ? (
                          <span className={column.className}>{formattedValue}</span>
                        ) : (
                          formattedValue
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table> 
        </div>

        {/* Mobile Cards */}
        <div className="mobile-cards">
          {currentItems.map((item, index) => (
            <div key={index} className="sale-card">
              <div className="card-header">
                {config.mobileCards.slice(0, 2).map((field, idx) => {
                  const value = field.path ? getNestedValue(item, field.path) : item[field.key]
                  const formattedValue = formatValue(value, field.format)
                  
                  return field.badge ? (
                    <span key={field.key} className="badge">{formattedValue}</span>
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
      </div>
      
      <hr className='hr-global'/>
      
      {filteredData.length > itemsPerPage && (
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
            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
          >
            <FiChevronRight/>
          </button>
          <button
            className='btn btn-primary btn-global btn-skip'
            onClick={goToLastPage}
            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
          >
            <FiSkipForward />
          </button>
        </div>
      )}
      <hr className='hr-global'/>
    </>
  )
}

// Helper function to chunk array for mobile cards
const chunkArray = (array, size) => {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export default TabelaResponsiva