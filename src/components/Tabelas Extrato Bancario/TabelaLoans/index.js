const TabelaLoans = ({ data, clickRow }) => {
  // Function to check if a value is an ISO date string
  const isISODate = (value) => {
    if (typeof value !== 'string') return false;
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value);
  };

  // Function to format ISO date to Brazilian format
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

  // Function to format currency values
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
    
    // Default formatting for other currencies
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
  };

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
    { key: 'disbursementDates', label: 'Datas do Desembolso' },
    { key: 'dueDate', label: 'Data Limite', isDate: true },
    { key: 'firstInstallmentDueDate', label: 'Data Primeira Parcela', isDate: true },
    { key: 'installmentPeriodicity', label: 'Periodicidade da Parcela' },
    { key: 'installmentPeriodicityAdditionalInfo', label: 'Info Adicional Parcela' },
    { key: 'productName', label: 'Nome do Produto' },
    { key: 'settlementDate', label: 'Data do Acordo', isDate: true },
    { key: 'type', label: 'Tipo' },
    { key: 'updatedAt', label: 'Atualizado Em', isDate: true },
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

export default TabelaLoans;