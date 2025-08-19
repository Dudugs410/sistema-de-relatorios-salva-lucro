import React, { useState } from "react";
import './subtable.scss'

const TabelaAccounts = ({ data, clickRow, loadBills, loadTransactions }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [loadingData, setLoadingData] = useState({});
  const [billsData, setBillsData] = useState({});
  const [transactionsData, setTransactionsData] = useState({});
  const [activeTab, setActiveTab] = useState({});
  const [error, setError] = useState(null);

  const toggleRow = async (row) => {
    const rowId = row.id;
    const isExpanding = expandedRow !== rowId;
    
    setExpandedRow(isExpanding ? rowId : null);
    setActiveTab(prev => ({ ...prev, [rowId]: isExpanding ? 'bills' : null }));
    
    if (clickRow) clickRow(row);

    if (isExpanding) {
      try {
        setLoadingData(prev => ({ ...prev, [rowId]: true }));
        setError(null);
        
        // Load both bills and transactions
        const [bills, transactions] = await Promise.all([
          loadBills(rowId),
          loadTransactions(rowId)
        ]);

        setBillsData(prev => ({ ...prev, [rowId]: bills }));
        setTransactionsData(prev => ({ ...prev, [rowId]: transactions }));
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoadingData(prev => ({ ...prev, [rowId]: false }));
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
    { key: 'createdAt', label: 'Criado Em', isDate: true },
    { key: 'marketingName', label: 'Nome Fantasia' },
    { key: 'number', label: 'Número' },
    { key: 'subtype', label: 'Subtipo' },
    { key: 'taxNumber', label: 'Número Taxa' },
    { key: 'type', label: 'Tipo' },
    { key: 'updatedAt', label: 'Atualizado Em', isDate: true },
  ];

  const financeChargeTypes = {
    'LATE_PAYMENT_FEE': 'Multa por atraso',
    'IOF': 'IOF',
    'INTEREST': 'Juros',
    'OTHER': 'Outro'
  };

  const transactionTypes = {
    'SELL': 'Venda',
    'BUY': 'Compra',
    'DIVIDEND': 'Dividendo',
    'INTEREST': 'Juros',
    // Add more types as needed
  };

  const movementTypes = {
    'DEBIT': 'Débito',
    'CREDIT': 'Crédito',
    // Add more types as needed
  };

  const renderBillDetails = (bill) => {
    if (!bill) return <div className="p-3 text-muted">Nenhuma fatura disponível</div>;

    return (
      <div className="p-3" style={{ backgroundColor: 'rgba(0,0,0,0.03)', width: '100%' }}>
        <div className="mb-3">
          <h5 style={{ fontSize: '16px', fontWeight: '600' }}>Detalhes da Fatura</h5>
          <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
            <div className="col-md-4 p-2">
              <p className="mb-1"><strong>Vencimento:</strong> {formatToBrazilianDateTime(bill.dueDate)}</p>
            </div>
            <div className="col-md-4 p-2">
              <p className="mb-1"><strong>Valor Total:</strong> {formatCurrency(bill.totalAmount, bill.totalAmountCurrencyCode)}</p>
            </div>
            <div className="col-md-4 p-2">
              <p className="mb-1"><strong>Pagamento Mínimo:</strong> {bill.minimumPaymentAmount ? 
                formatCurrency(bill.minimumPaymentAmount, bill.totalAmountCurrencyCode) : 'Não aplicável'}</p>
            </div>
          </div>
        </div>

        {bill.financeCharges && bill.financeCharges.length > 0 && (
          <div className="mt-3">
            <h6 style={{ fontSize: '14px', fontWeight: '600' }}>Encargos Financeiros</h6>
            <div className="table-responsive">
              <table className="table table-sm" style={{ backgroundColor: 'white', marginBottom: '0' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px 12px' }}>Tipo</th>
                    <th style={{ padding: '8px 12px' }}>Valor</th>
                    <th style={{ padding: '8px 12px' }}>Informações Adicionais</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.financeCharges.map((charge) => (
                    <tr key={charge.id}>
                      <td style={{ padding: '8px 12px' }}>{financeChargeTypes[charge.type] || charge.type}</td>
                      <td style={{ padding: '8px 12px' }}>{formatCurrency(charge.amount, charge.currencyCode)}</td>
                      <td style={{ padding: '8px 12px' }}>{charge.additionalInfo || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="row mt-3" style={{ marginLeft: 0, marginRight: 0 }}>
          <div className="col-md-6 p-2">
            <p className="mb-1"><small className="text-muted">Criado em: {formatToBrazilianDateTime(bill.createdAt)}</small></p>
          </div>
          <div className="col-md-6 p-2">
            <p className="mb-1"><small className="text-muted">Atualizado em: {formatToBrazilianDateTime(bill.updatedAt)}</small></p>
          </div>
        </div>
      </div>
    );
  };

  const renderTransactionDetails = (transactions) => {
    if (!transactions || transactions.length === 0) {
      return <div className="p-3 text-muted">Nenhuma transação disponível</div>;
    }

    return (
      <div className="p-3" style={{ backgroundColor: 'rgba(0,0,0,0.03)', width: '100%' }}>
        <div className="mb-3">
          <h5 style={{ fontSize: '16px', fontWeight: '600' }}>Transações</h5>
          <div className="table-responsive">
            <table className="table table-sm" style={{ backgroundColor: 'white', marginBottom: '0' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px 12px' }}>Data</th>
                  <th style={{ padding: '8px 12px' }}>Tipo</th>
                  <th style={{ padding: '8px 12px' }}>Movimentação</th>
                  <th style={{ padding: '8px 12px' }}>Valor</th>
                  <th style={{ padding: '8px 12px' }}>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td style={{ padding: '8px 12px' }}>{formatToBrazilianDateTime(transaction.date)}</td>
                    <td style={{ padding: '8px 12px' }}>{transactionTypes[transaction.type] || transaction.type}</td>
                    <td style={{ padding: '8px 12px' }}>{movementTypes[transaction.movementType] || transaction.movementType}</td>
                    <td style={{ padding: '8px 12px' }}>{formatCurrency(transaction.amount, transaction.currencyCode)}</td>
                    <td style={{ padding: '8px 12px' }}>{transaction.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = (rowId) => {
    switch (activeTab[rowId]) {
      case 'bills':
        return billsData[rowId] && billsData[rowId].length > 0 ? 
          billsData[rowId].map((bill, index) => (
            <div key={bill.id || index}>
              {renderBillDetails(bill)}
              {index < billsData[rowId].length - 1 && <hr className="my-3" />}
            </div>
          ))
          : renderBillDetails(null);
      case 'transactions':
        return renderTransactionDetails(transactionsData[rowId]);
      default:
        return null;
    }
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
              const isLoading = loadingData[rowId];
              const currentTab = activeTab[rowId];
              
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
                          {/* Tab Navigation with custom classes */}
                          <ul className="nav nav-tabs accounts-tab custom-tabs-container">
                            <li className="nav-item custom-tab-item">
                              <button
                                className={`nav-link custom-tab-button ${currentTab === 'bills' ? 'custom-tab-active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTab(prev => ({ ...prev, [rowId]: 'bills' }));
                                }}
                              >
                                Faturas
                              </button>
                            </li>
                            <li className="nav-item custom-tab-item">
                              <button
                                className={`nav-link custom-tab-button ${currentTab === 'transactions' ? 'custom-tab-active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTab(prev => ({ ...prev, [rowId]: 'transactions' }));
                                }}
                              >
                                Transações
                              </button>
                            </li>
                          </ul>
                          
                          {/* Tab Content */}
                          <div className="tab-content p-0">
                            {isLoading ? (
                              <div className="p-3 text-center">
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2">Carregando dados...</p>
                              </div>
                            ) : (
                              renderTabContent(rowId)
                            )}
                          </div>
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

export default TabelaAccounts;