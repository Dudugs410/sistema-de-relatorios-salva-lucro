const Tabela = ({ data, clickRow }) => {
  const isSingleObject = !Array.isArray(data) && typeof data === 'object'
  const displayData = isSingleObject ? [data] : data || []

  const headers = displayData[0] ? Object.keys(displayData[0]) : []

  const renderCellValue = (value) => {
    if (value === null || value === undefined) return '';

    // Strict check for ISO 8601 date strings (e.g., "2025-07-07T12:11:42.468Z")
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
      return new Date(value).toLocaleDateString('pt-BR') // "07/07/2025"
    }

    if (typeof value === 'object') {
      return JSON.stringify(value)
    }

    return value.toString()
  }

  if (headers.length === 0) {
    return <div className="p-3 text-center">No data available</div>
  }

  return (
    <div className='dropShadow vendas-view'>
      <div className='table-wrapper'>
        <table className='table table-striped table-hover det-table-global'>
          <thead>
            <tr className='det-tr-top-global'>
              {headers.map(header => (
                <th className='det-th-global' key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, index) => (
              <tr 
                className='det-tr-global row-pluggy' 
                key={row.id || index}
                onClick={() => clickRow?.(row)}
              >
                {headers.map(header => (
                  <td className='det-td-vendas-global' key={`${row.id || index}-${header}`}>
                    {renderCellValue(row[header])}
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

export default Tabela;