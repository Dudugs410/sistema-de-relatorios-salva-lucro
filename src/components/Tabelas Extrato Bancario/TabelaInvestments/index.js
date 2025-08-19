import React, { useState } from "react";
import '../TabelaAccounts/subtable.scss'

const TabelaInvestments = ({ data, clickRow, loadTransactions }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [loadingTransactions, setLoadingTransactions] = useState({});
  const [transactionsData, setTransactionsData] = useState({});
  const [error, setError] = useState(null);

  const toggleRow = async (row) => {
    const rowId = row.id;
    const isExpanding = expandedRow !== rowId;
    
    setExpandedRow(isExpanding ? rowId : null);
    
    if (clickRow) {
      clickRow(row);
      localStorage.setItem('investmentID', row.id); // Store investment ID
    }

    if (isExpanding && !transactionsData[rowId]) {
      try {
        setLoadingTransactions(prev => ({ ...prev, [rowId]: true }));
        setError(null);
        
        const transactions = await loadTransactions(rowId);
        setTransactionsData(prev => ({ ...prev, [rowId]: transactions.results }));
      } catch (err) {
        console.error('Error loading transactions:', err);
        setError('Failed to load transactions data. Please try again.');
      } finally {
        setLoadingTransactions(prev => ({ ...prev, [rowId]: false }));
      }
    }
  };

  const isISODate = (value) => {
    if (typeof value !== 'string') return false;
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value);
  };

  const formatToBrazilianDateTime = (isoString) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } catch {
      return isoString;
    }
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch {
      return isoString;
    }
  };

  const formatCurrency = (value, currencyCode) => {
    if (value === undefined || value === null || isNaN(Number(value))) {
      return '-';
    }

    const numericValue = Number(value);
    
    if (currencyCode === 'BRL') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(numericValue);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
  };

  const headers = [
    { key: 'balance', label: 'Saldo', isMoney: true },
    { key: 'currencyCode', label: 'Moeda' },
    { key: 'name', label: 'Nome' },
    { key: 'owner', label: 'Titular' },
    { key: 'type', label: 'Tipo' },
    { key: 'subtype', label: 'Subtipo' },
    { key: 'lastMonthRate', label: 'Mês Passado', isPercentage: true },
    { key: 'lastTwelveMonthsRate', label: '12 Meses', isPercentage: true },
    { key: 'annualRate', label: 'Anual', isPercentage: true },
    { key: 'createdAt', label: 'Criado Em', isDate: true },
    { key: 'updatedAt', label: 'Atualizado Em', isDate: true },
  ];

  const transactionTypes = {
    'BUY': 'Compra',
    'SELL': 'Venda',
    'DIVIDEND': 'Dividendo',
    'INTEREST': 'Juros',
    'OTHER': 'Outro'
  };

  const movementTypes = {
    'CREDIT': 'Crédito',
    'DEBIT': 'Débito'
  };

  const formatPercentage = (value) => {
    if (value === undefined || value === null || isNaN(Number(value))) {
      return '-';
    }
    return `${Number(value).toFixed(2)}%`;
  };

  const renderTransactionDetails = (transaction) => {
    if (!transaction) return <div className="p-3 text-muted">Nenhuma transação disponível</div>;

    return (
      <div className="p-3" style={{ backgroundColor: 'rgba(0,0,0,0.03)', width: '100%' }}>
        <div className="mb-3">
          <h5 style={{ fontSize: '16px', fontWeight: '600' }}>Detalhes da Transação</h5>
          <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
            <div className="col-md-4 p-2">
              <p className="mb-1"><strong>Tipo:</strong> {transactionTypes[transaction.type] || transaction.type}</p>
            </div>
            <div className="col-md-4 p-2">
              <p className="mb-1"><strong>Movimentação:</strong> {movementTypes[transaction.movementType] || transaction.movementType}</p>
            </div>
            <div className="col-md-4 p-2">
              <p className="mb-1"><strong>Valor:</strong> {formatCurrency(transaction.amount, 'BRL')}</p>
            </div>
          </div>
          
          <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
            <div className="col-md-4 p-2">
              <p className="mb-1"><strong>Data:</strong> {formatDate(transaction.date)}</p>
            </div>
            <div className="col-md-4 p-2">
              <p className="mb-1"><strong>Quantidade:</strong> {transaction.quantity || '-'}</p>
            </div>
            <div className="col-md-4 p-2">
              <p className="mb-1"><strong>Valor Unitário:</strong> {transaction.value ? formatCurrency(transaction.value, 'BRL') : '-'}</p>
            </div>
          </div>
          
          <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
            <div className="col-md-12 p-2">
              <p className="mb-1"><strong>Descrição:</strong> {transaction.description || '-'}</p>
            </div>
          </div>
        </div>

        <div className="row mt-3" style={{ marginLeft: 0, marginRight: 0 }}>
          <div className="col-md-6 p-2">
            <p className="mb-1"><small className="text-muted">ID: {transaction.id}</small></p>
          </div>
          <div className="col-md-6 p-2">
            <p className="mb-1"><small className="text-muted">Data da operação: {formatToBrazilianDateTime(transaction.tradeDate)}</small></p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='dropShadow vendas-view'>
      {error && (
        <div className="alert alert-danger mb-3">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <div className='table-wrapper'>
        <table className='table table-striped table-hover det-table-global'>
          <thead>
            <tr className='det-tr-top-global'>
              <th className='det-th-global' style={{ width: '40px' }}></th>
              {headers.map(header => (
                <th className='det-th-global' key={header.key}>
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const rowId = row.id || index;
              const isExpanded = expandedRow === rowId;
              const isLoading = loadingTransactions[rowId];
              const transactions = transactionsData[rowId];
              
              return (
                <React.Fragment key={rowId}>
                  <tr
                    className='det-tr-global row-pluggy' 
                    key={rowId}
                    onClick={() => toggleRow(row)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className='det-td-vendas-global'>
                      {isLoading ? (
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'}`} />
                      )}
                    </td>
                    {headers.map(header => {
                      const value = row[header.key];
                      const currencyCode = row.currencyCode;
                      
                      let displayValue = '-';
                      
                      if (value !== undefined && value !== null) {
                        if (header.isDate && isISODate(value)) {
                          displayValue = formatToBrazilianDateTime(value);
                        } else if (header.isMoney) {
                          displayValue = formatCurrency(value, currencyCode);
                        } else if (header.isPercentage) {
                          displayValue = formatPercentage(value);
                        } else {
                          displayValue = value;
                        }
                      }
                      
                      return (
                        <td className='det-td-vendas-global' key={`${rowId}-${header.key}`}>
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                  {isExpanded && (
                    <tr className="det-tr-global">
                      <td colSpan={headers.length + 1} className="p-0 subtable">
                        <div style={{ width: '100%' }}>
                          {isLoading ? (
                            <div className="p-3 text-center">
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              <p className="mt-2">Carregando transações...</p>
                            </div>
                          ) : (
                            transactions && transactions.length > 0 ? 
                              transactions.map((transaction, index) => (
                                <div key={transaction.id || index}>
                                  {renderTransactionDetails(transaction)}
                                  {index < transactions.length - 1 && <hr className="my-3" />}
                                </div>
                              ))
                              : renderTransactionDetails(null)
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaInvestments;