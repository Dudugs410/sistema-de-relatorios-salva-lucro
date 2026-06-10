import '../tableNoChildren.scss'
import { useState } from "react"

const TabelaIdentity = ({ data, clickRow }) => {
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

  // Define the headers and their corresponding data properties
  const headers = [
    { key: 'fullName', label: 'Nome' },
    { key: 'birthDate', label: 'Data de Nascimento', isDate: true },
    { key: 'document', label: 'Documento' },
    { key: 'documentType', label: 'Tipo de Documento' },
    { key: 'jobTitle', label: 'Profissão' },
    { key: 'companyName', label: 'Nome da Empresa' },
    { key: 'createdAt', label: 'Criado Em', isDate: true },
    { key: 'updatedAt', label: 'Atualizado Em', isDate: true },
  ]

  // Convert data to array if it's a single object
  const dataArray = data ? (Array.isArray(data) ? data : [data]) : []

  const toggleRow = (row) => {
    const rowId = row.id || row.document
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
        {dataArray.map((row, index) => {
          const rowId = row.id || row.document || index
          const isExpanded = expandedRow === rowId
          
          return (
            <div 
              key={rowId} 
              className={`mobile-card ${isExpanded ? 'mobile-card-expanded' : ''} touch-feedback`}
              onClick={() => toggleRow(row)}
            >
              <div className="card-header">
                <div className="card-title">
                  <h4>{row.fullName || 'Identidade'}</h4>
                  <p className="card-subtitle">{row.documentType || 'N/A'}</p>
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
                  <span className="label">Documento:  </span>
                  <span className="value">{row.document || '-'}</span>
                </div>
                <div className="card-field">
                  <span className="label">Data de Nascimento: </span>
                  <span className="value">{row.birthDate ? formatDate(row.birthDate) : '-'}</span>
                </div>
                <div className="card-field">
                  <span className="label">Profissão:  </span>
                  <span className="value">{row.jobTitle || '-'}</span>
                </div>
                <div className="card-field">
                  <span className="label">Empresa:  </span>
                  <span className="value">{row.companyName || '-'}</span>
                </div>
              </div>
              
              {isExpanded && (
                <div 
                  className="card-expanded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mobile-details-container">
                    <h5 className="mobile-subheader">Detalhes Completos</h5>
                    
                    <div className="detail-item">
                      <span className="detail-label">Nome Completo: </span>
                      <span className="detail-value">{row.fullName || '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Data de Nascimento:  </span>
                      <span className="detail-value">{row.birthDate ? formatDate(row.birthDate) : '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Documento: </span>
                      <span className="detail-value">{row.document || '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Tipo de Documento: </span>
                      <span className="detail-value">{row.documentType || '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Profissão: </span>
                      <span className="detail-value">{row.jobTitle || '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Empresa: </span>
                      <span className="detail-value">{row.companyName || '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Criado Em: </span>
                      <span className="detail-value">{row.createdAt ? formatToBrazilianDateTime(row.createdAt) : '-'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Atualizado Em: </span>
                      <span className="detail-value">{row.updatedAt ? formatToBrazilianDateTime(row.updatedAt) : '-'}</span>
                    </div>
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
            {dataArray.map((row, index) => (
              <tr
                className='det-tr-global row-pluggy' 
                key={row.id || index}
                onClick={() => clickRow?.(row)}
              >
                {headers.map(header => {
                  const value = row[header.key]
                  
                  let displayValue = '-'
                  
                  if (value !== undefined && value !== null) {
                    if (header.isDate && isISODate(value)) {
                      displayValue = formatToBrazilianDateTime(value)
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

export default TabelaIdentity