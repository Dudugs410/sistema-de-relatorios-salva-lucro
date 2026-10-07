const BankData = ({ data, clickRow }) => {
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
    { key: 'automaticallyInvestedBalance', label: 'Saldo Investido Automaticamente', isMoney: true },
    { key: 'closingBalance', label: 'Saldo de Fechamento', isMoney: true },
    { key: 'overdraftContractedLimit', label: 'overdraftContractedLimit', isMoney: true },
    { key: 'overdraftUsedLimit', label: 'overdraftUsedLimit', isMoney: true },
    { key: 'transferNumber', label: 'Numero da Transferência'},
    { key: 'unarrangedOverdraftAmount', label: 'unarrangedOverdraftAmount', isMoney: true },

  ];

  return (
    <div className='dropShadow vendas-view'>
      <div className='table-wrapper'>
        <table className='table table-striped table-hover det-table-global'>
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
                    <td className='det-td-vendas-global' key={`${row.id || index}-${header.key}`}>
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankData;