import { useState, useMemo, useEffect } from 'react'
import {
  FiPlus,
  FiEdit,
  FiCreditCard,
  FiTrash2,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiSearch,
  FiX,
  FiAlertTriangle
} from 'react-icons/fi'
import ListaDomicilios from '../../components/ListaDomicilios'
import ModalDomicilio from '../../components/ModalDomicilio'
import './TabelaBancos.scss'

function ListaDomiciliosWrapper({ banco }) {
  const [addOpen, setAddOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreated = () => setRefreshKey((key) => key + 1)

  return (
    <>
      <ListaDomicilios banco={banco} refreshKey={refreshKey} onAddClick={() => setAddOpen(true)} />
      <ModalDomicilio
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        banco={banco}
        onCreated={handleCreated}
      />
    </>
  )
}

const TabelaBancos = ({ 
  banksList, 
  selectedClient, 
  onRefresh, 
  onGoBack, 
  onAddBank, 
  onEditBank, 
  onDeleteBank
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState('all')
  const itemsPerPage = 15

  const [bankToDelete, setBankToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [domicilioModalOpen, setDomicilioModalOpen] = useState(false)
  const [selectedBankForDomicilio, setSelectedBankForDomicilio] = useState(null)

  const filterOptions = [
    { value: 'all', label: 'Todos os campos' },
    { value: 'CODIGO', label: 'Código' },
    { value: 'CODIGOBANCO', label: 'Código Banco' },
    { value: 'NOME', label: 'Nome do Banco' },
    { value: 'NOMECEDENTE', label: 'Nome Cedente' },
    { value: 'CNPJCEDENTE', label: 'CNPJ Cedente' },
    { value: 'CODIGOAGENCIA', label: 'Agência' },
    { value: 'NUMEROCONTA', label: 'Conta' },
    { value: 'CARTEIRA', label: 'Carteira' },
  ]

  const filteredBanks = useMemo(() => {
    if (!banksList || banksList.length === 0) return []
    
    if (!searchTerm.trim()) return banksList
    
    const term = searchTerm.toLowerCase().trim()
    
    const searchableFields = filterOptions.filter((option) => option.value !== 'all').map((option) => option.value)
    const matches = (bank, field) => String(bank[field] ?? '').toLowerCase().includes(term)

    return banksList.filter((bank) =>
      searchField === 'all'
        ? [...searchableFields, 'CLICODIGO'].some((field) => matches(bank, field))
        : matches(bank, searchField)
    )
  }, [banksList, searchTerm, searchField])

  const totalPages = Math.ceil(filteredBanks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBanks = filteredBanks.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, searchField, banksList])

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

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handleEdit = (bank) => {
    if (onEditBank) onEditBank(bank)
  }

  const handleViewCards = (bank) => {
    setSelectedBankForDomicilio(bank)
    setDomicilioModalOpen(true)
  }

  const closeDomicilioModal = () => {
    setDomicilioModalOpen(false)
    setSelectedBankForDomicilio(null)
  }

  const handleDeleteClick = (bank) => {
    setBankToDelete(bank)
  }

  const handleDeleteConfirm = async () => {
    if (!bankToDelete) return

    setIsDeleting(true)
    try {
      await onDeleteBank(bankToDelete)
      setBankToDelete(null)
    } catch (error) {
      console.error('Error deleting bank:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setBankToDelete(null)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSearchField('all')
  }

  if (banksList.length === 0) {
    return (
      <div className="tabela-bancos-container">
        <div className="tabela-bancos-header">
          <div className="header-info">
            <h3 className="subtitle">
              Cliente: {selectedClient?.label || 'Não selecionado'}
            </h3>
            <span className="bank-count">Total de bancos: 0</span>
          </div>
          <div className="header-actions">
            <button className="btn btn-add" onClick={onAddBank}>
              <FiPlus className="icon" /> Adicionar Banco
            </button>
            <button className="btn btn-refresh" onClick={onRefresh}>
              <FiRefreshCw className="icon" /> Atualizar
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
              <FiPlus className="icon" /> Adicionar Banco
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
      <div className="tabela-bancos-header">
        <div className="header-info">
          <h3 className="subtitle">
            Cliente: {selectedClient?.label || 'Não selecionado'}
          </h3>
          <span className="bank-count">
            Total de bancos: {filteredBanks.length}
            {banksList.length !== filteredBanks.length && ` (${banksList.length} total)`}
          </span>
        </div>
        <div className="header-actions">
          <button className="btn btn-add" onClick={onAddBank}>
            <FiPlus className="icon" /> Adicionar Banco
          </button>
          <button className="btn btn-refresh" onClick={onRefresh}>
            <FiRefreshCw className="icon" /> Atualizar
          </button>
        </div>
      </div>

      <hr className="hr-global" />

      <div className="tabela-bancos-search">
        <div className="search-group">
          <div className="search-field">
            <label>Buscar em:</label>
            <select 
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="search-select"
            >
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="btn-clear-search" onClick={clearSearch}>
                <FiX />
              </button>
            )}
          </div>
        </div>
      </div>

      <hr className="hr-global" />

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
                      title="Ver domicílios bancários"
                    >
                      <FiCreditCard />
                    </button>
                    <button 
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteClick(bank)}
                      title="Excluir banco"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
                <td className="col-cliente">{selectedClient?.label || 'N/A'}</td>
                <td className="col-codigo">{bank.CODIGOBANCO || 'N/A'}</td>
                <td className="col-nome-banco">{bank.NOME || 'N/A'}</td>
                <td className="col-conta">
                  {bank.NUMEROCONTA || 'N/A'}
                  {bank.DIGITOCONTA && `-${bank.DIGITOCONTA}`}
                  {bank.CODIGOAGENCIA && ` (Ag: ${bank.CODIGOAGENCIA})`}
                </td>
                <td className="col-cnpj">{formatCNPJ(bank.CNPJCEDENTE)}</td>
                <td className="col-razao-social">{bank.NOMECEDENTE || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="tabela-bancos-pagination">
          <div className="pagination-info">
            Mostrando {startIndex + 1} - {Math.min(endIndex, filteredBanks.length)} de {filteredBanks.length} bancos
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

      <div className='floating-button-container'>
        <button className='btn-floating-new-search' onClick={onGoBack}>
          <span className='floating-button-icon'>🔍</span>
          <span className='floating-button-text'>Nova Consulta</span>
        </button>
      </div>

      {bankToDelete && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-container modal-container-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmar Exclusão</h2>
              <button className="modal-close" onClick={handleDeleteCancel}>
                <FiX />
              </button>
            </div>

            <div className="modal-body-confirm">
              <div className="confirm-icon">
                <FiAlertTriangle />
              </div>
              <p className="confirm-message">
                Tem certeza que deseja excluir este banco?
              </p>
              <div className="confirm-details">
                <div className="confirm-detail-row">
                  <span className="detail-label">Banco:</span>
                  <span className="detail-value">
                    {bankToDelete.CODIGOBANCO} - {bankToDelete.NOME}
                  </span>
                </div>
                <div className="confirm-detail-row">
                  <span className="detail-label">Cedente:</span>
                  <span className="detail-value">{bankToDelete.NOMECEDENTE || 'N/A'}</span>
                </div>
                <div className="confirm-detail-row">
                  <span className="detail-label">Agência:</span>
                  <span className="detail-value">{bankToDelete.CODIGOAGENCIA || 'N/A'}</span>
                </div>
                <div className="confirm-detail-row">
                  <span className="detail-label">Conta:</span>
                  <span className="detail-value">
                    {bankToDelete.NUMEROCONTA || 'N/A'}
                    {bankToDelete.DIGITOCONTA && `-${bankToDelete.DIGITOCONTA}`}
                  </span>
                </div>
              </div>
              <p className="confirm-warning">
                Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-cancel" 
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-delete-confirm" 
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {domicilioModalOpen && selectedBankForDomicilio && (
        <div className="modal-overlay" onClick={closeDomicilioModal}>
          <div
            className="modal-container"
            style={{ maxWidth: '960px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                Domicílios — {selectedBankForDomicilio.NOME || selectedBankForDomicilio.CODIGOBANCO}
              </h2>
              <button className="modal-close" onClick={closeDomicilioModal}>
                <FiX />
              </button>
            </div>
            <div style={{ padding: '0 24px 24px' }}>
              <ListaDomiciliosWrapper banco={selectedBankForDomicilio} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TabelaBancos