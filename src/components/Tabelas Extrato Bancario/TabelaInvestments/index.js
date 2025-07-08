const TabelaInvestments = ({ data, clickRow }) => {
  // Define the headers and their corresponding data properties
  const headers = [
    { key: 'amount', label: 'Quantia' },
    { key: 'amountOriginal', label: 'Quantia Original' },
    { key: 'amountProfit', label: 'Lucro' },
    { key: 'amountWithdrawal', label: 'Quantidade Sacada' },
    { key: 'annualRate', label: 'Taxa Anual' },
    { key: 'balance', label: 'Saldo' },
    { key: 'code', label: 'Código' },
    { key: 'createdAt', label: 'Criado Em' },
    { key: 'currencyCode', label: 'Moeda' },
    { key: 'date', label: 'Data' },
    { key: 'issuer', label: 'issuer' },
    { key: 'issuerCNPJ', label: 'issuer CNPJ' },
    { key: 'lastMonthRate', label: 'taxa do último mês' },
    { key: 'lastTwelveMonthsRate', label: 'taxa últimos 12 meses' },
    { key: 'name', label: 'Nome' },
    { key: 'number', label: 'Número' },
    { key: 'owner', label: 'Titular' },
    { key: 'quantity', label: 'Quantidade' },
    { key: 'rate', label: 'taxa' },
    { key: 'rateType', label: 'Tipo de Taxa' },
    { key: 'status', label: 'Status' },
    { key: 'subtype', label: 'Subtipo' },
    { key: 'taxes', label: 'Taxas' },
    { key: 'taxes2', label: 'Taxas 2' },
    { key: 'type', label: 'Tipo' },
    { key: 'updatedAt', label: 'Atualizado Em' },
    { key: 'value', label: 'Valor' },
  ]

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
                {headers.map(header => (
                  <td className='det-td-vendas-global' key={`${row.id || index}-${header.key}`}>
                    {row[header.key] ?? '-'}  {/* Fallback to '-' if undefined/null */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TabelaInvestments