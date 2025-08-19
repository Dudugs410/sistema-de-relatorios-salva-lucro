import React, { useState } from "react";
import './subtable.scss'

const TabelaAccounts = ({ data, clickRow, loadBills, loadTransactions }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [loadingData, setLoadingData] = useState({});
  const [billsData, setBillsData] = useState({});
  const [transactionsData, setTransactionsData] = useState({});
  const [activeTab, setActiveTab] = useState({});
  const [loadedTabs, setLoadedTabs] = useState({});
  const [error, setError] = useState(null);

  const toggleRow = async (row) => {
    const rowId = row.id;
    const isExpanding = expandedRow !== rowId;
    
    setExpandedRow(isExpanding ? rowId : null);
    
    if (clickRow) clickRow(row);

    if (isExpanding) {
      setActiveTab(prev => ({ ...prev, [rowId]: null }));
    }
  };

  const handleTabClick = async (rowId, tabType) => {
    if (activeTab[rowId] === tabType) return;
    
    setActiveTab(prev => ({ ...prev, [rowId]: tabType }));
    
    if (!loadedTabs[`${rowId}-${tabType}`]) {
      try {
        setLoadingData(prev => ({ ...prev, [rowId]: true }));
        setError(null);
        
        let data;
        if (tabType === 'bills') {
          data = await loadBills(rowId);
          setBillsData(prev => ({ ...prev, [rowId]: data }));
        } else if (tabType === 'transactions') {
          data = await loadTransactions(rowId);
          setTransactionsData(prev => ({ ...prev, [rowId]: data }));
        }
        
        setLoadedTabs(prev => ({ ...prev, [`${rowId}-${tabType}`]: true }));
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
        setActiveTab(prev => ({ ...prev, [rowId]: null }));
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
  };

  const movementTypes = {
    'DEBIT': 'Débito',
    'CREDIT': 'Crédito',
  };

  const renderBillDetails = (bill) => {
    if (!bill) return <div className="p-3 text-muted">Nenhuma fatura disponível</div>;

    return (
      <div className="p-3 mobile-padding" style={{ backgroundColor: 'rgba(0,0,0,0.03)', width: '100%' }}>
        <div className="mb-3">
          <h5 className="mobile-header">Detalhes da Fatura</h5>
          <div className="row mobile-row">
            <div className="col-md-4 p-2 mobile-col">
              <p className="mb-1"><strong>Vencimento:</strong> {formatToBrazilianDateTime(bill.dueDate)}</p>
            </div>
            <div className="col-md-4 p-2 mobile-col">
              <p className="mb-1"><strong>Valor Total:</strong> {formatCurrency(bill.totalAmount, bill.totalAmountCurrencyCode)}</p>
            </div>
            <div className="col-md-4 p-2 mobile-col">
              <p className="mb-1"><strong>Pagamento Mínimo:</strong> {bill.minimumPaymentAmount ? 
                formatCurrency(bill.minimumPaymentAmount, bill.totalAmountCurrencyCode) : 'Não aplicável'}</p>
            </div>
          </div>
        </div>

        {bill.financeCharges && bill.financeCharges.length > 0 && (
          <div className="mt-3">
            <h6 className="mobile-subheader">Encargos Financeiros</h6>
            <div className="table-responsive">
              <table className="table table-sm mobile-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Informações Adicionais</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.financeCharges.map((charge) => (
                    <tr key={charge.id}>
                      <td>{financeChargeTypes[charge.type] || charge.type}</td>
                      <td>{formatCurrency(charge.amount, charge.currencyCode)}</td>
                      <td>{charge.additionalInfo || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="row mt-3 mobile-row">
          <div className="col-md-6 p-2 mobile-col">
            <p className="mb-1"><small className="text-muted">Criado em: {formatToBrazilianDateTime(bill.createdAt)}</small></p>
          </div>
          <div className="col-md-6 p-2 mobile-col">
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
      <div className="p-3 mobile-padding" style={{ backgroundColor: 'rgba(0,0,0,0.03)', width: '100%' }}>
        <div className="mb-3">
          <h5 className="mobile-header">Transações</h5>
          <div className="table-responsive">
            <table className="table table-sm mobile-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Movimentação</th>
                  <th>Valor</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatToBrazilianDateTime(transaction.date)}</td>
                    <td>{transactionTypes[transaction.type] || transaction.type}</td>
                    <td>{movementTypes[transaction.movementType] || transaction.movementType}</td>
                    <td>{formatCurrency(transaction.amount, transaction.currencyCode)}</td>
                    <td>{transaction.description || '-'}</td>
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
    const currentTab = activeTab[rowId];
    const isLoading = loadingData[rowId];

    if (isLoading) {
      return (
        <div className="p-3 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Carregando dados...</p>
        </div>
      );
    }

    switch (currentTab) {
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
        return (
          <div className="p-3 text-center text-muted">
            <p>Selecione uma aba para carregar os dados</p>
          </div>
        );
    }
  };

  const MobileCardView = () => {
    return (
      <div className="mobile-card-view">
        {data.map((row, index) => {
          const rowId = row.id || index;
          const isExpanded = expandedRow === rowId;
          const isLoading = loadingData[rowId];
          const currentTab = activeTab[rowId];
          
          return (
            <div 
              key={rowId} 
              className={`mobile-card ${isExpanded ? 'mobile-card-expanded' : ''} touch-feedback`}
              onClick={() => toggleRow(row)}
            >
              <div className="card-header">
                <div className="card-title">
                  <h4>{row.name || 'Conta'}</h4>
                  <p className="card-subtitle">{row.number || 'N/A'}</p>
                </div>
                <button 
                  className="expand-button touch-feedback"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRow(row);
                  }}
                  disabled={isLoading}
                  aria-label={isExpanded ? "Recolher" : "Expandir"}
                >
                  {isLoading ? (
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`} />
                  )}
                </button>
              </div>
              
              <div className="card-content">
                <div className="card-field">
                  <span className="label">Saldo:</span>
                  <span className="value">{formatCurrency(row.balance, row.currencyCode)}</span>
                </div>
                <div className="card-field">
                  <span className="label">Titular:</span>
                  <span className="value">{row.owner || '-'}</span>
                </div>
                <div className="card-field">
                  <span className="label">Tipo:</span>
                  <span className="value">{row.type || '-'}</span>
                </div>
                <div className="card-field">
                  <span className="label">Criado em:</span>
                  <span className="value">{row.createdAt ? formatToBrazilianDateTime(row.createdAt) : '-'}</span>
                </div>
              </div>
              
              {isExpanded && (
                <div 
                  className="card-expanded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mobile-tabs-container">
                    <div className="mobile-tabs">
                      <button
                        className={`mobile-tab ${currentTab === 'bills' ? 'mobile-tab-active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTabClick(rowId, 'bills');
                        }}
                        disabled={isLoading}
                      >
                        Faturas
                      </button>
                      <button
                        className={`mobile-tab ${currentTab === 'transactions' ? 'mobile-tab-active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTabClick(rowId, 'transactions');
                        }}
                        disabled={isLoading}
                      >
                        Transações
                      </button>
                    </div>
                    
                    <div className="mobile-tab-content">
                      {renderTabContent(rowId)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className='dropShadow vendas-view'>
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
      
      {/* Desktop Table */}
      <div className='table-wrapper desktop-only'>
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
                    className='det-tr-global row-pluggy touch-feedback' 
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
                          <ul className="nav nav-tabs accounts-tab custom-tabs-container">
                            <li className="nav-item custom-tab-item">
                              <button
                                className={`nav-link custom-tab-button ${currentTab === 'bills' ? 'custom-tab-active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTabClick(rowId, 'bills');
                                }}
                                disabled={isLoading}
                              >
                                Faturas
                              </button>
                            </li>
                            <li className="nav-item custom-tab-item">
                              <button
                                className={`nav-link custom-tab-button ${currentTab === 'transactions' ? 'custom-tab-active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTabClick(rowId, 'transactions');
                                }}
                                disabled={isLoading}
                              >
                                Transações
                              </button>
                            </li>
                          </ul>
                          
                          <div className="tab-content p-0">
                            {renderTabContent(rowId)}
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
      
      {/* Mobile Card View */}
      <div className='mobile-only'>
        <MobileCardView />
      </div>
    </div>
  );
};

export default TabelaAccounts;