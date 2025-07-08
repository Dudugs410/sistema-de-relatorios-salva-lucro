const TabelaLoans = ({ data, clickRow }) => {
  // Define the headers and their corresponding data properties
  const headers = [
    { key: 'CET', label: 'CET' },
    { key: 'amortizationScheduled', label: 'Amortização Agendada' },
    { key: 'amortizationScheduledAdditionalInfo', label: 'Info Adicional Amortização' },
    { key: 'cnpjConsignee', label: 'CNPJ Consignado' },
    { key: 'contractAmount', label: 'Valor do Contrato' },
    { key: 'contractNumber', label: 'Número do Contrato' },
    { key: 'createdAt', label: 'Criado Em' },
    { key: 'currencyCode', label: 'Moeda' },
    { key: 'date', label: 'Data' },
    { key: 'disbursementDates', label: 'Datas do Desembolso' },
    { key: 'dueDate', label: 'Data Limite' },
    { key: 'firstInstallmentDueDate', label: 'Data Primeira Parcela' },
    { key: 'installmentPeriodicity', label: 'Periodicidade da Parcela' },
    { key: 'installmentPeriodicityAdditionalInfo', label: 'Info Adicional Parcela' },
    { key: 'productName', label: 'Nome do Produto' },
    { key: 'settlementDate', label: 'Data do Acordo' },
    { key: 'type', label: 'Tipo' },
    { key: 'updatedAt', label: 'Atualizado Em' },
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

export default TabelaLoans