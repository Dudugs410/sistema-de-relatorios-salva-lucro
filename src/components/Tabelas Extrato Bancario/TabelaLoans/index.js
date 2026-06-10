import '../tableNoChildren.scss'
import '../TabelaAccounts/subtable.scss'
import { useState } from "react"

const TabelaLoans = ({ data, clickRow }) => {
  const [expandedRow, setExpandedRow] = useState(null)

  // Function to check if a value is an ISO date string
  const isISODate = (value) => {
    if (typeof value !== 'string') return false
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)
  }

  // Function to format ISO date to Brazilian format
  const formatToBrazilianDateTime = (isoString) => {
    try {
      const date = new Date(isoString)
      if (isNaN(date.getTime())) return isoString
      
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    } catch {
      return isoString
    }
  }

  // Function to format date only (without time)
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString)
      if (isNaN(date.getTime())) return isoString
      
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      
      return `${day}/${month}/${year}`
    } catch {
      return isoString
    }
  }

  // Function to format currency values
  const formatCurrency = (value, currencyCode) => {
    if (value === undefined || value === null || isNaN(Number(value))) {
      return '-'
    }

    const numericValue = Number(value)
    
    if (currencyCode === 'BRL') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(numericValue)
    }
    
    // Default formatting for other currencies
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue)
  }

  // Define the headers and their corresponding data properties
  const headers = [
    { key: 'CET', label: 'CET' },
    { key: 'amortizationScheduled', label: 'Amortização Agendada', isMoney: true },
    { key: 'amortizationScheduledAdditionalInfo', label: 'Info Adicional Amortização' },
    { key: 'cnpjConsignee', label: 'CNPJ Consignado' },
    { key: 'contractAmount', label: 'Valor do Contrato', isMoney: true },
    { key: 'contractNumber', label: 'Número do Contrato' },
    { key: 'createdAt', label: 'Criado Em', isDate: true },
    { key: 'currencyCode', label: 'Moeda' },
    { key: 'date', label: 'Data', isDate: true },
    { key: 'disbursementDates', label: 'Datas do Desembolso', isDate: true },
    { key: 'dueDate', label: 'Data Limite', isDate: true },
    { key: 'firstInstallmentDueDate', label: 'Data Primeira Parcela', isDate: true },
    { key: 'installmentPeriodicity', label: 'Periodicidade da Parcela' },
    { key: 'installmentPeriodicityAdditionalInfo', label: 'Info Adicional Parcela' },
    { key: 'productName', label: 'Nome do Produto' },
    { key: 'settlementDate', label: 'Data do Acordo', isDate: true },
    { key: 'type', label: 'Tipo' },
    { key: 'updatedAt', label: 'Atualizado Em', isDate: true },
  ]

  const toggleRow = (row) => {
    const rowId = row.id || row.contractNumber
    const isExpanding = expandedRow !== rowId
    
    setExpandedRow(isExpanding ? rowId : null)
    
    if (clickRow) {
      clickRow(row)
    }
  }

  // Mobile Card View Component
  const MobileCardView = () => {
    return (
      <div className="mobile-card-view">
        {data.map((row, index) => {
          const rowId = row.id || row.contractNumber || index
          const isExpanded = expandedRow === rowId
          
          return (
            <div 
              key={rowId} 
              className={`mobile-card ${isExpanded ? 'mobile-card-expanded' : ''} touch-feedback`}
              onClick={() => toggleRow(row)}
            >
              <div className="card-header">
                <div className="card-title">
                  <h4>{row.productName || 'Empréstimo'}</h4>
                  <p className="card-subtitle">{row.type || 'N/A'}</p>
                </div>
                <button 
                  className="expand-button touch-feedback"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleRow(row)
                  }}
                  aria-label={isExpanded ? "Recolher" : "Expandir"}
                >
                  <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`} />
                </button>
              </div>
              
              <div className="card-content">
                <div className="card-field">
                  <span className="label">Valor do Contrato:</span>
                  <span className="value">{formatCurrency(row.contractAmount, row.currencyCode)}</span>
                </div>
                <div className="card-field">
                  <span className="label">Número do Contrato:</span>
                  <span className="value">{row.contractNumber || '-'}</span>
                </div>
                <div className="card-field">
                  <span className="label">CET:</span>
                  <span className="value">{row.CET || '-'}</span>
                </div>
                <div className="card-field">
                  <span className="label">Data Limite:</span>
                  <span className="value">{row.dueDate ? formatDate(row.dueDate) : '-'}</span>
                </div>
              </div>
              
              {isExpanded && (
                <div 
                  className="card-expanded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mobile-details-container">
                    <h5 className="mobile-subheader">Detalhes do Empréstimo</h5>
                    
                    <div className="detail-item">
                      <span className="detail-label">Produto: </span>
                      <span className="detail-value">{row.productName || '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Tipo:  </span>
                      <span className="detail-value">{row.type || '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Valor do Contrato: </span>
                      <span className="detail-value">{formatCurrency(row.contractAmount, row.currencyCode)}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Número do Contrato:  </span>
                      <span className="detail-value">{row.contractNumber || '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">CET: </span>
                      <span className="detail-value">{row.CET || '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Amortização Agendada:  </span>
                      <span className="detail-value">{formatCurrency(row.amortizationScheduled, row.currencyCode)}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">CNPJ Consignado: </span>
                      <span className="detail-value">{row.cnpjConsignee || '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Moeda: </span>
                      <span className="detail-value">{row.currencyCode || '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Data:  </span>
                      <span className="detail-value">{row.date ? formatToBrazilianDateTime(row.date) : '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Data Limite: </span>
                      <span className="detail-value">{row.dueDate ? formatToBrazilianDateTime(row.dueDate) : '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Data Primeira Parcela: </span>
                      <span className="detail-value">{row.firstInstallmentDueDate ? formatToBrazilianDateTime(row.firstInstallmentDueDate) : '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Periodicidade da Parcela:  </span>
                      <span className="detail-value">{row.installmentPeriodicity || '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Data do Acordo:  </span>
                      <span className="detail-value">{row.settlementDate ? formatToBrazilianDateTime(row.settlementDate) : '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Criado Em: </span>
                      <span className="detail-value">{row.createdAt ? formatToBrazilianDateTime(row.createdAt) : '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Atualizado Em: </span>
                      <span className="detail-value">{row.updatedAt ? formatToBrazilianDateTime(row.updatedAt) : '-'}</span>
                    </div>
                    
                    {row.amortizationScheduledAdditionalInfo && (
                      <div className="detail-item">
                        <span className="detail-label">Info Adicional Amortização:  </span>
                        <span className="detail-value">{row.amortizationScheduledAdditionalInfo}</span>
                      </div>
                    )}
                    
                    {row.installmentPeriodicityAdditionalInfo && (
                      <div className="detail-item">
                        <span className="detail-label">Info Adicional Parcela:  </span>
                        <span className="detail-value">{row.installmentPeriodicityAdditionalInfo}</span>
                      </div>
                    )}
                    
                    {row.disbursementDates && (
                      <div className="detail-item">
                        <span className="detail-label">Datas do Desembolso: </span>
                        <span className="detail-value">{row.disbursementDates ? formatToBrazilianDateTime(row.updatedAt) : '-'}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className='dropShadow vendas-view'>
      {/* Desktop Table */}
      <div className='table-wrapper desktop-only'>
        <table className='table table-no-children table-striped table-hover det-table-global'>
          <thead>
            <tr className='det-tr-top-global'>
              {headers.map(header => (
                <th className='det-th-global' key={header.key}>
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                className='det-tr-global row-pluggy' 
                key={row.id || index}
                onClick={() => clickRow?.(row)}
              >
                {headers.map(header => {
                  const value = row[header.key]
                  const currencyCode = row.currencyCode
                  
                  let displayValue = '-'
                  
                  if (value !== undefined && value !== null) {
                    if (header.isDate && isISODate(value)) {
                      displayValue = formatToBrazilianDateTime(value)
                    } else if (header.isMoney) {
                      displayValue = formatCurrency(value, currencyCode)
                    } else {
                      displayValue = value
                    }
                  }
                  
                  return (
                    <td className='det-td-vendas-global' key={`${row.id || index}-${header.key}`}>
                      {displayValue}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Card View */}
      <div className='mobile-only'>
        <MobileCardView />
      </div>
    </div>
  )
}

export default TabelaLoans