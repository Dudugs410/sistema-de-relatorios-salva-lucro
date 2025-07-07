const TabelaAccounts = ({ data, clickRow }) => {
  // Define the headers and their corresponding data properties
  const headers = [
    { key: 'balance', label: 'Saldo' },
    { key: 'currencyCode', label: 'Moeda' },
    { key: 'name', label: 'nome' },
    { key: 'owner', label: 'titular' },
    { key: 'type', label: 'Tipo' },
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

export default TabelaAccounts