// TabelaBancos.jsx
import { useState, useMemo, useEffect } from 'react'
import { FiPlus, FiEdit, FiCreditCard, FiRefreshCw, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import './TabelaBancos.scss'

const TabelaBancos = ({ 
  banksList, 
  selectedClient, 
  onRefresh, 
  onGoBack, 
  onAddBank, 
  onEditBank, 
  onViewCards 
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const itemsPerPage = 15

  // Check screen size for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Pagination logic
  const totalPages = Math.ceil(banksList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBanks = banksList.slice(startIndex, endIndex)

  // Reset to first page when banks list changes
  useMemo(() => {
    setCurrentPage(1)
  }, [banksList])

  // Get visible page numbers (max 3 backward, 3 forward)
  const getVisiblePages = () => {
    const visiblePages = []
    
    let startPage = Math.max(1, currentPage - 3)
    let endPage = Math.min(totalPages, currentPage + 3)
    
    if (currentPage <= 4) {
      endPage = Math.min(totalPages, 7)
    }
    
    if (currentPage > totalPages - 3) {
      startPage = Math.max(1, totalPages - 6)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i)
    }
    
    return visiblePages
  }

  // Format CNPJ helper
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

  // Handle page change
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Handle first page
  const goToFirstPage = () => {
    setCurrentPage(1)
  }

  // Handle last page
  const goToLastPage = () => {
    setCurrentPage(totalPages)
  }

  // Handle previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Handle next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Handle edit bank
  const handleEdit = (bank) => {
    if (onEditBank) {
      onEditBank(bank)
    }
  }

  // Handle view cards
  const handleViewCards = (bank) => {
    if (onViewCards) {
      onViewCards(bank)
    }
  }

  // If no banks found, show empty state
  if (banksList.length === 0) {
    return (
      <div className="tabela-bancos-container">
        <div className="tabela-bancos-header">
          <div className="header-info">
            <h3 className="subtitle">
              Cliente: {selectedClient?.label || 'Não selecionado'}
            </h3>
            <span className="bank-count">
              Total de bancos: 0
            </span>
          </div>
          <div className="header-actions">
            <button className="btn btn-add" onClick={onAddBank}>
              <FiPlus className="icon" />
              Adicionar Banco
            </button>
            <button className="btn btn-refresh" onClick={onRefresh}>
              <FiRefreshCw className="icon" />
              Atualizar
            </button>
          </div>
        </div>

        <hr className="hr-global" />

        <div className="tabela-bancos-empty">
          <div className="empty-state">
            <span className="empty-icon">🏦</span>
            <h4>Nenhum banco encontrado</h4>
            <p>Não há bancos cadastrados para o cliente selecionado</p>
            <button className="btn btn-add-empty" onClick={onAddBank}>
              <FiPlus className="icon" />
              Adicionar Banco
            </button>
          </div>
        </div>

        <div className='floating-button-container'>
          <button className='btn-floating-new-search' onClick={onGoBack}>
            <span className='floating-button-icon'>🔍</span>
            <span className='floating-button-text'>Nova Consulta</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="tabela-bancos-container">
      {/* Header */}
      <div className="tabela-bancos-header">
        <div className="header-info">
          <h3 className="subtitle">
            Cliente: {selectedClient?.label || 'Não selecionado'}
          </h3>
          <span className="bank-count">
            Total de bancos: {banksList.length}
          </span>
        </div>
        <div className="header-actions">
          <button className="btn btn-add" onClick={onAddBank}>
            <FiPlus className="icon" />
            Adicionar Banco
          </button>
          <button className="btn btn-refresh" onClick={onRefresh}>
            <FiRefreshCw className="icon" />
            Atualizar
          </button>
        </div>
      </div>

      <hr className="hr-global" />

      {/* Desktop Table View */}
      {!isMobile ? (
        <div className="tabela-bancos-wrapper">
          <table className="tabela-bancos">
            <thead>
              <tr>
                <th className="col-actions">Ações</th>
                <th>Cliente</th>
                <th>Código</th>
                <th>Nome do Banco</th>
                <th>Conta</th>
                <th>CNPJ</th>
                <th>Razão Social</th>
              </tr>
            </thead>
            <tbody>
              {currentBanks.map((bank, index) => (
                <tr key={bank.CODIGO || index}>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(bank)}
                        title="Editar banco"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="btn-action btn-cards"
                        onClick={() => handleViewCards(bank)}
                        title="Ver cartões"
                      >
                        <FiCreditCard />
                      </button>
                    </div>
                  </td>
                  <td className="col-cliente">
                    {selectedClient?.label || 'N/A'}
                  </td>
                  <td className="col-codigo">
                    {bank.CODIGOBANCO || 'N/A'}
                  </td>
                  <td className="col-nome-banco">
                    {bank.NOME || 'N/A'}
                  </td>
                  <td className="col-conta">
                    {bank.NUMEROCONTA || 'N/A'}
                    {bank.DIGITOCONTA && `-${bank.DIGITOCONTA}`}
                    {bank.CODIGOAGENCIA && ` (Ag: ${bank.CODIGOAGENCIA})`}
                  </td>
                  <td className="col-cnpj">
                    {formatCNPJ(bank.CNPJCEDENTE)}
                  </td>
                  <td className="col-razao-social">
                    {bank.NOMECEDENTE || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Mobile Card View */
        <div className="tabela-bancos-cards">
          {currentBanks.map((bank, index) => (
            <div key={bank.CODIGO || index} className="bank-card">
              <div className="bank-card-header">
                <div className="bank-card-title">
                  <span className="bank-card-code">{bank.CODIGOBANCO || 'N/A'}</span>
                  <span className="bank-card-name">{bank.NOME || 'N/A'}</span>
                </div>
                <div className="bank-card-actions">
                  <button 
                    className="btn-action btn-edit"
                    onClick={() => handleEdit(bank)}
                    title="Editar banco"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    className="btn-action btn-cards"
                    onClick={() => handleViewCards(bank)}
                    title="Ver cartões"
                  >
                    <FiCreditCard />
                  </button>
                </div>
              </div>
              <div className="bank-card-body">
                <div className="bank-card-row">
                  <span className="bank-card-label">Cliente:</span>
                  <span className="bank-card-value">{selectedClient?.label || 'N/A'}</span>
                </div>
                <div className="bank-card-row">
                  <span className="bank-card-label">Conta:</span>
                  <span className="bank-card-value">
                    {bank.NUMEROCONTA || 'N/A'}
                    {bank.DIGITOCONTA && `-${bank.DIGITOCONTA}`}
                    {bank.CODIGOAGENCIA && ` (Ag: ${bank.CODIGOAGENCIA})`}
                  </span>
                </div>
                <div className="bank-card-row">
                  <span className="bank-card-label">CNPJ:</span>
                  <span className="bank-card-value">{formatCNPJ(bank.CNPJCEDENTE)}</span>
                </div>
                <div className="bank-card-row">
                  <span className="bank-card-label">Razão Social:</span>
                  <span className="bank-card-value">{bank.NOMECEDENTE || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="tabela-bancos-pagination">
          <div className="pagination-info">
            Mostrando {startIndex + 1} - {Math.min(endIndex, banksList.length)} de {banksList.length} bancos
          </div>
          <div className="pagination-controls">
            <button 
              className="btn-pagination btn-pagination-icon"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              title="Primeira página"
            >
              <FiChevronsLeft />
            </button>
            
            <button 
              className="btn-pagination btn-pagination-icon"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              title="Página anterior"
            >
              <FiChevronLeft />
            </button>
            
            <div className="pagination-pages">
              {getVisiblePages().map(page => (
                <button
                  key={page}
                  className={`btn-page ${page === currentPage ? 'active' : ''}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button 
              className="btn-pagination btn-pagination-icon"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              title="Próxima página"
            >
              <FiChevronRight />
            </button>
            
            <button 
              className="btn-pagination btn-pagination-icon"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              title="Última página"
            >
              <FiChevronsRight />
            </button>
          </div>
        </div>
      )}

      {/* Floating button to go back */}
      <div className='floating-button-container'>
        <button className='btn-floating-new-search' onClick={onGoBack}>
          <span className='floating-button-icon'>🔍</span>
          <span className='floating-button-text'>Nova Consulta</span>
        </button>
      </div>
    </div>
  )
}

export default TabelaBancos